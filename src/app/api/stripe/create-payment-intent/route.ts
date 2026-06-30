import { NextResponse } from "next/server";
import { getStripe } from "@/lib/backend/stripe";
import { createServerSupabase } from "@/lib/backend/supabase-ssr";
import { getSessionProfile } from "@/lib/backend/auth";

/**
 * Creates a Stripe PaymentIntent for an invoice's outstanding balance.
 *
 * - Must be signed in. The invoice is read via the user's session, so RLS
 *   ensures a dealer can only pay their own account's invoices.
 * - The amount comes from the invoice row, NEVER from the request body, so a
 *   client cannot under/over-pay or pay an invoice they cannot see.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  const profile = await getSessionProfile();
  if (!profile) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const { invoiceId } = await request.json().catch(() => ({ invoiceId: null }));
  if (!invoiceId) {
    return NextResponse.json({ ok: false, error: "invoiceId required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("id, account_id, balance, invoice_number")
    .eq("id", invoiceId)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ ok: false, error: "Invoice not found" }, { status: 404 });
  }
  if (Number(invoice.balance) <= 0) {
    return NextResponse.json({ ok: false, error: "Invoice already paid" }, { status: 409 });
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(invoice.balance) * 100), // cents
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      invoice_id: invoice.id,
      account_id: invoice.account_id ?? "",
      invoice_number: invoice.invoice_number,
    },
  });

  return NextResponse.json({ ok: true, clientSecret: intent.client_secret });
}
