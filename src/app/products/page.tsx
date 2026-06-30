import { ProductCatalog } from "@/components/product-catalog";
import { getSeriesCardSummaries } from "@/lib/backend/services";

export const revalidate = 60;

export default async function ProductsPage() {
  const summaries = await getSeriesCardSummaries();
  return <ProductCatalog summaries={summaries} />;
}
