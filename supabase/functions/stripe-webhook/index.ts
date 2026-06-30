// Supabase Edge Function (Deno). Deploy:
//   supabase functions deploy stripe-webhook --no-verify-jwt
//   supabase secrets set STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=...
//
// Then point a Stripe webhook at:
//   https://<project-ref>.functions.supabase.co/stripe-webhook
//
// Non-negotiables enforced here:
//  1) Verify the Stripe signature on every request (reject unsigned/forged POSTs).
//  2) Idempotency: apply_payment dedupes on the Stripe event id, so retries
//     never double-count.
import Stripe from "npm:stripe";
import { createClient } from "npm:@supabase/supabase-js";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

Deno.serve(async (request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await request.text();

  let event: Stripe.Event;
  try {
    // Async variant uses Web Crypto (required in Deno).
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const invoiceId = pi.metadata?.invoice_id;
    if (invoiceId) {
      const { error } = await supabase.rpc("apply_payment", {
        p_invoice_id: invoiceId,
        p_amount: pi.amount_received / 100,
        p_method: "stripe",
        p_reference: pi.id,
        p_stripe_event_id: event.id, // dedupe key
      });
      if (error) {
        console.error("apply_payment failed:", error.message);
        return new Response("Ledger update failed", { status: 500 });
      }
      // Best-effort receipt; do not fail the webhook if email is down.
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-receipt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ invoiceId }),
        });
      } catch {
        /* ignore */
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
