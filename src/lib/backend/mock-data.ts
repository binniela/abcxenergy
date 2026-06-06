import { SERIES } from "@/lib/products";
import type {
  Account,
  Activity,
  CaseRecord,
  Contact,
  DemoUser,
  InventoryLot,
  Invoice,
  OperationsData,
  OrderLine,
  PurchaseOrder,
  Quote,
  QuoteLine,
  QuoteRequest,
  SalesOrder,
  Sku,
  SkuDocument,
  Task,
  Warehouse,
} from "./types";

export const demoAccounts: Account[] = [
  {
    id: "acct-internal",
    type: "internal",
    name: "ABC X-Energy",
    status: "active",
    priceTier: "internal",
    creditLimit: 0,
    balance: 0,
    serviceArea: "CA, OR, WA, NV, AZ",
  },
  {
    id: "acct-dealer-bay",
    type: "dealer",
    name: "Bay Area Mechanical Supply",
    status: "active",
    priceTier: "gold",
    creditLimit: 75000,
    balance: 8420,
    serviceArea: "California",
    licenseNumber: "C20-983422",
  },
  {
    id: "acct-installer-summit",
    type: "installer",
    name: "Summit HVAC Installers",
    status: "active",
    priceTier: "standard",
    creditLimit: 25000,
    balance: 1280,
    serviceArea: "California",
    licenseNumber: "C20-771144",
  },
  {
    id: "acct-homeowner-chen",
    type: "homeowner",
    name: "Maria Chen Residence",
    status: "active",
    priceTier: "retail_referral",
    creditLimit: 0,
    balance: 0,
    serviceArea: "San Jose, CA",
  },
  {
    id: "acct-supplier-tcl",
    type: "supplier",
    name: "TCL HVAC North America",
    status: "active",
    priceTier: "supplier",
    creditLimit: 0,
    balance: 0,
  },
];

export const demoContacts: Contact[] = [
  {
    id: "contact-andre",
    accountId: "acct-dealer-bay",
    name: "Andre Lewis",
    email: "andre@bayareamech.example",
    phone: "(415) 555-0144",
    role: "Purchasing Manager",
  },
  {
    id: "contact-nina",
    accountId: "acct-installer-summit",
    name: "Nina Patel",
    email: "nina@summithvac.example",
    phone: "(510) 555-0198",
    role: "Owner",
  },
  {
    id: "contact-maria",
    accountId: "acct-homeowner-chen",
    name: "Maria Chen",
    email: "maria.chen@example.com",
    phone: "(408) 555-0188",
    role: "Homeowner",
  },
];

export const demoUsers: DemoUser[] = [
  {
    id: "user-staff",
    accountId: "acct-internal",
    role: "staff",
    name: "Operations Manager",
    email: "ops@abcxenergy.example",
  },
  {
    id: "user-dealer",
    accountId: "acct-dealer-bay",
    role: "dealer",
    name: "Andre Lewis",
    email: "andre@bayareamech.example",
  },
  {
    id: "user-installer",
    accountId: "acct-installer-summit",
    role: "installer",
    name: "Nina Patel",
    email: "nina@summithvac.example",
  },
  {
    id: "user-homeowner",
    accountId: "acct-homeowner-chen",
    role: "homeowner",
    name: "Maria Chen",
    email: "maria.chen@example.com",
  },
];

