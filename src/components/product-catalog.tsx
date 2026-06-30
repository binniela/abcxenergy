import { Container, Eyebrow } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { ProductCatalogControls } from "@/components/product-catalog-controls";
import { SERIES } from "@/lib/products";
import type { SeriesCardSummary } from "@/lib/backend/catalog";

export function ProductCatalog({
  summaries,
}: {
  summaries: Record<string, SeriesCardSummary>;
}) {
  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container className="py-12 lg:py-14">
          <Eyebrow>The TCL lineup</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
            Find the right system, by the numbers.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-2">
            Filter by ducting, zones, SEER2, and capacity. Every card carries the
            same Spec &amp; Stock strip so you can compare at a glance and add to a
            quote in one tap.
          </p>
        </Container>
      </section>

      <Container className="py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <ProductCatalogControls
            series={SERIES.map((series) => ({
              slug: series.slug,
              category: series.category,
              ducted: series.ducted,
              zones: series.zones,
              seer2: series.seer2,
              btuMin: series.btuMin,
              btuMax: series.btuMax,
            }))}
          />

          <div>
            <p id="catalog-result-count" className="mb-5 font-mono text-xs uppercase tracking-wider text-ink-3">
              {SERIES.length} series available
            </p>
            <div id="catalog-empty-state" hidden className="rounded-[--r-md] border border-dashed border-line-strong bg-surface-2/40 p-12 text-center">
              <p className="text-ink-2">No series match those filters.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {SERIES.map((s, index) => (
                <div key={s.slug} data-series-card={s.slug}>
                  <ProductCard key={s.slug} series={s} ops={summaries[s.slug]} priority={index < 2} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
