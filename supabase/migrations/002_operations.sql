-- ============================================================================
-- 002_operations.sql
-- Operational write-paths as atomic Postgres functions + Stripe idempotency.
--
-- Authorization is enforced IN THE DATABASE: each staff function checks
-- current_profile_role() = 'staff' and raises on anything else. Functions are
-- SECURITY DEFINER so they may touch child tables that have no per-row staff
-- policy, but the role guard means a dealer/installer session cannot run them.
-- ============================================================================

-- Stripe idempotency: dedupe webhook deliveries on the Stripe event id.
alter table payments add column if not exists stripe_event_id text;
create unique index if not exists payments_stripe_event_id_key
  on payments (stripe_event_id) where stripe_event_id is not null;

-- Document sequences (human-readable numbers).
create sequence if not exists seq_order_number start 1001;
create sequence if not exists seq_invoice_number start 5001;
create sequence if not exists seq_shipment_number start 9001;
create sequence if not exists seq_receipt_number start 7001;

create or replace function assert_staff()
returns void language plpgsql stable as $$
begin
  if current_profile_role() is distinct from 'staff' then
    raise exception 'forbidden: staff role required' using errcode = '42501';
  end if;
end;
$$;

-- ── Quote → Sales Order ────────────────────────────────────────────────────
create or replace function convert_quote_to_order(p_quote_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_order uuid;
  v_account uuid;
  v_subtotal numeric(12,2);
begin
  perform assert_staff();

  select account_id into v_account from quotes where id = p_quote_id;
  if not found then raise exception 'quote % not found', p_quote_id; end if;

  insert into sales_orders (order_number, quote_id, account_id, status, subtotal, total)
  values ('SO-' || nextval('seq_order_number'), p_quote_id, v_account, 'pending', 0, 0)
  returning id into v_order;

  insert into order_lines (order_id, sku_id, quantity, unit_price)
  select v_order, sku_id, quantity, unit_price from quote_lines where quote_id = p_quote_id;

  select coalesce(sum(quantity * unit_price), 0) into v_subtotal
  from order_lines where order_id = v_order;

  update sales_orders set subtotal = v_subtotal, total = v_subtotal where id = v_order;
  update quotes set status = 'approved' where id = p_quote_id;
  return v_order;
end;
$$;

-- ── Reserve stock for an order (FIFO across lots) ──────────────────────────
create or replace function reserve_order(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  l record;
  lot record;
  v_need int;
  v_alloc int;
  v_fully boolean := true;
begin
  perform assert_staff();

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
      values (l.sku_id, lot.id, 'reservation', v_alloc, 'sales_order', p_order_id, 'Reserved for order');
      update order_lines set reserved_quantity = reserved_quantity + v_alloc where id = l.id;
      v_need := v_need - v_alloc;
    end loop;
    if v_need > 0 then v_fully := false; end if;
  end loop;

  update sales_orders set status = case when v_fully then 'reserved' else 'pending' end
  where id = p_order_id;
end;
$$;

-- ── Ship a reserved order ──────────────────────────────────────────────────
create or replace function ship_order(p_order_id uuid, p_carrier text default null, p_tracking text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_ship uuid;
  res record;
  v_all_shipped boolean := true;
  l record;
begin
  perform assert_staff();

  insert into shipments (order_id, shipment_number, carrier, tracking_number, status, shipped_at)
  values (p_order_id, 'SHP-' || nextval('seq_shipment_number'), p_carrier, p_tracking, 'shipped', now())
  returning id into v_ship;

  for res in
    select r.*, ol.sku_id from inventory_reservations r
    join order_lines ol on ol.id = r.order_line_id
    where ol.order_id = p_order_id and r.status = 'active'
  loop
    update inventory_lots
      set on_hand = on_hand - res.quantity, reserved = reserved - res.quantity
      where id = res.lot_id;
    update inventory_reservations set status = 'shipped' where id = res.id;
    update order_lines set shipped_quantity = shipped_quantity + res.quantity where id = res.order_line_id;
    insert into inventory_movements (sku_id, lot_id, movement_type, quantity, reference_type, reference_id, note)
    values (res.sku_id, res.lot_id, 'shipment', res.quantity, 'shipment', v_ship, 'Shipped');
  end loop;

  for l in select * from order_lines where order_id = p_order_id loop
    if l.shipped_quantity < l.quantity then v_all_shipped := false; end if;
  end loop;

  update sales_orders set status = case when v_all_shipped then 'shipped' else 'partially_shipped' end
  where id = p_order_id;
  return v_ship;
end;
$$;

-- ── Receive a purchase order into stock ────────────────────────────────────
create or replace function receive_purchase_order(p_po_id uuid, p_warehouse_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_receipt uuid;
  pol record;
  v_lot uuid;
  v_qty int;
  v_all boolean := true;
  v_po_number text;
begin
  perform assert_staff();
  select po_number into v_po_number from purchase_orders where id = p_po_id;

  insert into receipts (purchase_order_id, receipt_number, warehouse_id)
  values (p_po_id, 'RCV-' || nextval('seq_receipt_number'), p_warehouse_id)
  returning id into v_receipt;

  for pol in select * from purchase_order_lines where purchase_order_id = p_po_id loop
    v_qty := pol.quantity - pol.received_quantity;
    continue when v_qty <= 0;

    select id into v_lot from inventory_lots
      where sku_id = pol.sku_id and warehouse_id = p_warehouse_id
      order by created_at asc limit 1;

    if v_lot is null then
      insert into inventory_lots (sku_id, warehouse_id, lot_code, on_hand)
      values (pol.sku_id, p_warehouse_id, coalesce(v_po_number, 'PO') || '-' || substr(pol.sku_id::text, 1, 8), v_qty)
      returning id into v_lot;
    else
      update inventory_lots set on_hand = on_hand + v_qty where id = v_lot;
    end if;

    insert into inventory_movements (sku_id, lot_id, movement_type, quantity, reference_type, reference_id, note)
    values (pol.sku_id, v_lot, 'receipt', v_qty, 'receipt', v_receipt, 'Received from PO');
    update purchase_order_lines set received_quantity = quantity where id = pol.id;
  end loop;

  for pol in select * from purchase_order_lines where purchase_order_id = p_po_id loop
    if pol.received_quantity < pol.quantity then v_all := false; end if;
  end loop;

  update purchase_orders set status = case when v_all then 'received' else 'partially_received' end
  where id = p_po_id;
  return v_receipt;
end;
$$;

-- ── Manual stock adjustment (positive or negative delta) ───────────────────
create or replace function adjust_inventory(p_lot_id uuid, p_delta int, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_sku uuid;
begin
  perform assert_staff();
  select sku_id into v_sku from inventory_lots where id = p_lot_id;
  if not found then raise exception 'lot % not found', p_lot_id; end if;

  update inventory_lots set on_hand = on_hand + p_delta where id = p_lot_id;
  insert into inventory_movements (sku_id, lot_id, movement_type, quantity, reference_type, note)
  values (v_sku, p_lot_id, 'adjustment', abs(p_delta), 'manual', coalesce(p_note, 'Manual adjustment'));
end;
$$;

-- ── Invoice an order (invoices what shipped, falling back to ordered qty) ───
create or replace function invoice_order(p_order_id uuid, p_due_date date default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_invoice uuid;
  v_account uuid;
  v_subtotal numeric(12,2);
begin
  perform assert_staff();
  select account_id into v_account from sales_orders where id = p_order_id;
  if not found then raise exception 'order % not found', p_order_id; end if;

  insert into invoices (invoice_number, order_id, account_id, status, subtotal, tax, total, paid, balance, due_date)
  values ('INV-' || nextval('seq_invoice_number'), p_order_id, v_account, 'open', 0, 0, 0, 0, 0,
          coalesce(p_due_date, current_date + 30))
  returning id into v_invoice;

  insert into invoice_lines (invoice_id, description, quantity, unit_price, line_total)
  select v_invoice,
         coalesce(s.title, 'SKU ' || ol.sku_id::text),
         greatest(ol.shipped_quantity, ol.quantity),
         ol.unit_price,
         greatest(ol.shipped_quantity, ol.quantity) * ol.unit_price
  from order_lines ol left join skus s on s.id = ol.sku_id
  where ol.order_id = p_order_id;

  select coalesce(sum(line_total), 0) into v_subtotal from invoice_lines where invoice_id = v_invoice;
  update invoices set subtotal = v_subtotal, total = v_subtotal, balance = v_subtotal where id = v_invoice;
  update accounts set balance = balance + v_subtotal where id = v_account;
  return v_invoice;
end;
$$;

-- ── Apply a payment (idempotent on stripe_event_id) ────────────────────────
-- Callable by the Stripe webhook (service role, no auth.uid) or by staff for
-- manual payments. Not callable by a logged-in non-staff user.
create or replace function apply_payment(
  p_invoice_id uuid,
  p_amount numeric,
  p_method text,
  p_reference text default null,
  p_stripe_event_id text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_existing uuid;
  v_payment uuid;
  v_account uuid;
  v_total numeric(12,2);
  v_paid numeric(12,2);
begin
  if current_profile_role() is distinct from 'staff' and auth.uid() is not null then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  -- Idempotency: a replayed webhook is a no-op that returns the same row.
  if p_stripe_event_id is not null then
    select id into v_existing from payments where stripe_event_id = p_stripe_event_id;
    if v_existing is not null then return v_existing; end if;
  end if;

  select account_id, total, paid into v_account, v_total, v_paid
  from invoices where id = p_invoice_id;
  if not found then raise exception 'invoice % not found', p_invoice_id; end if;

  insert into payments (invoice_id, account_id, amount, method, reference, stripe_event_id)
  values (p_invoice_id, v_account, p_amount, p_method, p_reference, p_stripe_event_id)
  returning id into v_payment;

  v_paid := v_paid + p_amount;
  update invoices
    set paid = v_paid,
        balance = v_total - v_paid,
        status = case when v_total - v_paid <= 0 then 'paid' else 'partial' end
    where id = p_invoice_id;

  if v_account is not null then
    update accounts set balance = balance - p_amount where id = v_account;
  end if;
  return v_payment;
end;
$$;

-- ── Low-stock detection (used by the reorder-alert job) ────────────────────
create or replace view low_stock_skus as
  select s.id as sku_id, s.sku, s.title,
         sum(il.on_hand) as on_hand,
         sum(il.reserved) as reserved,
         sum(il.on_hand - il.reserved) as available,
         min(il.reorder_point) as reorder_point
  from skus s
  join inventory_lots il on il.sku_id = s.id
  group by s.id, s.sku, s.title
  having sum(il.on_hand - il.reserved) <= min(il.reorder_point);

-- Grants: callable by authenticated sessions (role guard does the gating).
grant execute on function convert_quote_to_order(uuid) to authenticated;
grant execute on function reserve_order(uuid) to authenticated;
grant execute on function ship_order(uuid, text, text) to authenticated;
grant execute on function receive_purchase_order(uuid, uuid) to authenticated;
grant execute on function adjust_inventory(uuid, int, text) to authenticated;
grant execute on function invoice_order(uuid, date) to authenticated;
grant execute on function apply_payment(uuid, numeric, text, text, text) to authenticated, service_role;
