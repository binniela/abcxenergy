-- ============================================================================
-- 003_ledger.sql
-- Double-entry general ledger. Every operational money event (invoice, payment,
-- inventory receipt, shipment/COGS) auto-posts a balanced journal entry. This is
-- the layer your CPA trusts: it produces a real trial balance, P&L, and balance
-- sheet. Operational tables (invoices/payments) remain the source of truth for
-- workflow; the ledger is the accounting projection.
-- ============================================================================

create type account_kind as enum ('asset', 'liability', 'equity', 'revenue', 'expense');

create table chart_of_accounts (
  code text primary key,
  name text not null,
  kind account_kind not null,
  normal_balance text not null check (normal_balance in ('debit', 'credit'))
);

create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  memo text not null,
  source_type text,
  source_id uuid,
  created_at timestamptz not null default now()
);

create table journal_lines (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references journal_entries(id) on delete cascade,
  account_code text not null references chart_of_accounts(code),
  debit numeric(14,2) not null default 0,
  credit numeric(14,2) not null default 0,
  constraint one_side_only check (
    (debit >= 0 and credit >= 0) and not (debit > 0 and credit > 0) and (debit > 0 or credit > 0)
  )
);

create index journal_lines_entry_idx on journal_lines (entry_id);
create index journal_lines_account_idx on journal_lines (account_code);

-- Seed a minimal but real chart of accounts.
insert into chart_of_accounts (code, name, kind, normal_balance) values
  ('1000', 'Cash',                 'asset',     'debit'),
  ('1100', 'Accounts Receivable',  'asset',     'debit'),
  ('1200', 'Inventory',            'asset',     'debit'),
  ('2000', 'Accounts Payable',     'liability', 'credit'),
  ('2100', 'Sales Tax Payable',    'liability', 'credit'),
  ('3000', 'Owner Equity',         'equity',    'credit'),
  ('4000', 'Sales Revenue',        'revenue',   'credit'),
  ('5000', 'Cost of Goods Sold',   'expense',   'debit')
on conflict (code) do nothing;

-- Post a balanced entry from a jsonb array of {account, debit, credit}.
create or replace function post_journal(
  p_memo text,
  p_source_type text,
  p_source_id uuid,
  p_lines jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_entry uuid;
  line jsonb;
  v_debits numeric(14,2) := 0;
  v_credits numeric(14,2) := 0;
begin
  insert into journal_entries (memo, source_type, source_id)
  values (p_memo, p_source_type, p_source_id)
  returning id into v_entry;

  for line in select * from jsonb_array_elements(p_lines) loop
    insert into journal_lines (entry_id, account_code, debit, credit)
    values (
      v_entry,
      line->>'account',
      coalesce((line->>'debit')::numeric, 0),
      coalesce((line->>'credit')::numeric, 0)
    );
    v_debits := v_debits + coalesce((line->>'debit')::numeric, 0);
    v_credits := v_credits + coalesce((line->>'credit')::numeric, 0);
  end loop;

  if v_debits <> v_credits then
    raise exception 'unbalanced journal entry: debits % <> credits %', v_debits, v_credits;
  end if;
  return v_entry;
end;
$$;

-- ── Auto-posting triggers ──────────────────────────────────────────────────

-- Invoice: Dr A/R (total), Cr Revenue (subtotal), Cr Sales Tax Payable (tax).
create or replace function trg_post_invoice()
returns trigger language plpgsql security definer set search_path = public as $$
declare lines jsonb;
begin
  lines := jsonb_build_array(
    jsonb_build_object('account', '1100', 'debit', new.total, 'credit', 0),
    jsonb_build_object('account', '4000', 'debit', 0, 'credit', new.subtotal)
  );
  if new.tax > 0 then
    lines := lines || jsonb_build_object('account', '2100', 'debit', 0, 'credit', new.tax);
  end if;
  perform post_journal('Invoice ' || new.invoice_number, 'invoice', new.id, lines);
  return new;
end;
$$;
create trigger post_invoice after insert on invoices
  for each row execute function trg_post_invoice();

-- Payment: Dr Cash, Cr A/R.
create or replace function trg_post_payment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform post_journal(
    'Payment ' || coalesce(new.reference, new.id::text), 'payment', new.id,
    jsonb_build_array(
      jsonb_build_object('account', '1000', 'debit', new.amount, 'credit', 0),
      jsonb_build_object('account', '1100', 'debit', 0, 'credit', new.amount)
    )
  );
  return new;
end;
$$;
create trigger post_payment after insert on payments
  for each row execute function trg_post_payment();

-- Inventory movement: receipt → Dr Inventory / Cr A/P; shipment → Dr COGS / Cr Inventory.
-- Valued at SKU cost. Reservations/adjustments do not hit the GL.
create or replace function trg_post_movement()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_cost numeric(14,2);
begin
  select cost * new.quantity into v_cost from skus where id = new.sku_id;
  if v_cost is null or v_cost = 0 then return new; end if;

  if new.movement_type = 'receipt' then
    perform post_journal('Receipt ' || new.id::text, 'inventory_receipt', new.id,
      jsonb_build_array(
        jsonb_build_object('account', '1200', 'debit', v_cost, 'credit', 0),
        jsonb_build_object('account', '2000', 'debit', 0, 'credit', v_cost)
      ));
  elsif new.movement_type = 'shipment' then
    perform post_journal('COGS ' || new.id::text, 'inventory_shipment', new.id,
      jsonb_build_array(
        jsonb_build_object('account', '5000', 'debit', v_cost, 'credit', 0),
        jsonb_build_object('account', '1200', 'debit', 0, 'credit', v_cost)
      ));
  end if;
  return new;
end;
$$;
create trigger post_movement after insert on inventory_movements
  for each row execute function trg_post_movement();

-- ── Reporting: trial balance ───────────────────────────────────────────────
create or replace view trial_balance as
  select coa.code, coa.name, coa.kind,
         sum(jl.debit) as total_debit,
         sum(jl.credit) as total_credit,
         case when coa.normal_balance = 'debit'
              then sum(jl.debit) - sum(jl.credit)
              else sum(jl.credit) - sum(jl.debit) end as balance
  from chart_of_accounts coa
  left join journal_lines jl on jl.account_code = coa.code
  group by coa.code, coa.name, coa.kind, coa.normal_balance
  order by coa.code;

-- ── RLS: staff-only read of the books ──────────────────────────────────────
alter table chart_of_accounts enable row level security;
alter table journal_entries enable row level security;
alter table journal_lines enable row level security;

create policy "staff read chart" on chart_of_accounts for select using (current_profile_role() = 'staff');
create policy "staff read journal entries" on journal_entries for select using (current_profile_role() = 'staff');
create policy "staff read journal lines" on journal_lines for select using (current_profile_role() = 'staff');
