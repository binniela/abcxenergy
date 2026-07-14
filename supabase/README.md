# Summit HVAC Supply Supabase Demo Backend

This folder contains the Supabase-ready wholesale operations backend for the sales demo.

## Files
- `migrations/001_wholesale_demo.sql` creates the operating schema, enums, indexes-by-constraint, and RLS policies.
- `seed.sql` loads the seeded demo company, personas, TCL SKUs, inventory, quotes, orders, invoices, PO, RMA, warranty, rebate, and task scenarios.

## Environment
Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

If these values are absent, the Next app uses the seeded TypeScript fallback under `src/lib/backend` so the demo remains clickable.

## Demo Workspaces
- `/admin` staff operations
- `/portal/dealer` dealer portal
- `/portal/installer` installer workspace
- `/portal/homeowner` homeowner referral workspace
- `/portal` role selector

## Reset
The local fallback can be checked with:

```bash
curl -X POST http://127.0.0.1:3020/api/demo/reset
```

For a real Supabase project, rerun the migration and `seed.sql` from the Supabase SQL editor or CLI.
