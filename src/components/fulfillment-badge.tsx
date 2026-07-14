"use client";

import { Truck, Clock } from "lucide-react";
import { useFulfillment } from "./fulfillment-context";
import { fulfillmentPromise } from "@/lib/backend/fulfillment";

/* A ZIP-aware stock promise, e.g. "In stock, delivery to Fremont today".
   Client component so it reacts to the visitor's chosen ZIP. */

export function FulfillmentBadge({ inStock, className = "" }: { inStock: boolean; className?: string }) {
  const { zip } = useFulfillment();
  const text = fulfillmentPromise(zip, inStock);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        inStock ? "bg-stock-ready-tint text-stock-ready-ink" : "bg-surface-2 text-ink-3 border border-line"
      } ${className}`}
    >
      {inStock ? <Truck size={13} strokeWidth={2.5} /> : <Clock size={13} strokeWidth={2} />}
      {text}
    </span>
  );
}
