import { NextResponse } from "next/server";
import { productHref, searchStorefrontSkus } from "@/lib/storefront/catalog";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = searchStorefrontSkus(q).map((sku) => ({
    id: sku.id,
    sku: sku.sku,
    modelNumber: sku.modelNumber,
    title: sku.title,
    btu: sku.btu,
    voltage: sku.voltage,
    unitType: sku.unitType,
    available: sku.available,
    href: productHref(sku),
  }));
  return NextResponse.json({ ok: true, results });
}
