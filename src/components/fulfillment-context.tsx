"use client";

import * as React from "react";
import { resolveZone, type DeliveryZone } from "@/lib/backend/fulfillment";

/* The visitor's ZIP drives availability everywhere: catalog badges, product
   pages, and the checkout fulfillment step. Persisted so a contractor sets it
   once. Stored separately from the cart. */

type FulfillmentState = {
  zip: string | null;
  zone: DeliveryZone | null;
  setZip: (zip: string | null) => void;
};

const Ctx = React.createContext<FulfillmentState | null>(null);
const KEY = "summit-zip-v1";

export function FulfillmentProvider({ children }: { children: React.ReactNode }) {
  const [zip, setZipState] = React.useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(KEY);
      return stored || null;
    } catch {
      return null;
    }
  });

  const setZip = React.useCallback((next: string | null) => {
    const clean = next ? next.replace(/[^0-9]/g, "").slice(0, 5) : null;
    setZipState(clean && clean.length === 5 ? clean : null);
    try {
      if (clean && clean.length === 5) localStorage.setItem(KEY, clean);
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value: FulfillmentState = {
    zip,
    zone: resolveZone(zip),
    setZip,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFulfillment(): FulfillmentState {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useFulfillment must be used within FulfillmentProvider");
  return ctx;
}
