import { SERIES } from "@/lib/products";
import { createDemoOperationsData } from "./mock-data";
import { invoiceBalance, summarizeInventory } from "./math";
import {
  contactRequestSchema,
  dealerApplicationSchema,
  quoteRequestSchema,
} from "./schemas";
import { createServerSupabaseClient, hasSupabaseEnv } from "./supabase";
import type {
  Account,
  ContactRequestInput,
  DealerApplicationInput,
  InventorySummary,
  OperationsData,
  PersonaRole,
  QuoteRequestInput,
  Sku,
} from "./types";

const data = createDemoOperationsData();

export type OperationsOverview = {
  mode: "supabase" | "seeded";
  kpis: {
    availableUnits: number;
    reservedUnits: number;
    openQuoteRequests: number;
    openQuotes: number;
    reservedOrders: number;
    openInvoiceBalance: number;
    lowStockSkus: number;
    openCases: number;
  };
  inventory: Array<InventorySummary & { sku: Sku; seriesName: string; binCodes: string[] }>;
  quoteRequests: OperationsData["quoteRequests"];
  quotes: OperationsData["quotes"];
  orders: OperationsData["salesOrders"];
  invoices: OperationsData["invoices"];
  purchaseOrders: OperationsData["purchaseOrders"];
  rmas: OperationsData["rmas"];
  warrantyClaims: OperationsData["warrantyClaims"];
  rebateCases: OperationsData["rebateCases"];
  tasks: OperationsData["tasks"];
  activity: OperationsData["activity"];
  accounts: Account[];
};

export type PortalOverview = {
  role: PersonaRole;
  account: Account;
  userName: string;
  priceTier: string;
  quotes: OperationsData["quotes"];
  orders: OperationsData["salesOrders"];
  invoices: OperationsData["invoices"];
  tasks: OperationsData["tasks"];
  rmas: OperationsData["rmas"];
  warrantyClaims: OperationsData["warrantyClaims"];
  rebateCases: OperationsData["rebateCases"];
  recommendedSkus: Array<Sku & { available: number; seriesName: string }>;
};

export type SeriesBackendSummary = {
  skus: Array<Sku & { available: number; status: InventorySummary["status"] }>;
  availableUnits: number;
  startingDealerPrice: number;
  documents: OperationsData["skuDocuments"];
};

export function getOperationsMode(): "supabase" | "seeded" {
  return hasSupabaseEnv() ? "supabase" : "seeded";
}

export async function getOperationsOverview(): Promise<OperationsOverview> {
  return buildOperationsOverview(data);
}

export async function getPortalOverview(role: PersonaRole): Promise<PortalOverview> {
  const user = data.users.find((candidate) => candidate.role === role) ?? data.users[0];
  const account = data.accounts.find((candidate) => candidate.id === user.accountId) ?? data.accounts[0];
  const accountScoped = <T extends { accountId: string }>(items: T[]) =>
    role === "staff" ? items : items.filter((item) => item.accountId === account.id);
  const inventory = inventoryBySku();

  return {
    role,
    account,
    userName: user.name,
    priceTier: account.priceTier,
    quotes: accountScoped(data.quotes),
    orders: accountScoped(data.salesOrders),
    invoices: accountScoped(data.invoices),
    tasks: role === "staff" ? data.tasks : data.tasks.filter((task) => task.accountId === account.id || task.ownerRole === role),
    rmas: accountScoped(data.rmas),
    warrantyClaims: accountScoped(data.warrantyClaims),
    rebateCases: accountScoped(data.rebateCases),
    recommendedSkus: data.skus.slice(0, role === "homeowner" ? 3 : 6).map((sku) => ({
      ...sku,
      available: inventory.get(sku.id)?.available ?? 0,
      seriesName: seriesName(sku.seriesSlug),
    })),
  };
}

export async function getSeriesBackendSummary(slug: string): Promise<SeriesBackendSummary> {
  const summaries = inventoryBySku();
  const skus = data.skus
    .filter((sku) => sku.seriesSlug === slug)
    .map((sku) => {
      const summary = summaries.get(sku.id);
      return {
        ...sku,
        available: summary?.available ?? 0,
        status: summary?.status ?? "backorder",
      };
    });
  const documents = data.skuDocuments.filter((doc) => skus.some((sku) => sku.id === doc.skuId));
  return {
    skus,
    documents,
    availableUnits: skus.reduce((sum, sku) => sum + sku.available, 0),
    startingDealerPrice: Math.min(...skus.map((sku) => sku.dealerPrice)),
  };
}

export async function getCatalogBackendSummaries(): Promise<Record<string, SeriesBackendSummary>> {
  const entries = await Promise.all(SERIES.map(async (series) => [series.slug, await getSeriesBackendSummary(series.slug)] as const));
  return Object.fromEntries(entries);
}

