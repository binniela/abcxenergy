import type { InventoryLot, InventorySummary, Invoice, OrderLine, QuoteLine } from "./types";

export function summarizeInventory(lots: InventoryLot[]): InventorySummary[] {
  const bySku = new Map<string, InventorySummary>();
  for (const lot of lots) {
    const current = bySku.get(lot.skuId) ?? {
      skuId: lot.skuId,
      onHand: 0,
      reserved: 0,
      available: 0,
      reorderPoint: lot.reorderPoint,
      status: "ready" as const,
    };
    current.onHand += lot.onHand;
    current.reserved += lot.reserved;
    current.available = current.onHand - current.reserved;
    current.reorderPoint = Math.max(current.reorderPoint, lot.reorderPoint);
    current.status =
      current.available <= 0
        ? "backorder"
        : current.available <= current.reorderPoint
          ? "low"
          : "ready";
    bySku.set(lot.skuId, current);
  }
  return [...bySku.values()];
}

export function availableForSku(lots: InventoryLot[], skuId: string): number {
  return summarizeInventory(lots).find((summary) => summary.skuId === skuId)?.available ?? 0;
}

export function quoteSubtotal(lines: Pick<QuoteLine, "quantity" | "unitPrice">[]): number {
  return roundMoney(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
}

export function orderFillRate(lines: OrderLine[]): number {
  const ordered = lines.reduce((sum, line) => sum + line.quantity, 0);
  if (ordered === 0) return 0;
  const shipped = lines.reduce((sum, line) => sum + line.shippedQuantity, 0);
  return Math.round((shipped / ordered) * 100);
}

export function invoiceBalance(invoice: Pick<Invoice, "total" | "paid">): number {
  return roundMoney(Math.max(0, invoice.total - invoice.paid));
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
