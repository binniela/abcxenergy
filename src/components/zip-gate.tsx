"use client";

import * as React from "react";
import { MapPin, Check } from "lucide-react";
import { useFulfillment } from "./fulfillment-context";

/* Compact ZIP entry. Sets the fulfillment ZIP that drives availability badges
   and the checkout. Shows the resolved zone when inside the Bay Area radius. */

export function ZipGate({ className = "" }: { className?: string }) {
  const { zip, zone, setZip } = useFulfillment();
  const [draft, setDraft] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setZip(draft);
      }}
      className={`flex items-center gap-2 ${className}`}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">
        <MapPin size={16} strokeWidth={2.2} />
      </span>
      {zip && zone ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
          <Check size={14} className="text-eco" strokeWidth={2.5} />
          Delivering to <span className="font-medium text-ink-1">{zone.label}</span> ({zip})
          <button
            type="button"
            onClick={() => {
              setZip(null);
              setDraft("");
            }}
            className="ml-1 text-ink-3 underline hover:text-ink-1"
          >
            change
          </button>
        </span>
      ) : zip ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
          {zip} is outside our delivery radius.
          <button type="button" onClick={() => setZip(null)} className="text-ink-3 underline hover:text-ink-1">
            change
          </button>
        </span>
      ) : (
        <>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="numeric"
            placeholder="Enter ZIP for availability"
            aria-label="ZIP code"
            className="h-9 w-44 rounded-(--r-sm) border border-control-border bg-control-bg px-3 text-sm text-ink-1 placeholder:text-ink-4 focus:outline-none"
          />
          <button
            type="submit"
            className="h-9 rounded-(--r-sm) bg-brand px-3 text-sm font-medium text-brand-ink hover:bg-brand-hover"
          >
            Check
          </button>
        </>
      )}
    </form>
  );
}