export const demoSkus: Sku[] = [
  {
    id: "sku-brz-09",
    seriesSlug: "breezein",
    sku: "TCL-BRZ-09HP-230",
    modelNumber: "BREEZEIN-09-230V",
    title: "BreezeIN 9k Wall Mount Heat Pump",
    btu: 9000,
    voltage: "208/230V",
    unitType: "single-zone wall mount",
    cost: 590,
    dealerPrice: 865,
    msrp: 1299,
    dimensions: "34 x 12 x 9 in",
    weightLbs: 31,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482101",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek"],
  },
  {
    id: "sku-brz-24",
    seriesSlug: "breezein",
    sku: "TCL-BRZ-24HP-230",
    modelNumber: "BREEZEIN-24-230V",
    title: "BreezeIN 24k Wall Mount Heat Pump",
    btu: 24000,
    voltage: "208/230V",
    unitType: "single-zone wall mount",
    cost: 1120,
    dealerPrice: 1585,
    msrp: 2349,
    dimensions: "43 x 13 x 10 in",
    weightLbs: 43,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482102",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek"],
  },
  {
    id: "sku-frs-12",
    seriesSlug: "freshin",
    sku: "TCL-FRS-12IAQ-230",
    modelNumber: "FRESHIN-12-230V",
    title: "FreshIN 12k Fresh Air Split",
    btu: 12000,
    voltage: "208/230V",
    unitType: "fresh-air wall mount",
    cost: 770,
    dealerPrice: 1095,
    msrp: 1649,
    dimensions: "36 x 13 x 10 in",
    weightLbs: 36,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482201",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek"],
  },
  {
    id: "sku-elt-09",
    seriesSlug: "elite",
    sku: "TCL-ELT-09HP-230",
    modelNumber: "ELITE-09-230V",
    title: "Elite 9k Premium Heat Pump",
    btu: 9000,
    voltage: "208/230V",
    unitType: "single-zone wall mount",
    cost: 735,
    dealerPrice: 1090,
    msrp: 1699,
    dimensions: "35 x 12 x 9 in",
    weightLbs: 33,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482301",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek", "NEEP Listed"],
  },
  {
    id: "sku-elt-24",
    seriesSlug: "elite",
    sku: "TCL-ELT-24HP-230",
    modelNumber: "ELITE-24-230V",
    title: "Elite 24k Premium Heat Pump",
    btu: 24000,
    voltage: "208/230V",
    unitType: "single-zone wall mount",
    cost: 1325,
    dealerPrice: 1885,
    msrp: 2799,
    dimensions: "44 x 13 x 10 in",
    weightLbs: 46,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482302",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek", "NEEP Listed"],
  },
  {
    id: "sku-lc-36",
    seriesSlug: "light-commercial",
    sku: "TCL-LC-36CAS-230",
    modelNumber: "LC-CASSETTE-36-230V",
    title: "Light Commercial 36k Cassette System",
    btu: 36000,
    voltage: "208/230V",
    unitType: "ceiling cassette",
    cost: 1880,
    dealerPrice: 2595,
    msrp: 3899,
    dimensions: "33 x 33 x 11 in",
    weightLbs: 78,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482401",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ETL Intertek"],
  },
  {
    id: "sku-mz-36",
    seriesSlug: "multi-zone",
    sku: "TCL-MZ-36ODU-230",
    modelNumber: "MULTIZONE-36-ODU",
    title: "Multi-Zone 36k Outdoor Unit",
    btu: 36000,
    voltage: "208/230V",
    unitType: "multi-zone outdoor",
    cost: 1660,
    dealerPrice: 2345,
    msrp: 3499,
    dimensions: "38 x 32 x 16 in",
    weightLbs: 142,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482501",
    warrantyCompressor: "7-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek"],
  },
  {
    id: "sku-cd-48",
    seriesSlug: "central-system",
    sku: "TCL-CD-48AH-230",
    modelNumber: "CENTRAL-48-AHU",
    title: "Central Ducted 48k Air Handler System",
    btu: 48000,
    voltage: "208/230V",
    unitType: "central ducted",
    cost: 2390,
    dealerPrice: 3295,
    msrp: 4899,
    dimensions: "53 x 22 x 24 in",
    weightLbs: 168,
    refrigerant: "R-32",
    ahriReference: "AHRI-9482601",
    warrantyCompressor: "10-year",
    warrantyParts: "5-year",
    certifications: ["AHRI Certified", "ENERGY STAR", "ETL Intertek"],
  },
];

export const demoSkuDocuments: SkuDocument[] = demoSkus.flatMap((sku) => [
  {
    id: `${sku.id}-spec`,
    skuId: sku.id,
    kind: "spec_sheet",
    title: `${sku.title} Spec Sheet`,
    storagePath: `mock-documents/spec-sheets/${sku.sku}.pdf`,
  },
  {
    id: `${sku.id}-manual`,
    skuId: sku.id,
    kind: "install_manual",
    title: `${sku.title} Install Manual`,
    storagePath: `mock-documents/install-manuals/${sku.sku}.pdf`,
  },
]);

