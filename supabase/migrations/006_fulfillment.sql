-- ============================================================================
-- 006_fulfillment.sql
-- Local fulfillment as a first-class purchase path: pickup / local delivery /
-- freight. Adds delivery zones, fulfillment fields on sales_orders, a
-- public-checkout reserve function, and a staff fulfillment-status advancer.
--
-- Design notes:
--  * order_status (the enum) is left alone; the pickup/delivery lifecycle lives
--    in a separate text column `fulfillment_status` with a CHECK, so we never
--    have to ALTER an enum mid-migration (which Postgres forbids in-txn).
--  * delivery_zones is the AUTHORITATIVE source of the delivery fee. The
--    checkout route resolves the fee from this table server-side, so a client
--    can never spoof a cheaper delivery fee.
-- ============================================================================

-- ── Delivery zones (ZIP -> serving warehouse, fee, lead time) ───────────────
create table if not exists delivery_zones (
  zip text primary key,
  label text not null,
  warehouse_id uuid references warehouses(id) on delete set null,
  local_delivery_eligible boolean not null default true,
  delivery_fee numeric(12,2) not null default 0,
  free_delivery_over numeric(12,2) not null default 0,
  lead_time_hours integer not null default 24,
  created_at timestamptz not null default now()
);

alter table delivery_zones enable row level security;
create policy "public delivery zone read" on delivery_zones for select using (true);
create policy "staff manage delivery zones" on delivery_zones for all
  using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');

-- ── Fulfillment fields on sales orders ──────────────────────────────────────
alter table sales_orders add column if not exists fulfillment_method text
  check (fulfillment_method in ('pickup', 'local_delivery', 'freight'));
alter table sales_orders add column if not exists fulfillment_fee numeric(12,2) not null default 0;
alter table sales_orders add column if not exists delivery_zip text;
alter table sales_orders add column if not exists delivery_address text;
alter table sales_orders add column if not exists fulfillment_window text;
alter table sales_orders add column if not exists pickup_warehouse_id uuid references warehouses(id) on delete set null;
alter table sales_orders add column if not exists fulfillment_status text not null default 'pending'
  check (fulfillment_status in ('pending', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'picked_up', 'cancelled'));
-- Buyer contact for guest (non-account) retail checkout.
alter table sales_orders add column if not exists buyer_name text;
alter table sales_orders add column if not exists buyer_email text;
alter table sales_orders add column if not exists paid boolean not null default false;

-- Cart lines are series-level at checkout (the buyer hasn't picked a specific
-- SKU yet — same as the quote flow). Allow a null SKU + a text description;
-- staff bind the exact SKU when they pick/stage the order.
alter table order_lines alter column sku_id drop not null;
alter table order_lines add column if not exists description text;

-- ── Reserve stock for a PUBLIC checkout order (no staff guard) ──────────────
-- Mirrors reserve_order's FIFO allocation but is callable by the trusted
-- server-side checkout (service_role only). NOT granted to anon/authenticated,
-- so a logged-in dealer/installer session cannot call it directly.
create or replace function reserve_public_order(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  l record;
  lot record;
  v_need int;
  v_alloc int;
  v_fully boolean := true;
begin
  for l in select * from order_lines where order_id = p_order_id loop
    v_need := l.quantity - l.reserved_quantity;
    for lot in
      select * from inventory_lots
      where sku_id = l.sku_id and (on_hand - reserved) > 0
      order by created_at asc
    loop
      exit when v_need <= 0;
      v_alloc := least(v_need, lot.on_hand - lot.reserved);
      update inventory_lots set reserved = reserved + v_alloc where id = lot.id;
      insert into inventory_reservations (order_line_id, lot_id, quantity, status)
      values (l.id, lot.id, v_alloc, 'active');
      insert into inventory_movements (sku_id, lot_id, movement_type, quantity, reference_type, reference_id, note)
      values (l.sku_id, lot.id, 'reservation', v_alloc, 'sales_order', p_order_id, 'Reserved at checkout');
      update order_lines set reserved_quantity = reserved_quantity + v_alloc where id = l.id;
      v_need := v_need - v_alloc;
    end loop;
    if v_need > 0 then v_fully := false; end if;
  end loop;

  update sales_orders set status = case when v_fully then 'reserved' else 'pending' end
  where id = p_order_id;
end;
$$;

-- ── Mark an order paid (idempotent on stripe_event_id) ──────────────────────
-- Called by the Stripe webhook for order-level PaymentIntents (metadata
-- order_id). Records a payment-style audit row is overkill here; we just flip
-- the flag and record nothing twice.
create table if not exists order_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references sales_orders(id) on delete cascade,
  amount numeric(12,2) not null,
  stripe_event_id text unique,
  created_at timestamptz not null default now()
);
alter table order_payments enable row level security;
create policy "staff read order payments" on order_payments for select
  using (current_profile_role() = 'staff');

create or replace function mark_order_paid(p_order_id uuid, p_amount numeric, p_stripe_event_id text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_existing uuid;
  v_row uuid;
begin
  if p_stripe_event_id is not null then
    select id into v_existing from order_payments where stripe_event_id = p_stripe_event_id;
    if v_existing is not null then return v_existing; end if;
  end if;

  insert into order_payments (order_id, amount, stripe_event_id)
  values (p_order_id, p_amount, p_stripe_event_id)
  returning id into v_row;

  update sales_orders set paid = true where id = p_order_id;
  return v_row;
end;
$$;

-- ── Advance the fulfillment status (staff only) ─────────────────────────────
create or replace function advance_fulfillment(p_order_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform assert_staff();
  if p_status not in ('pending', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'picked_up', 'cancelled') then
    raise exception 'invalid fulfillment status %', p_status;
  end if;
  update sales_orders set fulfillment_status = p_status where id = p_order_id;
end;
$$;

grant execute on function reserve_public_order(uuid) to service_role;
grant execute on function mark_order_paid(uuid, numeric, text) to service_role;
grant execute on function advance_fulfillment(uuid, text) to authenticated;
