import { NextResponse } from "next/server";
import { resetSeededDemo } from "@/lib/backend/services";

export async function POST() {
  const data = resetSeededDemo();
  return NextResponse.json({
    ok: true,
    mode: "seeded",
    counts: {
      accounts: data.accounts.length,
      skus: data.skus.length,
      inventoryLots: data.inventoryLots.length,
      invoices: data.invoices.length,
      cases: data.rmas.length + data.warrantyClaims.length + data.rebateCases.length,
    },
  });
}