export const demoWarehouses: Warehouse[] = [
  {
    id: "wh-nwk",
    code: "NWK",
    name: "Newark Fulfillment Center",
    address: "5437 Central Ave., Suite 10, Newark, CA 94560",
  },
];

export const demoInventoryLots: InventoryLot[] = [
  { id: "lot-brz-09", skuId: "sku-brz-09", warehouseId: "wh-nwk", binCode: "A-01", lotCode: "NWK-BRZ09-0426", onHand: 42, reserved: 6, reorderPoint: 8 },
  { id: "lot-brz-24", skuId: "sku-brz-24", warehouseId: "wh-nwk", binCode: "A-01", lotCode: "NWK-BRZ24-0426", onHand: 18, reserved: 4, reorderPoint: 6 },
  { id: "lot-frs-12", skuId: "sku-frs-12", warehouseId: "wh-nwk", binCode: "A-02", lotCode: "NWK-FRS12-0426", onHand: 5, reserved: 3, reorderPoint: 6 },
  { id: "lot-elt-09", skuId: "sku-elt-09", warehouseId: "wh-nwk", binCode: "B-04", lotCode: "NWK-ELT09-0426", onHand: 24, reserved: 2, reorderPoint: 8 },
  { id: "lot-elt-24", skuId: "sku-elt-24", warehouseId: "wh-nwk", binCode: "B-04", lotCode: "NWK-ELT24-0426", onHand: 7, reserved: 7, reorderPoint: 6 },
  { id: "lot-lc-36", skuId: "sku-lc-36", warehouseId: "wh-nwk", binCode: "C-02", lotCode: "NWK-LC36-0426", onHand: 3, reserved: 1, reorderPoint: 4 },
  { id: "lot-mz-36", skuId: "sku-mz-36", warehouseId: "wh-nwk", binCode: "C-05", lotCode: "NWK-MZ36-0426", onHand: 11, reserved: 5, reorderPoint: 5 },
  { id: "lot-cd-48", skuId: "sku-cd-48", warehouseId: "wh-nwk", binCode: "D-01", lotCode: "NWK-CD48-0426", onHand: 2, reserved: 2, reorderPoint: 3 },
];

export const demoQuoteRequests: QuoteRequest[] = [
  {
    id: "qr-1048",
    name: "Andre Lewis",
    email: "andre@bayareamech.example",
    phone: "(415) 555-0144",
    need: "Three Elite 9k systems for San Mateo tenant improvement.",
    status: "new",
    createdAt: "2026-06-05T16:20:00.000Z",
    lines: [{ seriesSlug: "elite", productName: "Elite Series", quantity: 3 }],
  },
];

export const demoQuotes: Quote[] = [
  {
    id: "quote-1042",
    quoteNumber: "Q-2026-1042",
    accountId: "acct-dealer-bay",
    status: "sent",
    subtotal: 3270,
    tax: 294.3,
    total: 3564.3,
    validUntil: "2026-06-20",
  },
];

export const demoQuoteLines: QuoteLine[] = [
  { quoteId: "quote-1042", skuId: "sku-elt-09", quantity: 3, unitPrice: 1090, lineTotal: 3270 },
];

export const demoSalesOrders: SalesOrder[] = [
  {
    id: "so-2217",
    orderNumber: "SO-2026-2217",
    quoteId: "quote-1042",
    accountId: "acct-dealer-bay",
    status: "reserved",
    subtotal: 3270,
    total: 3564.3,
  },
];

export const demoOrderLines: OrderLine[] = [
  {
    orderId: "so-2217",
    skuId: "sku-elt-09",
    quantity: 3,
    reservedQuantity: 3,
    shippedQuantity: 0,
    unitPrice: 1090,
  },
];

