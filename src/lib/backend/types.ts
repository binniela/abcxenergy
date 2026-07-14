export type PersonaRole = "staff" | "dealer" | "installer" | "homeowner";

export type AccountType = "internal" | "dealer" | "installer" | "homeowner" | "supplier";

export type Account = {
  id: string;
  type: AccountType;
  name: string;
  status: string;
  priceTier: string;
  creditLimit: number;
  balance: number;
  serviceArea?: string;
  licenseNumber?: string;
};

export type Contact = {
  id: string;
  accountId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

export type DemoUser = {
  id: string;
  accountId: string;
  role: PersonaRole;
  name: string;
  email: string;
};

export type Sku = {
  id: string;
  seriesSlug: string;
  sku: string;
  modelNumber: string;
  title: string;
  btu: number;
  voltage: string;
  unitType: string;
  cost: number;
  dealerPrice: number;
  msrp: number;
  dimensions: string;
  weightLbs: number;
  refrigerant: string;
  ahriReference: string;
  warrantyCompressor: string;
  warrantyParts: string;
  certifications: string[];
};

export type SkuDocument = {
  id: string;
  skuId: string;
  kind: "spec_sheet" | "install_manual" | "rebate_guidance";
  title: string;
  storagePath: string;
};

export type Warehouse = {
  id: string;
  code: string;
  name: string;
  address: string;
};

export type InventoryLot = {
  id: string;
  skuId: string;
  warehouseId: string;
  binCode: string;
  lotCode: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
};

export type InventorySummary = {
  skuId: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  status: "ready" | "low" | "backorder";
};

export type QuoteRequestLine = {
  skuId: string;
  sku: string;
  modelNumber: string;
  productName: string;
  quantity: number;
};

export type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  need: string;
  status: "new" | "assigned" | "converted";
  lines: QuoteRequestLine[];
  createdAt: string;
};

export type Quote = {
  id: string;
  quoteNumber: string;
  accountId: string;
  status: "requested" | "draft" | "sent" | "approved" | "expired";
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
};

export type QuoteLine = {
  quoteId: string;
  skuId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type SalesOrder = {
  id: string;
  orderNumber: string;
  quoteId?: string;
  accountId: string;
  status: "pending" | "reserved" | "partially_shipped" | "shipped" | "cancelled";
  subtotal: number;
  total: number;
};

export type OrderLine = {
  orderId: string;
  skuId: string;
  quantity: number;
  reservedQuantity: number;
  shippedQuantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  accountId: string;
  orderId?: string;
  status: "draft" | "open" | "partial" | "paid" | "overdue" | "void";
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  dueDate: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierAccountId: string;
  status: "draft" | "sent" | "partially_received" | "received" | "cancelled";
  total: number;
  expectedAt: string;
};

export type CaseRecord = {
  id: string;
  number: string;
  accountId: string;
  skuId?: string;
  status: "open" | "waiting" | "approved" | "closed";
  title: string;
  detail: string;
};

export type Task = {
  id: string;
  accountId: string;
  title: string;
  ownerRole: PersonaRole;
  status: "open" | "done";
  dueAt: string;
};

export type Activity = {
  id: string;
  accountId: string;
  event: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
};

export type OperationsData = {
  accounts: Account[];
  contacts: Contact[];
  users: DemoUser[];
  skus: Sku[];
  skuDocuments: SkuDocument[];
  warehouses: Warehouse[];
  inventoryLots: InventoryLot[];
  quoteRequests: QuoteRequest[];
  quotes: Quote[];
  quoteLines: QuoteLine[];
  salesOrders: SalesOrder[];
  orderLines: OrderLine[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  rmas: CaseRecord[];
  warrantyClaims: CaseRecord[];
  rebateCases: CaseRecord[];
  tasks: Task[];
  activity: Activity[];
};

export type QuoteRequestInput = {
  name: string;
  email: string;
  phone?: string;
  need: string;
  lines: QuoteRequestLine[];
};

export type DealerApplicationInput = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  serviceArea?: string;
  businessType?: string;
  monthlyVolume?: string;
  brands?: string;
  notes?: string;
};

export type ContactRequestInput = {
  topic: string;
  name: string;
  email: string;
  message: string;
};
