"use client";

import { SlidersHorizontal, X } from "lucide-react";
import * as React from "react";
import { CATEGORY_LABEL, type Category } from "@/lib/products";

type Ducting = "all" | "ductless" | "ducted";
type ZoneFilter = "any" | "single" | "multi";

type SeriesFilterMeta = {
  slug: string;
  category: Category;
  ducted: boolean;
  zones: number;
  seer2: number;
  btuMin: number;
  btuMax: number;
};

const CATEGORIES: Category[] = ["ductless", "ducted", "commercial", "ventilation"];
const SEER_STOPS = [0, 18, 20, 22] as const;
const BTU_BANDS = [
  { id: "small", label: "<= 12k BTU", test: (lo: number) => lo <= 12000 },
  { id: "mid", label: "18-36k BTU", test: (lo: number, hi: number) => hi >= 18000 && lo <= 36000 },
  { id: "large", label: "36k+ BTU", test: (_lo: number, hi: number) => hi >= 36000 },
] as const;

export function ProductCatalogControls({ series }: { series: SeriesFilterMeta[] }) {
  const [cats, setCats] = React.useState<Set<Category>>(new Set());
  const [ducting, setDucting] = React.useState<Ducting>("all");
  const [zones, setZones] = React.useState<ZoneFilter>("any");
  const [minSeer, setMinSeer] = React.useState<number>(0);
  const [btu, setBtu] = React.useState<string | null>(null);

  const filteredSlugs = React.useMemo(() => {
    return series
      .filter((s) => {
        if (cats.size && !cats.has(s.category)) return false;
        if (ducting === "ductless" && s.ducted) return false;
        if (ducting === "ducted" && !s.ducted) return false;
        if (zones === "single" && s.zones !== 1) return false;
        if (zones === "multi" && s.zones < 2) return false;
        if (s.seer2 < minSeer) return false;
        if (btu) {
          const band = BTU_BANDS.find((candidate) => candidate.id === btu);
          if (band && !band.test(s.btuMin, s.btuMax)) return false;
        }
        return true;
      })
      .map((s) => s.slug);
  }, [btu, cats, ducting, minSeer, series, zones]);

  const activeCount =
    cats.size + (ducting !== "all" ? 1 : 0) + (zones !== "any" ? 1 : 0) + (minSeer > 0 ? 1 : 0) + (btu ? 1 : 0);

  React.useEffect(() => {
    const visible = new Set(filteredSlugs);
    document.querySelectorAll<HTMLElement>("[data-series-card]").forEach((card) => {
      card.hidden = !visible.has(card.dataset.seriesCard ?? "");
    });

    const empty = document.getElementById("catalog-empty-state");
    if (empty) empty.hidden = filteredSlugs.length > 0;

    const count = document.getElementById("catalog-result-count");
    if (count) {
      count.textContent = `${filteredSlugs.length} ${filteredSlugs.length === 1 ? "series" : "series"}${
        activeCount > 0 ? " match your filters" : " available"
      }`;
    }
  }, [activeCount, filteredSlugs]);

  const toggleCat = (category: Category) => {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const reset = () => {
    setCats(new Set());
    setDucting("all");
    setZones("any");
    setMinSeer(0);
    setBtu(null);
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-ink-1">
          <SlidersHorizontal size={16} /> Filters
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-3 hover:text-danger"
          >
            <X size={12} /> Clear ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup label="System type">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <FilterPill key={category} active={cats.has(category)} onClick={() => toggleCat(category)}>
              {CATEGORY_LABEL[category]}
            </FilterPill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Ducting">
        <Segmented
          value={ducting}
          onChange={(value) => setDucting(value as Ducting)}
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
          onChange={(value) => setZones(value as ZoneFilter)}
          options={[
            { value: "any", label: "Any" },
            { value: "single", label: "Single" },
            { value: "multi", label: "Multi" },
          ]}
        />
      </FilterGroup>

      <FilterGroup label="Min SEER2">
        <div className="flex flex-wrap gap-2">
          {SEER_STOPS.map((value) => (
            <FilterPill key={value} active={minSeer === value} onClick={() => setMinSeer(value)}>
              {value === 0 ? "Any" : `${value}+`}
            </FilterPill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Capacity">
        <div className="flex flex-wrap gap-2">
          {BTU_BANDS.map((band) => (
            <FilterPill key={band.id} active={btu === band.id} onClick={() => setBtu(btu === band.id ? null : band.id)}>
              {band.label}
            </FilterPill>
          ))}
        </div>
      </FilterGroup>
    </aside>
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
      type="button"
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
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[--r-sm] border border-line bg-surface-1 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-[5px] px-2 py-1.5 text-xs font-medium transition-colors ${
            value === option.value ? "bg-brand text-brand-ink" : "text-ink-3 hover:text-ink-1"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
