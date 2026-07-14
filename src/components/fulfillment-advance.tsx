"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { advanceFulfillment } from "@/lib/backend/operations";
import type { FulfillmentMethod } from "@/lib/backend/fulfillment";

/* Staff buttons to move an order through its pickup/delivery lifecycle. Calls
   the staff-gated advance_fulfillment RPC (auth enforced in the database). */

const NEXT: Record<FulfillmentMethod, { status: string; label: string }[]> = {
  pickup: [
    { status: "ready_for_pickup", label: "Mark ready" },
    { status: "picked_up", label: "Mark picked up" },
  ],
  local_delivery: [
    { status: "out_for_delivery", label: "Out for delivery" },
    { status: "delivered", label: "Mark delivered" },
  ],
  freight: [
    { status: "out_for_delivery", label: "Handed to carrier" },
    { status: "delivered", label: "Mark delivered" },
  ],
};

export function FulfillmentAdvance({
  orderId,
  method,
  status,
}: {
  orderId: string;
  method: FulfillmentMethod;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function go(next: string) {
    setBusy(true);
    try {
      await advanceFulfillment(orderId, next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const done = status === "delivered" || status === "picked_up" || status === "cancelled";
  if (done) {
    return <span className="text-xs font-medium text-ink-3">No action</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {NEXT[method]
        .filter((s) => s.status !== status)
        .map((s) => (
          <button
            key={s.status}
            disabled={busy}
            onClick={() => go(s.status)}
            className="rounded-[--r-sm] border border-line-strong bg-surface-1 px-2.5 py-1 text-xs font-medium text-ink-1 hover:bg-surface-2 disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
    </div>
  );
}
