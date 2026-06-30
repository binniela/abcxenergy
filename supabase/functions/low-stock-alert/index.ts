// Emails staff a low-stock reorder alert. Scheduled daily via pg_cron (004).
//   supabase functions deploy low-stock-alert
import { Resend } from "npm:resend";
import { createClient } from "npm:@supabase/supabase-js";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
const FROM = Deno.env.get("EMAIL_FROM") ?? "ABC X-Energy <orders@abcxenergy.com>";
const OPS = Deno.env.get("OPS_ALERT_EMAIL") ?? "ops@abcxenergy.com";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

Deno.serve(async () => {
  const { data: rows } = await supabase
    .from("low_stock_skus")
    .select("sku, title, available, reorder_point");

  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ lowStock: 0 }));
  }

  const list = rows
    .map(
      (r) =>
        `<tr><td>${r.sku}</td><td>${r.title}</td><td>${r.available}</td><td>${r.reorder_point}</td></tr>`
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: OPS,
    subject: `Low stock: ${rows.length} SKU(s) at or below reorder point`,
    html: `<h2>Reorder alert</h2>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead><tr><th>SKU</th><th>Title</th><th>Available</th><th>Reorder point</th></tr></thead>
        <tbody>${list}</tbody>
      </table>`,
  });

  return new Response(JSON.stringify({ lowStock: rows.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
