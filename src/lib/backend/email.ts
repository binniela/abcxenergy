import "server-only";
import { Resend } from "resend";
import { createServiceRoleSupabaseClient } from "./supabase";

/**
 * Transactional email via Resend. SERVER ONLY (the API key never reaches the
 * browser). Every function is best-effort: failures are logged, not thrown, so
 * a flaky email provider never breaks an order or payment.
 */

const FROM = process.env.EMAIL_FROM ?? "ABC X-Energy <orders@abcxenergy.com>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const resend = getResend();
  if (!resend || !to) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("Resend send failed:", err);
  }
}

/** First contact email on an account, or null. */
async function accountEmail(accountId: string | null): Promise<string | null> {
  if (!accountId) return null;
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("contacts")
    .select("email")
    .eq("account_id", accountId)
    .limit(1)
    .single();
  return data?.email ?? null;
}

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export async function sendInvoiceEmail(invoiceId: string): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) return;
  const { data: inv } = await supabase
    .from("invoices")
    .select("invoice_number, total, balance, due_date, account_id")
    .eq("id", invoiceId)
    .single();
  if (!inv) return;

  const to = await accountEmail(inv.account_id);
  if (!to) return;

  await send(
    to,
    `Invoice ${inv.invoice_number} from ABC X-Energy`,
    `<h2>Invoice ${inv.invoice_number}</h2>
     <p>Total: <strong>${money(Number(inv.total))}</strong></p>
     <p>Balance due: <strong>${money(Number(inv.balance))}</strong> by ${inv.due_date}</p>
     <p>Reply to this email or call us with any questions.</p>`
  );
}

export async function sendReceiptEmail(invoiceId: string): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) return;
  const { data: inv } = await supabase
    .from("invoices")
    .select("invoice_number, total, paid, balance, account_id")
    .eq("id", invoiceId)
    .single();
  if (!inv) return;

  const to = await accountEmail(inv.account_id);
  if (!to) return;

  await send(
    to,
    `Payment received - Invoice ${inv.invoice_number}`,
    `<h2>Thank you, payment received</h2>
     <p>Invoice ${inv.invoice_number}</p>
     <p>Paid to date: <strong>${money(Number(inv.paid))}</strong></p>
     <p>Remaining balance: <strong>${money(Number(inv.balance))}</strong></p>`
  );
}

export async function sendOrderConfirmation(orderId: string): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) return;
  const { data: order } = await supabase
    .from("sales_orders")
    .select("order_number, total, account_id")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const to = await accountEmail(order.account_id);
  if (!to) return;

  await send(
    to,
    `Order ${order.order_number} confirmed`,
    `<h2>Order ${order.order_number} confirmed</h2>
     <p>Order total: <strong>${money(Number(order.total))}</strong></p>
     <p>We will follow up with shipment and tracking details.</p>`
  );
}
