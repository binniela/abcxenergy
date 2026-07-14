import { demoInventoryLots, demoSkuDocuments, demoSkus } from "./mock-data";
import { summarizeInventory } from "./math";

export type SeriesCardSummary = {
  availableUnits: number;
  startingDealerPrice: number;
  skuCount: number;
};

export function getSeededSeriesCardSummary(slug: string): SeriesCardSummary {
  const summaries = new Map(summarizeInventory(demoInventoryLots).map((summary) => [summary.skuId, summary]));
  const skus = demoSkus.filter((sku) => sku.seriesSlug === slug);
  return {
    skuCount: skus.length,
    availableUnits: skus.reduce((sum, sku) => sum + (summaries.get(sku.id)?.available ?? 0), 0),
    startingDealerPrice: Math.min(...skus.map((sku) => sku.dealerPrice)),
  };
}

export type SeriesStartingPrices = {
  /** Lowest dealer (Pro) price across the series' SKUs. */
  dealer: number;
  /** Lowest MSRP (public retail) across the series' SKUs. */
  retail: number;
};

/** Representative starting prices for a series, by tier. Drives checkout line
 *  pricing in seeded mode and the public-vs-Pro price display. */
export function getSeriesStartingPrices(slug: string): SeriesStartingPrices {
  const skus = demoSkus.filter((sku) => sku.seriesSlug === slug);
  if (skus.length === 0) return { dealer: 0, retail: 0 };
  return {
    dealer: Math.min(...skus.map((sku) => sku.dealerPrice)),
    retail: Math.min(...skus.map((sku) => sku.msrp)),
  };
}

export function getSeededSeriesDocuments(slug: string) {
  const skuIds = new Set(demoSkus.filter((sku) => sku.seriesSlug === slug).map((sku) => sku.id));
  return demoSkuDocuments.filter((doc) => skuIds.has(doc.skuId));
}
