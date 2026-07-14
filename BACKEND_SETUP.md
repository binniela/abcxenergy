# Backend setup — provisioning checklist

All application code, migrations, Edge Functions, and email/cron jobs are
written and the Next app builds. These steps connect it to live cloud services
(the parts that need your accounts/keys). Run them in order.

## 0. Supabase project + env
1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Apply migrations (in order) + seed:
   ```bash
   supabase link --project-ref <ref>
   supabase db push          # applies 001 → 002 → 003 → 004
   psql "$DATABASE_URL" -f supabase/seed.sql
   ```
4. `getOperationsMode()` now returns `"supabase"`; the admin dashboard reads live data.

## 1. Auth — first staff user
```bash
set -a; source .env.local; set +a
npm run seed:staff -- staff@summithvacsupply.com 'StrongPass!23' 'Avery Stocke'
```
Visit `/portal/login`, sign in, land on `/admin`. A non-staff session is
redirected, and (more importantly) blocked by RLS + the `assert_staff()` guard
even with a crafted request.

## 2. Stripe
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_... STRIPE_WEBHOOK_SECRET=whsec_...
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy send-receipt
```
- Set `STRIPE_SECRET_KEY` in `.env.local` too (used by the PaymentIntent route).
- In the Stripe dashboard, add a webhook to
  `https://<ref>.functions.supabase.co/stripe-webhook` for `payment_intent.succeeded`.
- Test idempotency: `stripe trigger payment_intent.succeeded` twice with the same
  event → exactly one `payments` row (dedup on `stripe_event_id`).

## 3. Resend + scheduled jobs
```bash
supabase secrets set RESEND_API_KEY=re_... EMAIL_FROM="Summit HVAC Supply <orders@summithvacsupply.com>" OPS_ALERT_EMAIL=ops@summithvacsupply.com
supabase functions deploy low-stock-alert
supabase functions deploy ar-statements
```
Then enable the cron schedules by filling the private config once:
```sql
insert into private.app_config (functions_base_url, service_role_key)
values ('https://<ref>.functions.supabase.co', '<service-role-key>');
```
(`004_cron.sql` already created the `low-stock-alert-daily` and
`ar-statements-monthly` schedules.)

## 4. Books (already live)
`003_ledger.sql` auto-posts a balanced journal entry on every invoice, payment,
and inventory receipt/shipment. Check the books with:
```sql
select * from trial_balance;
```

## Security invariants (built in, keep them)
- **RLS + `assert_staff()`** gate every operational write in the database.
- **Stripe webhook** verifies the signature and is idempotent on the event id.
- **Secrets are server-only**: service-role, Stripe secret, and Resend keys never
  ship to the browser.