export const demoInvoices: Invoice[] = [
  {
    id: "inv-1884",
    invoiceNumber: "INV-2026-1884",
    orderId: "so-2217",
    accountId: "acct-dealer-bay",
    status: "open",
    subtotal: 3270,
    tax: 294.3,
    total: 3564.3,
    paid: 0,
    balance: 3564.3,
    dueDate: "2026-07-06",
  },
  {
    id: "inv-1769",
    invoiceNumber: "INV-2026-1769",
    accountId: "acct-dealer-bay",
    status: "overdue",
    subtotal: 4855,
    tax: 436.95,
    total: 5291.95,
    paid: 436.25,
    balance: 4855.7,
    dueDate: "2026-05-29",
  },
];

export const demoPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-3311",
    poNumber: "PO-2026-3311",
    supplierAccountId: "acct-supplier-tcl",
    status: "sent",
    total: 19580,
    expectedAt: "2026-06-15",
  },
];

export const demoRmas: CaseRecord[] = [
  {
    id: "rma-019",
    number: "RMA-2026-019",
    accountId: "acct-dealer-bay",
    skuId: "sku-elt-09",
    status: "waiting",
    title: "Cabinet dent on received indoor unit",
    detail: "Waiting on dealer photos before replacement approval.",
  },
];

export const demoWarrantyClaims: CaseRecord[] = [
  {
    id: "wr-044",
    number: "WR-2026-044",
    accountId: "acct-installer-summit",
    skuId: "sku-brz-09",
    status: "open",
    title: "Intermittent fan motor fault",
    detail: "Needs serial photo and startup checklist.",
  },
];

export const demoRebateCases: CaseRecord[] = [
  {
    id: "reb-082",
    number: "REB-2026-082",
    accountId: "acct-installer-summit",
    status: "open",
    title: "TECH Clean California packet",
    detail: "Maria Chen project needs AHRI certificate, invoice, and install photos.",
  },
];

export const demoTasks: Task[] = [
  {
    id: "task-quote-expiry",
    accountId: "acct-dealer-bay",
    title: "Follow up on Q-2026-1042 before quote expires",
    ownerRole: "staff",
    status: "open",
    dueAt: "2026-06-08T16:00:00.000Z",
  },
  {
    id: "task-warranty-photo",
    accountId: "acct-installer-summit",
    title: "Collect serial number photo for warranty claim WR-2026-044",
    ownerRole: "installer",
    status: "open",
    dueAt: "2026-06-07T18:00:00.000Z",
  },
  {
    id: "task-homeowner-referral",
    accountId: "acct-homeowner-chen",
    title: "Match homeowner with South Bay installer",
    ownerRole: "staff",
    status: "open",
    dueAt: "2026-06-06T20:00:00.000Z",
  },
];

export const demoActivity: Activity[] = [
  {
    id: "act-quote-sent",
    accountId: "acct-dealer-bay",
    event: "Quote sent to dealer",
    entityType: "quote",
    entityId: "quote-1042",
    createdAt: "2026-06-05T18:10:00.000Z",
  },
  {
    id: "act-invoice-opened",
    accountId: "acct-dealer-bay",
    event: "Invoice opened with mock AR balance",
    entityType: "invoice",
    entityId: "inv-1884",
    createdAt: "2026-06-05T18:30:00.000Z",
  },
  {
    id: "act-referral",
    accountId: "acct-homeowner-chen",
    event: "Homeowner referral case created",
    entityType: "task",
    createdAt: "2026-06-06T04:15:00.000Z",
  },
];

export function createDemoOperationsData(): OperationsData {
  return {
    accounts: demoAccounts,
    contacts: demoContacts,
    users: demoUsers,
    skus: demoSkus,
    skuDocuments: demoSkuDocuments,
    warehouses: demoWarehouses,
    inventoryLots: demoInventoryLots,
    quoteRequests: demoQuoteRequests,
    quotes: demoQuotes,
    quoteLines: demoQuoteLines,
    salesOrders: demoSalesOrders,
    orderLines: demoOrderLines,
    invoices: demoInvoices,
    purchaseOrders: demoPurchaseOrders,
    rmas: demoRmas,
    warrantyClaims: demoWarrantyClaims,
    rebateCases: demoRebateCases,
    tasks: demoTasks,
    activity: demoActivity,
  };
}

export function getSeriesName(slug: string): string {
  return SERIES.find((series) => series.slug === slug)?.name ?? slug;
}