export async function createQuoteRequest(input: unknown) {
  const parsed = quoteRequestSchema.parse(input);
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("quote_requests")
      .insert({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        need: parsed.need,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    if (inserted && parsed.lines.length > 0) {
      const { error: lineError } = await supabase.from("quote_request_lines").insert(
        parsed.lines.map((line) => ({
          quote_request_id: inserted.id,
          series_slug: line.seriesSlug,
          product_name: line.productName,
          quantity: line.quantity,
        }))
      );
      if (lineError) throw new Error(lineError.message);
    }
    return { id: inserted?.id, mode: "supabase" as const };
  }

  return {
    id: `qr-demo-${Date.now()}`,
    mode: "seeded" as const,
    prepared: toPreparedQuote(parsed),
  };
}

export async function createDealerApplication(input: unknown) {
  const parsed = dealerApplicationSchema.parse(input);
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("dealer_applications")
      .insert({
        company: parsed.company,
        contact_name: parsed.contactName,
        email: parsed.email,
        phone: parsed.phone,
        license_number: parsed.licenseNumber,
        service_area: parsed.serviceArea,
        business_type: parsed.businessType,
        monthly_volume: parsed.monthlyVolume,
        brands: parsed.brands,
        notes: parsed.notes,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted?.id, mode: "supabase" as const };
  }

  return {
    id: `dealer-demo-${Date.now()}`,
    mode: "seeded" as const,
    status: "pending_review",
    company: parsed.company,
  };
}

export async function createContactRequest(input: unknown) {
  const parsed = contactRequestSchema.parse(input);
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const { data: inserted, error } = await supabase
      .from("tasks")
      .insert({
        title: `${parsed.topic}: ${parsed.name}`,
        status: "open",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted?.id, mode: "supabase" as const };
  }

  return {
    id: `contact-demo-${Date.now()}`,
    mode: "seeded" as const,
    title: `${parsed.topic}: ${parsed.name}`,
  };
}

export function roleCanAccessAccount(role: PersonaRole, accountId: string, requestedAccountId: string): boolean {
  return role === "staff" || accountId === requestedAccountId;
}

export function resetSeededDemo() {
  return createDemoOperationsData();
}

function buildOperationsOverview(source: OperationsData): OperationsOverview {
  const inventorySummaries = summarizeInventory(source.inventoryLots);
  const inventory = inventorySummaries.map((summary) => {
    const sku = source.skus.find((candidate) => candidate.id === summary.skuId)!;
    return {
      ...summary,
      sku,
      seriesName: seriesName(sku.seriesSlug),
      binCodes: source.inventoryLots
        .filter((lot) => lot.skuId === sku.id)
        .map((lot) => lot.binCode),
    };
  });
  const openInvoiceBalance = source.invoices
    .filter((invoice) => invoice.status === "open" || invoice.status === "overdue" || invoice.status === "partial")
    .reduce((sum, invoice) => sum + invoiceBalance(invoice), 0);
  return {
    mode: getOperationsMode(),
    kpis: {
      availableUnits: inventory.reduce((sum, item) => sum + item.available, 0),
      reservedUnits: inventory.reduce((sum, item) => sum + item.reserved, 0),
      openQuoteRequests: source.quoteRequests.filter((request) => request.status === "new").length,
      openQuotes: source.quotes.filter((quote) => quote.status === "sent" || quote.status === "draft").length,
      reservedOrders: source.salesOrders.filter((order) => order.status === "reserved").length,
      openInvoiceBalance,
      lowStockSkus: inventory.filter((item) => item.status !== "ready").length,
      openCases: [...source.rmas, ...source.warrantyClaims, ...source.rebateCases].filter((record) => record.status === "open" || record.status === "waiting").length,
    },
    inventory,
    quoteRequests: source.quoteRequests,
    quotes: source.quotes,
    orders: source.salesOrders,
    invoices: source.invoices,
    purchaseOrders: source.purchaseOrders,
    rmas: source.rmas,
    warrantyClaims: source.warrantyClaims,
    rebateCases: source.rebateCases,
    tasks: source.tasks,
    activity: source.activity,
    accounts: source.accounts,
  };
}

function inventoryBySku() {
  return new Map(summarizeInventory(data.inventoryLots).map((summary) => [summary.skuId, summary]));
}

function seriesName(slug: string): string {
  return SERIES.find((series) => series.slug === slug)?.name ?? slug;
}

function toPreparedQuote(parsed: QuoteRequestInput) {
  return {
    customer: parsed.name,
    lineCount: parsed.lines.length,
    unitCount: parsed.lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

export type { ContactRequestInput, DealerApplicationInput, QuoteRequestInput };
