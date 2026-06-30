/**
 * Create (or update) a staff auth user + user_profiles row.
 *
 *   npx tsx scripts/create-staff-user.ts staff@abcxenergy.com 'StrongPass!23' 'Avery Stocke'
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env
 * (load .env.local first, e.g. `set -a; source .env.local; set +a`).
 */
import { createClient } from "@supabase/supabase-js";

const [email, password, name = "Staff User"] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error("Usage: tsx scripts/create-staff-user.ts <email> <password> [name]");
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !created.user) {
    throw new Error(error?.message ?? "Could not create auth user");
  }

  const { error: profileError } = await admin.from("user_profiles").upsert({
    id: created.user.id,
    role: "staff",
    name,
    email,
    account_id: null,
  });
  if (profileError) throw new Error(profileError.message);

  console.log(`✓ Staff user ready: ${email} (${created.user.id})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
