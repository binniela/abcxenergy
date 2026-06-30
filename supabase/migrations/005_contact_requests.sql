create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table contact_requests enable row level security;

drop policy if exists "anonymous insert contact requests" on contact_requests;
create policy "anonymous insert contact requests"
  on contact_requests for insert
  with check (true);

drop policy if exists "staff read contact requests" on contact_requests;
create policy "staff read contact requests"
  on contact_requests for select
  using (current_profile_role() = 'staff');
