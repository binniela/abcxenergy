import { getSessionProfile } from "@/lib/backend/auth";
import { Container } from "@/components/ui";
import { CheckoutClient, type PriceMap } from "@/components/checkout-client";
import { getStorefrontSkus } from "@/lib/storefront/catalog";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const profile = await getSessionProfile();
  const trade = profile?.role === "dealer" || profile?.role === "installer" || profile?.role === "staff";

  const prices: PriceMap = Object.fromEntries(
    getStorefrontSkus().map((sku) => [sku.id, { dealer: sku.dealerPrice, retail: sku.msrp }])
  );

  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 max-w-2xl text-ink-2">
        Choose how you want it: free will-call pickup in Newark, local jobsite
        delivery, or freight. {trade ? "Your Pro pricing and net terms are applied." : "Pay securely by card."}
      </p>
      <CheckoutClient prices={prices} trade={trade} accountName={profile?.name ?? null} />
    </Container>
  );
}
