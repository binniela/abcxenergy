"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Truck, Store, PackageCheck, ArrowRight } from "lucide-react";
import { useQuote } from "./quote-context";
import { useFulfillment } from "./fulfillment-context";
import { ZipGate } from "./zip-gate";
import {
  fulfillmentOptions,
  fulfillmentWindows,
  type FulfillmentMethod,
} from "@/lib/backend/fulfillment";
import { estimateTax, round2 } from "@/lib/backend/pricing";

export type PriceMap = Record<string, { dealer: number; retail: number }>;

const METHOD_ICON: Record<FulfillmentMethod, React.ReactNode> = {
  pickup: <Store size={18} strokeWidth={2.2} />,
  local_delivery: <Truck size={18} strokeWidth={2.2} />,
  freight: <PackageCheck size={18} strokeWidth={2.2} />,
};

function currency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function CheckoutClient({
  prices,
  trade,
  accountName,
}: {
  prices: PriceMap;
  trade: boolean;
  accountName: string | null;
}) {
  const router = useRouter();
  const { items, setQty, clear } = useQuote();
  const { zip } = useFulfillment();

  const [method, setMethod] = React.useState<FulfillmentMethod>("pickup");
  const [windowSlot, setWindowSlot] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState("contractor");
  const [poNumber, setPoNumber] = React.useState("");
  const [buyerName, setBuyerName] = React.useState("");
  const [buyerEmail, setBuyerEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Prices come straight from the catalog (via the server-provided price map),
  // the same source the server charges from — no client-side markup.
  const priced = items.map((i) => {
    const entry = prices[i.skuId];
    const unit = trade ? entry?.dealer ?? i.unitPrice : entry?.retail ?? i.unitPrice;
    return { ...i, unit, lineTotal: unit * i.qty };
  });
  const subtotal = round2(priced.reduce((s, l) => s + l.lineTotal, 0));

  const options = fulfillmentOptions(zip, subtotal);
  const selectedMethod = options.find((o) => o.method === method)?.available ? method : "pickup";
  const chosen = options.find((o) => o.method === selectedMethod);
  const fee = selectedMethod === "local_delivery" ? chosen?.fee ?? 0 : 0;
  // Homeowners/guests paying by card get an estimated CA tax line; trade
  // net-terms orders are taxed on the invoice, and freight is quoted separately.
  const taxable = !trade && selectedMethod !== "freight";
  const tax = taxable ? estimateTax(subtotal) : 0;
  const total = round2(subtotal + fee + tax);
  const windows = fulfillmentWindows(selectedMethod, zip);

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-[--r-md] border border-line bg-surface-1 p-10 text-center">
        <p className="text-ink-2">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
        >
          Browse the lineup
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  async function placeOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            skuId: i.skuId,
            sku: i.sku,
            modelNumber: i.modelNumber,
            title: i.title,
            qty: i.qty,
          })),
          method: selectedMethod,
          zip: zip ?? undefined,
          address: selectedMethod === "local_delivery" ? address : undefined,
          company,
          phone,
          role,
          poNumber,
          window: selectedMethod !== "freight" ? windowSlot : undefined,
          buyerName,
          buyerEmail,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Checkout failed");

      // Hand the result to the confirmation page (incl. any Stripe clientSecret).
      sessionStorage.setItem("summit-last-order", JSON.stringify(data));
      clear();
      router.push(`/checkout/confirmation?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  const needsAddress = selectedMethod === "local_delivery";
  const canSubmit =
    !submitting &&
    (!needsAddress || address.trim().length > 4) &&
    buyerName.trim().length > 1 &&
    /.+@.+\..+/.test(buyerEmail) &&
    phone.trim().length >= 7;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
      {/* Left: fulfillment choices */}
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
            1. Where it goes
          </h2>
          <div className="mt-3">
            <ZipGate />
          </div>
          <div className="mt-4 grid gap-3">
            {options.map((opt) => (
              <button
                key={opt.method}
                type="button"
                disabled={!opt.available}
                onClick={() => setMethod(opt.method)}
                className={`flex items-center gap-4 rounded-[--r-md] border p-4 text-left transition-colors ${
                  selectedMethod === opt.method
                    ? "border-brand bg-brand-tint"
                    : opt.available
                      ? "border-line bg-surface-1 hover:border-line-strong"
                      : "border-dashed border-line bg-surface-2/40 opacity-60"
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[--r-sm] bg-surface-2 text-ink-2">
                  {METHOD_ICON[opt.method]}
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 font-medium text-ink-1">
                    {opt.label}
                    {opt.fee > 0 && selectedMethod === opt.method && (
                      <span className="text-sm text-ink-3">{currency(opt.fee)}</span>
                    )}
                  </span>
                  <span className="text-sm text-ink-2">{opt.detail}</span>
                  {opt.note && !opt.available && (
                    <span className="mt-0.5 block text-xs text-ink-4">{opt.note}</span>
                  )}
                </span>
                {selectedMethod === opt.method && <Check size={18} className="text-brand" strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </section>

        {selectedMethod !== "freight" && (
          <section>
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
              2. {selectedMethod === "pickup" ? "Pickup window" : "Delivery window"}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {windows.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWindowSlot(w)}
                  className={`rounded-[--r-sm] border px-3 py-2 text-sm transition-colors ${
                    windowSlot === w
                      ? "border-brand bg-brand-tint text-ink-1"
                      : "border-line bg-surface-1 text-ink-2 hover:border-line-strong"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </section>
        )}

        {needsAddress && (
          <section>
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
              Jobsite address
            </h2>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, ZIP"
              className="mt-3 h-11 w-full rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
            />
          </section>
        )}

        <section>
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
            3. Buyer and job details
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                autoComplete="name"
                className="h-11 rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
              />
            </Field>
            <Field label="Work email" required>
              <input
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="h-11 rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
              />
            </Field>
            <Field label="Phone" required>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                autoComplete="tel"
                className="h-11 rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
              />
            </Field>
            <Field label="Company">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                className="h-11 rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
              />
            </Field>
            <Field label="Buyer type">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 focus:outline-none"
              >
                <option value="contractor">Contractor / installer</option>
                <option value="procurement">Procurement team</option>
                <option value="property_manager">Property manager</option>
                <option value="homeowner">Homeowner</option>
              </select>
            </Field>
            <Field label="PO / job number">
              <input
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="h-11 rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
              />
            </Field>
          </div>
        </section>
      </div>

      {/* Right: order summary */}
      <aside className="h-fit rounded-[--r-md] border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)]">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">Order summary</h2>
        {trade && accountName && (
          <p className="mt-1 text-xs font-medium text-eco-ink">Pro pricing · {accountName}</p>
        )}
        <ul className="mt-4 flex flex-col divide-y divide-line">
          {priced.map((l) => (
            <li key={l.skuId} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-1">{l.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => setQty(l.skuId, Number(e.target.value))}
                    className="tnum h-7 w-14 rounded-[--r-sm] border border-control-border bg-control-bg px-2 text-sm"
                  />
                  <span className="text-xs text-ink-3">{l.sku} × {currency(l.unit)}</span>
                </div>
              </div>
              <span className="tnum text-sm font-semibold text-ink-1">{currency(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-sm">
          <Row label="Subtotal" value={currency(subtotal)} />
          <Row
            label={selectedMethod === "freight" ? "Freight" : selectedMethod === "pickup" ? "Pickup" : "Delivery"}
            value={selectedMethod === "freight" ? "Quoted" : fee === 0 ? "Free" : currency(fee)}
          />
          {taxable ? (
            <Row label="Estimated sales tax" value={currency(tax)} />
          ) : trade ? (
            <Row label="Sales tax" value="On invoice" />
          ) : null}
          <div className="mt-1 flex items-center justify-between border-t border-line pt-3 text-base font-semibold text-ink-1">
            <span>Total</span>
            <span className="tnum">{currency(total)}</span>
          </div>
        </dl>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={!canSubmit}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[--r-sm] bg-brand text-sm font-semibold text-brand-ink shadow-[var(--shadow-sm)] transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Placing order…"
            : trade
              ? "Place order (net terms)"
              : selectedMethod === "freight"
                ? "Request order + freight quote"
                : "Continue to payment"}
          {!submitting && <ArrowRight size={16} />}
        </button>
        <p className="mt-3 text-center text-xs text-ink-4">
          {trade
              ? "Reserved for account follow-up on net terms."
            : selectedMethod === "freight"
              ? "We email a freight quote before charging."
              : "Secure card payment on the next step."}
        </p>
      </aside>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-1">
      <span>{label}{required && <span className="ml-0.5 text-copper">*</span>}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-2">
      <span>{label}</span>
      <span className="tnum">{value}</span>
    </div>
  );
}
