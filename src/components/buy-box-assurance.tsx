import { CalendarClock, CreditCard, RotateCcw, ShieldCheck } from "lucide-react";
import { PURCHASE, financingMonthly } from "@/lib/site";

/* Purchase-assurance rail — the four answers a buyer needs before committing
   to a four-figure order: financing, returns, guarantee, and delivery timing.
   Sits directly under the CTA on every buy box (series + SKU pages). */
export function BuyBoxAssurance({ price, className = "" }: { price?: number; className?: string }) {
  return (
    <div className={`rounded-(--r-md) border border-line bg-surface-2/60 ${className}`}>
      <ul className="divide-y divide-line text-sm">
        {price != null && price > 0 && (
          <AssuranceRow icon={<CreditCard size={16} />}>
            <span className="font-medium text-ink-1">
              As low as {currency(financingMonthly(price))}/mo
            </span>{" "}
            <span className="text-ink-2">— {PURCHASE.financingNote}</span>
          </AssuranceRow>
        )}
        <AssuranceRow icon={<RotateCcw size={16} />}>
          <span className="font-medium text-ink-1">{PURCHASE.returns}</span>
        </AssuranceRow>
        <AssuranceRow icon={<ShieldCheck size={16} />}>
          <span className="font-medium text-ink-1">{PURCHASE.guarantee}</span>{" "}
          <span className="text-ink-2">— wrong or damaged units replaced free</span>
        </AssuranceRow>
        <AssuranceRow icon={<CalendarClock size={16} />}>
          <span className="text-ink-2">{PURCHASE.delivery}</span>
        </AssuranceRow>
      </ul>
    </div>
  );
}

function AssuranceRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <span className="shrink-0 text-brand">{icon}</span>
      <span className="leading-snug">{children}</span>
    </li>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
