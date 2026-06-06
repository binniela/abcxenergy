import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  availableForSku,
  invoiceBalance,
  orderFillRate,
  quoteSubtotal,
  summarizeInventory,
} from "../src/lib/backend/math";
import { createDemoOperationsData } from "../src/lib/backend/mock-data";
import { roleCanAccessAccount } from "../src/lib/backend/services";
import type { InventoryLot, OrderLine } from "../src/lib/backend/types";

describe("backend inventory math", () => {
  const lots: InventoryLot[] = [
    {
      id: "lot-a",
      skuId: "sku-a",
      warehouseId: "wh",
      binCode: "A-01",
      lotCode: "LOT-A",
      onHand: 10,
      reserved: 3,
      reorderPoint: 4,
    },
    {
      id: "lot-b",
      skuId: "sku-a",
      warehouseId: "wh",
      binCode: "A-02",
      lotCode: "LOT-B",
      onHand: 2,
      reserved: 2,
      reorderPoint: 4,
    },
  ];

  it("calculates available as on hand minus reserved", () => {
    assert.equal(availableForSku(lots, "sku-a"), 7);
  });

  it("rolls up SKU lots and assigns stock state", () => {
    assert.deepEqual(summarizeInventory(lots), [
      {
        skuId: "sku-a",
        onHand: 12,
        reserved: 5,
        available: 7,
        reorderPoint: 4,
        status: "ready",
      },
    ]);
  });
});

describe("backend order and invoice math", () => {
  it("calculates quote subtotal from line quantities", () => {
    assert.equal(
      quoteSubtotal([
        { quantity: 2, unitPrice: 1090 },
        { quantity: 1, unitPrice: 865 },
      ]),
      3045
    );
  });

  it("calculates invoice balance from mock payment ledger", () => {
    assert.equal(invoiceBalance({ total: 5291.95, paid: 436.25 }), 4855.7);
  });

  it("calculates order fill rate", () => {
    const lines: OrderLine[] = [
      {
        orderId: "order",
        skuId: "sku-a",
        quantity: 4,
        reservedQuantity: 4,
        shippedQuantity: 2,
        unitPrice: 100,
      },
      {
        orderId: "order",
        skuId: "sku-b",
        quantity: 1,
        reservedQuantity: 1,
        shippedQuantity: 1,
        unitPrice: 200,
      },
    ];
    assert.equal(orderFillRate(lines), 60);
  });
});

describe("role-based account access", () => {
  it("allows staff to inspect any account", () => {
    assert.equal(roleCanAccessAccount("staff", "acct-a", "acct-b"), true);
  });

  it("limits non-staff roles to their own account", () => {
    assert.equal(roleCanAccessAccount("dealer", "acct-a", "acct-a"), true);
    assert.equal(roleCanAccessAccount("dealer", "acct-a", "acct-b"), false);
  });
});

describe("seeded quote-to-order-to-invoice flow", () => {
  it("links the seeded sales path end to end", () => {
    const data = createDemoOperationsData();
    const quote = data.quotes.find((candidate) => candidate.quoteNumber === "Q-2026-1042");
    assert.ok(quote);
    const order = data.salesOrders.find((candidate) => candidate.quoteId === quote.id);
    assert.ok(order);
    const invoice = data.invoices.find((candidate) => candidate.orderId === order.id);
    assert.ok(invoice);
    assert.equal(order.total, quote.total);
    assert.equal(invoice.total, quote.total);
    assert.equal(invoiceBalance(invoice), invoice.balance);
  });
});
