import { ProductCatalog } from "@/components/product-catalog";

export const revalidate = 60;

export const metadata = {
  title: "TCL HVAC SKUs - Search Stock, Specs & Pricing",
  description:
    "Search Summit HVAC Supply SKUs by model, BTU, voltage, unit type, stock, documents, and contractor pricing.",
};

export default function ProductsPage() {
  return <ProductCatalog />;
}
