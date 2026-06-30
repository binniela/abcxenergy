import Stripe from "stripe";

/**
 * Server-only Stripe client. The secret key never leaves the server.
 * Returns null when unconfigured so the app degrades gracefully in demo mode.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}
