create extension if not exists "pgcrypto";

create type app_role as enum ('staff', 'dealer', 'installer', 'homeowner');
create type account_type as enum ('dealer', 'installer', 'homeowner', 'supplier', 'internal');
create type inventory_movement_type as enum ('receipt', 'shipment', 'adjustment', 'reservation', 'release', 'rma');
create type quote_status as enum ('requested', 'draft', 'sent', 'approved', 'expired');
create type order_status as enum ('pending', 'reserved', 'partially_shipped', 'shipped', 'cancelled');
create type invoice_status as enum ('draft', 'open', 'partial', 'paid', 'overdue', 'void');
create type po_status as enum ('draft', 'sent', 'partially_received', 'received', 'cancelled');
create type case_status as enum ('open', 'waiting', 'approved', 'closed');

create table accounts (
  id uuid primary key default gen_random_uuid(),
  type account_type not null,
  name text not null,
  status text not null default 'active',
  price_tier text not null default 'standard',
  credit_limit numeric(12,2) not null default 0,
  balance numeric(12,2) not null default 0,
  service_area text,
  license_number text,
  created_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role text,
  created_at timestamptz not null default now()
);

create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  role app_role not null,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table dealer_applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  license_number text,
  service_area text,
  business_type text,
  monthly_volume text,
  brands text,
  notes text,
  status text not null default 'pending_review',
  created_at timestamptz not null default now()
);

create table product_series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  family text not null,
  type text not null,
  image text not null,
  category text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  issuer text not null,
  href text,
  image text
);

create table skus (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references product_series(id) on delete cascade,
  sku text not null unique,
  model_number text not null,
  title text not null,
  btu integer not null,
  voltage text not null,
  unit_type text not null,
  cost numeric(12,2) not null,
  dealer_price numeric(12,2) not null,
  msrp numeric(12,2) not null,
  dimensions text not null,
  weight_lbs numeric(8,2) not null,
  refrigerant text not null,
  ahri_reference text,
  warranty_compressor text not null,
  warranty_parts text not null,
  is_active boolean not null default true
);

create table sku_certifications (
  sku_id uuid references skus(id) on delete cascade,
  certification_id uuid references certifications(id) on delete cascade,
  primary key (sku_id, certification_id)
);

create table sku_documents (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid references skus(id) on delete cascade,
  kind text not null,
  title text not null,
  storage_path text,
  request_action text not null default 'request'
);

create table warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  address text not null,
  is_primary boolean not null default false
);

create table bins (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references warehouses(id) on delete cascade,
  code text not null,
  zone text not null,
  unique (warehouse_id, code)
);

create table inventory_lots (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references skus(id) on delete cascade,
  warehouse_id uuid not null references warehouses(id) on delete cascade,
  bin_id uuid references bins(id) on delete set null,
  lot_code text not null,
  on_hand integer not null default 0,
  reserved integer not null default 0,
  reorder_point integer not null default 4,
  created_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references skus(id) on delete cascade,
  lot_id uuid references inventory_lots(id) on delete set null,
  movement_type inventory_movement_type not null,
  quantity integer not null,
  reference_type text,
  reference_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  need text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table quote_request_lines (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references quote_requests(id) on delete cascade,
  series_slug text not null,
  product_name text not null,
  quantity integer not null
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  account_id uuid references accounts(id) on delete set null,
  status quote_status not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  valid_until date,
  created_at timestamptz not null default now()
);

create table quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  sku_id uuid not null references skus(id),
  quantity integer not null,
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) not null
);

create table sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  quote_id uuid references quotes(id) on delete set null,
  account_id uuid references accounts(id) on delete set null,
  status order_status not null default 'pending',
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references sales_orders(id) on delete cascade,
  sku_id uuid not null references skus(id),
  quantity integer not null,
  reserved_quantity integer not null default 0,
  shipped_quantity integer not null default 0,
  unit_price numeric(12,2) not null
);

create table inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_line_id uuid not null references order_lines(id) on delete cascade,
  lot_id uuid not null references inventory_lots(id),
  quantity integer not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references sales_orders(id) on delete cascade,
  shipment_number text not null unique,
  carrier text,
  tracking_number text,
  status text not null default 'ready',
  shipped_at timestamptz
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  order_id uuid references sales_orders(id) on delete set null,
  account_id uuid references accounts(id) on delete set null,
  status invoice_status not null default 'open',
  subtotal numeric(12,2) not null,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  paid numeric(12,2) not null default 0,
  balance numeric(12,2) not null,
  due_date date,
  created_at timestamptz not null default now()
);

create table invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity integer not null,
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) not null
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  amount numeric(12,2) not null,
  method text not null,
  reference text,
  received_at timestamptz not null default now()
);

create table credits (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete set null,
  invoice_id uuid references invoices(id) on delete set null,
  amount numeric(12,2) not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text not null unique,
  supplier_account_id uuid references accounts(id) on delete set null,
  status po_status not null default 'draft',
  total numeric(12,2) not null default 0,
  expected_at date,
  created_at timestamptz not null default now()
);

create table purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  sku_id uuid not null references skus(id),
  quantity integer not null,
  received_quantity integer not null default 0,
  unit_cost numeric(12,2) not null
);

