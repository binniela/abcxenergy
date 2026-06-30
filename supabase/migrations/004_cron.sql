-- ============================================================================
-- 004_cron.sql
-- Schedule the recurring email jobs via pg_cron, invoking the Edge Functions
-- over HTTP with pg_net. Secrets are read from a private config table you fill
-- once (kept out of source control), not hardcoded here.
-- ============================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

create schema if not exists private;

-- Fill this in once (service_role key is sensitive; this table is not exposed
-- via the API because the `private` schema is not in the PostgREST search path):
--   insert into private.app_config (functions_base_url, service_role_key)
--   values ('https://<project-ref>.functions.supabase.co', '<service-role-key>');
create table if not exists private.app_config (
  id boolean primary key default true check (id),
  functions_base_url text not null,
  service_role_key text not null
);

create or replace function private.invoke_function(p_name text)
returns void language plpgsql security definer set search_path = private, public as $$
declare cfg private.app_config;
begin
  select * into cfg from private.app_config limit 1;
  if not found then
    raise notice 'private.app_config is empty; skipping %', p_name;
    return;
  end if;
  perform net.http_post(
    url := cfg.functions_base_url || '/' || p_name,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cfg.service_role_key
    ),
    body := '{}'::jsonb
  );
end;
$$;

-- Daily low-stock reorder alert at 14:00 UTC.
select cron.schedule(
  'low-stock-alert-daily',
  '0 14 * * *',
  $$ select private.invoke_function('low-stock-alert'); $$
);

-- Monthly AR statements at 09:00 UTC on the 1st.
select cron.schedule(
  'ar-statements-monthly',
  '0 9 1 * *',
  $$ select private.invoke_function('ar-statements'); $$
);
