"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Store, Truck, PackageCheck } from "lucide-react";
import { Container } from "@/components/ui";
import { StripePayment } from "@/components/stripe-payment";

type LastOrder = {
  orderNumber: string;
  total: number;
  fee: number;
  subtotal: number;
  payment: "card" | "net_terms" | "freight_quote";
  clientSecret?: string;
  mode: "supabase" | "seeded";
};

function currency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function ConfirmationPage() {
  return (
    <React.Suspense fallback={null}>
      <ConfirmationInner />
    </React.Suspense>
  );
}

function ConfirmationInner() {
  const params = useSearchParams();
  const paid = params.get("status") === "paid";
  const [order] = React.useState<LastOrder | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("summit-last-order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const orderNumber = order?.orderNumber ?? params.get("order") ?? "";

  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={28} className="text-eco" strokeWidth={2.2} />
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-1">
            {paid ? "Payment received" : "Order placed"}
          </h1>
        </div>
        <p className="mt-2 text-ink-2">
          Order <span className="font-mono font-semibold text-ink-1">{orderNumber}</span>{" "}
          is in. {paid ? "Thanks, your card was charged." : "Here's what happens next."}
        </p>

        {order && !paid && order.payment === "card" && order.clientSecret && (
          <div className="mt-8 rounded-(--r-md) border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink-1">Pay {currency(order.total)}</h2>
            </div>
            <StripePayment clientSecret={order.clientSecret} orderNumber={orderNumber} />
          </div>
        )}

        {order && !paid && order.payment === "net_terms" && (
          <NextStep
            icon={<Store size={18} />}
            title="Invoiced to your account"
            body={`${currency(order.total)} on net terms. Your order is reserved and ready to stage for pickup or delivery.`}
          />
        )}

        {order && !paid && order.payment === "freight_quote" && (
          <NextStep
            icon={<PackageCheck size={18} />}
            title="Freight quote on the way"
            body={`We'll email a freight quote for your ${currency(order.subtotal)} order before any charge. Reply to confirm and we ship.`}
          />
        )}

        {paid && (
          <NextStep
            icon={<Truck size={18} />}
            title="We're staging your order"
            body="You'll get a confirmation email with your pickup or delivery window. See you soon."
          />
        )}

        <div className="mt-8 flex gap-3">
          <Link
            href="/products"
            className="inline-flex h-11 items-center rounded-(--r-sm) border border-line-strong bg-surface-1 px-4 text-sm font-medium text-ink-1 hover:bg-surface-2"
          >
            Keep shopping
          </Link>
          <Link
            href="/portal"
            className="inline-flex h-11 items-center rounded-(--r-sm) bg-brand px-4 text-sm font-medium text-brand-ink hover:bg-brand-hover"
          >
            View in portal
          </Link>
        </div>
      </div>
    </Container>
  );
}

function NextStep({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="mt-8 flex gap-4 rounded-(--r-md) border border-line bg-surface-1 p-6">
      <span className="grid size-10 shrink-0 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">
        {icon}
      </span>
      <div>
        <h2 className="font-display text-base font-semibold text-ink-1">{title}</h2>
        <p className="mt-1 text-sm text-ink-2">{body}</p>
      </div>
    </div>
  );
}