create table receipts (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references purchase_orders(id) on delete set null,
  receipt_number text not null unique,
  warehouse_id uuid references warehouses(id) on delete set null,
  received_at timestamptz not null default now()
);

create table rmas (
  id uuid primary key default gen_random_uuid(),
  rma_number text not null unique,
  order_id uuid references sales_orders(id) on delete set null,
  account_id uuid references accounts(id) on delete set null,
  sku_id uuid references skus(id) on delete set null,
  status case_status not null default 'open',
  reason text not null,
  created_at timestamptz not null default now()
);

create table warranty_claims (
  id uuid primary key default gen_random_uuid(),
  claim_number text not null unique,
  account_id uuid references accounts(id) on delete set null,
  sku_id uuid references skus(id) on delete set null,
  serial_number text,
  status case_status not null default 'open',
  issue text not null,
  created_at timestamptz not null default now()
);

create table rebate_cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique,
  account_id uuid references accounts(id) on delete set null,
  program text not null,
  customer_name text not null,
  status case_status not null default 'open',
  required_documents text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete set null,
  title text not null,
  owner_role app_role not null default 'staff',
  status text not null default 'open',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  body text not null,
  created_by uuid references user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references user_profiles(id) on delete set null,
  account_id uuid references accounts(id) on delete set null,
  event text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

alter table accounts enable row level security;
alter table contacts enable row level security;
alter table user_profiles enable row level security;
alter table dealer_applications enable row level security;
alter table product_series enable row level security;
alter table certifications enable row level security;
alter table skus enable row level security;
alter table sku_certifications enable row level security;
alter table sku_documents enable row level security;
alter table warehouses enable row level security;
alter table bins enable row level security;
alter table inventory_lots enable row level security;
alter table inventory_movements enable row level security;
alter table quote_requests enable row level security;
alter table quote_request_lines enable row level security;
alter table quotes enable row level security;
alter table quote_lines enable row level security;
alter table sales_orders enable row level security;
alter table order_lines enable row level security;
alter table inventory_reservations enable row level security;
alter table shipments enable row level security;
alter table invoices enable row level security;
alter table invoice_lines enable row level security;
alter table payments enable row level security;
alter table credits enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_lines enable row level security;
alter table receipts enable row level security;
alter table rmas enable row level security;
alter table warranty_claims enable row level security;
alter table rebate_cases enable row level security;
alter table tasks enable row level security;
alter table notes enable row level security;
alter table activity_log enable row level security;

create or replace function current_profile_role()
returns app_role
language sql
security definer
stable
as $$
  select role from user_profiles where id = auth.uid()
$$;

create or replace function current_profile_account()
returns uuid
language sql
security definer
stable
as $$
  select account_id from user_profiles where id = auth.uid()
$$;

create policy "public catalog read" on product_series for select using (true);
create policy "public sku read" on skus for select using (true);
create policy "public certification read" on certifications for select using (true);
create policy "public sku cert read" on sku_certifications for select using (true);
create policy "public document read" on sku_documents for select using (true);
create policy "public warehouse read" on warehouses for select using (true);
create policy "public bin read" on bins for select using (true);
create policy "public inventory read" on inventory_lots for select using (true);

create policy "staff full accounts" on accounts for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "account read own" on accounts for select using (id = current_profile_account());
create policy "staff full contacts" on contacts for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "contacts read own account" on contacts for select using (account_id = current_profile_account());
create policy "profiles read self" on user_profiles for select using (id = auth.uid() or current_profile_role() = 'staff');

create policy "anonymous insert dealer applications" on dealer_applications for insert with check (true);
create policy "staff read dealer applications" on dealer_applications for select using (current_profile_role() = 'staff');
create policy "anonymous insert quote requests" on quote_requests for insert with check (true);
create policy "anonymous insert quote request lines" on quote_request_lines for insert with check (true);

create policy "staff all quotes" on quotes for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "own account quotes" on quotes for select using (account_id = current_profile_account());
create policy "staff all quote lines" on quote_lines for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');

create policy "staff all orders" on sales_orders for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "own account orders" on sales_orders for select using (account_id = current_profile_account());
create policy "staff all invoices" on invoices for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "own account invoices" on invoices for select using (account_id = current_profile_account());

create policy "staff operational tables" on inventory_movements for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "staff purchase orders" on purchase_orders for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "staff purchase order lines" on purchase_order_lines for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "staff receipts" on receipts for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "staff reservations" on inventory_reservations for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');
create policy "staff shipments" on shipments for all using (current_profile_role() = 'staff') with check (current_profile_role() = 'staff');

create policy "staff and own rmas" on rmas for select using (current_profile_role() = 'staff' or account_id = current_profile_account());
create policy "staff and own warranty" on warranty_claims for select using (current_profile_role() = 'staff' or account_id = current_profile_account());
create policy "staff and own rebate" on rebate_cases for select using (current_profile_role() = 'staff' or account_id = current_profile_account());
create policy "staff and own tasks" on tasks for select using (current_profile_role() = 'staff' or account_id = current_profile_account());
create policy "staff and own notes" on notes for select using (current_profile_role() = 'staff' or account_id = current_profile_account());
create policy "staff activity" on activity_log for select using (current_profile_role() = 'staff');
