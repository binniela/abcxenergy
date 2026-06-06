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

export function getSeededSeriesDocuments(slug: string) {
  const skuIds = new Set(demoSkus.filter((sku) => sku.seriesSlug === slug).map((sku) => sku.id));
  return demoSkuDocuments.filter((doc) => skuIds.has(doc.skuId));
}
