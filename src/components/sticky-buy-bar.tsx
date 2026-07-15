import { AddToQuote } from "./add-to-quote";
import type { StorefrontSku } from "@/lib/storefront/catalog";

/* Mobile-only sticky purchase bar — keeps price + CTA in reach on long PDPs.
   Renders its own end-of-flow spacer so the fixed bar never covers content. */
export function StickyBuyBar({
  sku,
  priceLabel,
}: {
  sku: StorefrontSku;
  priceLabel: string;
}) {
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink-3">{sku.seriesName}</p>
            <p className="tnum font-display text-lg font-semibold leading-tight text-ink-1">
              {priceLabel}
            </p>
          </div>
          <AddToQuote sku={sku} size="md" />
        </div>
      </div>
    </>
  );
}
