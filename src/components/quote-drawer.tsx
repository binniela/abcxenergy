"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, FileText } from "lucide-react";
import * as React from "react";
import { useQuote } from "./quote-context";
import { getSeries } from "@/lib/products";

/* Right-side drawer that mirrors the contractor's quote list. Not a checkout —
   it hands off to the /quote request form with the list prefilled in mind. */
export function QuoteDrawer() {
  const { items, isOpen, close, setQty, remove, clear, count } = useQuote();

  // Lock scroll + close on Escape while open.
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-40 bg-[var(--ink-panel)]/40 backdrop-blur-[2px] transition-opacity duration-200
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      {/* Panel */}
      <aside
        role={isOpen ? "dialog" : undefined}
        aria-label={isOpen ? "Your quote list" : undefined}
        aria-modal={isOpen ? "true" : undefined}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[400px] flex-col border-l border-line bg-surface-1 shadow-[var(--shadow-lg)]
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex flex-col">
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
              Your quote
            </h2>
            <span className="text-xs text-ink-3">
              {count} {count === 1 ? "unit" : "units"} · no pricing shown until we reply
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close quote"
            className="grid size-9 place-items-center rounded-[--r-sm] text-ink-2 hover:bg-surface-2 hover:text-ink-1"
          >
            <X size={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-ink-4">
              <FileText size={22} />
            </span>
            <p className="text-sm text-ink-2">
              Your quote list is empty. Add units from any product and request
              contractor pricing in one step.
            </p>
            <Link
              href="/products"
              onClick={close}
              className="text-sm font-medium text-brand hover:text-brand-hover"
            >
              Browse the TCL lineup →
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--line)] overflow-y-auto px-5">
              {items.map((item) => {
                const series = getSeries(item.slug);
                return (
                <li key={item.slug} className="flex items-center gap-3 py-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-[--r-sm] border border-line bg-surface-2">
                    {series ? (
                      <Image
                        src={series.image}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    ) : (
                      <FileText size={20} className="m-auto mt-4 text-ink-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={close}
                      className="block truncate text-sm font-semibold text-ink-1 hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => remove(item.slug)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-ink-3 hover:text-danger"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-1 rounded-[--r-sm] border border-control-border bg-control-bg">
                    <button
                      onClick={() => setQty(item.slug, item.qty - 1)}
                      aria-label="Decrease quantity"
                      className="grid size-8 place-items-center text-ink-2 hover:text-ink-1"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="tnum w-6 text-center font-mono text-sm font-semibold text-ink-1">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setQty(item.slug, item.qty + 1)}
                      aria-label="Increase quantity"
                      className="grid size-8 place-items-center text-ink-2 hover:text-ink-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </li>
              );
              })}
            </ul>

            <footer className="border-t border-line bg-surface-2 px-5 py-4">
              <Link
                href="/quote"
                onClick={close}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[--r-sm] bg-brand text-[15px] font-medium text-brand-ink shadow-[var(--shadow-sm)] transition-colors hover:bg-brand-hover"
              >
                Request pricing & availability
              </Link>
              <button
                onClick={clear}
                className="mt-2 w-full text-center text-xs text-ink-3 hover:text-danger"
              >
                Clear list
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
