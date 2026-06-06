"use client";

import * as React from "react";

/* The quote list is the contractor's working cart — but it never "checks out".
   It collects SKUs to request pricing/availability on. Persisted to
   localStorage so a contractor building a job over the day doesn't lose it. */

export type QuoteItem = {
  slug: string;
  name: string;
  qty: number;
};

type QuoteState = {
  items: QuoteItem[];
  isOpen: boolean;
  count: number;
  add: (slug: string, name: string) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const QuoteCtx = React.createContext<QuoteState | null>(null);
const STORAGE_KEY = "abcx-quote-v1";

function readStoredItems(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is QuoteItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as QuoteItem).slug === "string" &&
        typeof (item as QuoteItem).name === "string" &&
        typeof (item as QuoteItem).qty === "number"
    );
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<QuoteItem[]>(readStoredItems);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = React.useCallback((slug: string, name: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { slug, name, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const remove = React.useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = React.useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.slug === slug ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((o) => !o), []);

  const count = items.reduce((n, i) => n + i.qty, 0);

  const value: QuoteState = {
    items,
    isOpen,
    count,
    add,
    remove,
    setQty,
    clear,
    open,
    close,
    toggle,
  };

  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote(): QuoteState {
  const ctx = React.useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
