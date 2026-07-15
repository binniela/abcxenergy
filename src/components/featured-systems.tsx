import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SkuCard } from "./sku-card";
import { getStorefrontSkus, type StorefrontSku } from "@/lib/storefront/catalog";

/* One representative unit per series lane, cheapest in-stock first — the
   homepage sells actual systems with actual prices, not abstractions. */
const FEATURED_SERIES = ["breezein", "multi-zone", "central-system", "light-commercial"];

export function getFeaturedSkus(): StorefrontSku[] {
  const skus = getStorefrontSkus();
  return FEATURED_SERIES.map((slug) =>
    skus
      .filter((sku) => sku.seriesSlug === slug && sku.available > 0)
      .sort((a, b) => a.msrp - b.msrp)[0]
  ).filter((sku): sku is StorefrontSku => Boolean(sku));
}

export function startingPrice(): number {
  return Math.min(...getStorefrontSkus().map((sku) => sku.msrp));
}

export function FeaturedSystems() {
  const featured = getFeaturedSkus();
  if (featured.length === 0) return null;

  return (
    <section className="border-b border-line bg-canvas py-12 lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1 sm:text-3xl">
              In stock in Newark right now
            </h2>
            <p className="mt-2 text-ink-2">
              Real units, real prices — same-day will-call pickup or Bay Area delivery.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
          >
            All {getStorefrontSkus().length} SKUs
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((sku, index) => (
            <SkuCard key={sku.id} sku={sku} priority={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
