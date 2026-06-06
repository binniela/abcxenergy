"use client";

import { SlidersHorizontal, X } from "lucide-react";
import * as React from "react";
import { Container, Eyebrow } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { SERIES, CATEGORY_LABEL, type Category } from "@/lib/products";
import { getSeededSeriesCardSummary } from "@/lib/backend/catalog";

type Ducting = "all" | "ductless" | "ducted";
type ZoneFilter = "any" | "single" | "multi";

const CATEGORIES: Category[] = ["ductless", "ducted", "commercial", "ventilation"];
const SEER_STOPS = [0, 18, 20, 22] as const;
const BTU_BANDS = [
  { id: "small", label: "≤ 12k BTU", test: (lo: number) => lo <= 12000 },
  { id: "mid", label: "18–36k BTU", test: (lo: number, hi: number) => hi >= 18000 && lo <= 36000 },
  { id: "large", label: "36k+ BTU", test: (_lo: number, hi: number) => hi >= 36000 },
] as const;

export default function ProductsPage() {
  const [cats, setCats] = React.useState<Set<Category>>(new Set());
  const [ducting, setDucting] = React.useState<Ducting>("all");
  const [zones, setZones] = React.useState<ZoneFilter>("any");
  const [minSeer, setMinSeer] = React.useState<number>(0);
  const [btu, setBtu] = React.useState<string | null>(null);

  const toggleCat = (c: Category) =>
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) {
        next.delete(c);
      } else {
        next.add(c);
      }
      return next;
    });

  const reset = () => {
    setCats(new Set());
    setDucting("all");
    setZones("any");
    setMinSeer(0);
    setBtu(null);
  };

  const filtered = SERIES.filter((s) => {
    if (cats.size && !cats.has(s.category)) return false;
    if (ducting === "ductless" && s.ducted) return false;
    if (ducting === "ducted" && !s.ducted) return false;
    if (zones === "single" && s.zones !== 1) return false;
    if (zones === "multi" && s.zones < 2) return false;
    if (s.seer2 < minSeer) return false;
    if (btu) {
      const band = BTU_BANDS.find((b) => b.id === btu)!;
      if (!band.test(s.btuMin, s.btuMax)) return false;
    }
    return true;
  });

  const activeCount =
    cats.size + (ducting !== "all" ? 1 : 0) + (zones !== "any" ? 1 : 0) + (minSeer > 0 ? 1 : 0) + (btu ? 1 : 0);

  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container className="py-12 lg:py-14">
          <Eyebrow>The TCL lineup</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
            Find the right system, by the numbers.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-2">
            Filter by ducting, zones, SEER2, and capacity — every card carries the
            same Spec &amp; Stock strip so you can compare at a glance and add to a
            quote in one tap.
          </p>
        </Container>
      </section>

      <Container className="py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-ink-1">
                <SlidersHorizontal size={16} /> Filters
              </span>
              {activeCount > 0 && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-xs font-medium text-ink-3 hover:text-danger"
                >
                  <X size={12} /> Clear ({activeCount})
                </button>
              )}
            </div>

            <FilterGroup label="System type">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <FilterPill key={c} active={cats.has(c)} onClick={() => toggleCat(c)}>
                    {CATEGORY_LABEL[c]}
                  </FilterPill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Ducting">
              <Segmented
                value={ducting}
                onChange={(v) => setDucting(v as Ducting)}
                options={[
                  { value: "all", label: "All" },
                  { value: "ductless", label: "Ductless" },
                  { value: "ducted", label: "Ducted" },
                ]}
              />
            </FilterGroup>

            <FilterGroup label="Zones">
              <Segmented
                value={zones}
                onChange={(v) => setZones(v as ZoneFilter)}
                options={[
                  { value: "any", label: "Any" },
                  { value: "single", label: "Single" },
                  { value: "multi", label: "Multi" },
                ]}
              />
            </FilterGroup>

            <FilterGroup label="Min SEER2">
              <div className="flex flex-wrap gap-2">
                {SEER_STOPS.map((v) => (
                  <FilterPill key={v} active={minSeer === v} onClick={() => setMinSeer(v)}>
                    {v === 0 ? "Any" : `${v}+`}
                  </FilterPill>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Capacity">
              <div className="flex flex-wrap gap-2">
                {BTU_BANDS.map((b) => (
                  <FilterPill
                    key={b.id}
                    active={btu === b.id}
                    onClick={() => setBtu(btu === b.id ? null : b.id)}
                  >
                    {b.label}
                  </FilterPill>
                ))}
              </div>
            </FilterGroup>
          </aside>

          {/* Results */}
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-wider text-ink-3">
              {filtered.length} {filtered.length === 1 ? "series" : "series"}
              {activeCount > 0 ? " match your filters" : " available"}
            </p>
            {filtered.length === 0 ? (
              <div className="rounded-[--r-md] border border-dashed border-line-strong bg-surface-2/40 p-12 text-center">
                <p className="text-ink-2">No series match those filters.</p>
                <button onClick={reset} className="mt-3 text-sm font-medium text-brand hover:text-brand-hover">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((s) => (
                  <ProductCard key={s.slug} series={s} ops={getSeededSeriesCardSummary(s.slug)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-line pt-5 first:mt-5">
      <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">
        {label}
      </h3>
      {children}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-transparent bg-brand text-brand-ink"
          : "border-line bg-surface-1 text-ink-2 hover:border-ink-4 hover:text-ink-1"
      }`}
    >
      {children}
    </button>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-[--r-sm] border border-line bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-[5px] px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.value
              ? "bg-surface-1 text-ink-1 shadow-[var(--shadow-sm)]"
              : "text-ink-3 hover:text-ink-1"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
