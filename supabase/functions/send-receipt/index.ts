// Sends a payment receipt for one invoice. Invoked by the stripe-webhook
// function after apply_payment succeeds.
//   supabase functions deploy send-receipt
//   supabase secrets set RESEND_API_KEY=... EMAIL_FROM="Summit HVAC Supply <orders@summithvacsupply.com>"
import { Resend } from "npm:resend";
import { createClient } from "npm:@supabase/supabase-js";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
const FROM = Deno.env.get("EMAIL_FROM") ?? "Summit HVAC Supply <orders@summithvacsupply.com>";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

Deno.serve(async (req) => {
  const { invoiceId } = await req.json().catch(() => ({ invoiceId: null }));
  if (!invoiceId) return new Response("invoiceId required", { status: 400 });

  const { data: inv } = await supabase
    .from("invoices")
    .select("invoice_number, total, paid, balance, account_id")
    .eq("id", invoiceId)
    .single();
  if (!inv) return new Response("not found", { status: 404 });

  const { data: contact } = await supabase
    .from("contacts")
    .select("email")
    .eq("account_id", inv.account_id)
    .limit(1)
    .single();
  if (!contact?.email) return new Response(JSON.stringify({ skipped: "no contact" }));

  await resend.emails.send({
    from: FROM,
    to: contact.email,
    subject: `Payment received - Invoice ${inv.invoice_number}`,
    html: `<h2>Payment received</h2>
      <p>Invoice ${inv.invoice_number}</p>
      <p>Paid to date: <strong>${money(Number(inv.paid))}</strong></p>
      <p>Remaining balance: <strong>${money(Number(inv.balance))}</strong></p>`,
  });

  return new Response(JSON.stringify({ sent: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
