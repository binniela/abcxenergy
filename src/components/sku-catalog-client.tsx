"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import * as React from "react";
import { SkuCard } from "./sku-card";
import { Button } from "./ui";
import {
  filterStorefrontSkus,
  getCatalogFacets,
  sortStorefrontSkus,
  SORT_OPTIONS,
  type CatalogFilters,
  type SortKey,
  type StorefrontSku,
} from "@/lib/storefront/catalog";
import type { Category } from "@/lib/products";

type Facets = ReturnType<typeof getCatalogFacets>;

export function SkuCatalogClient({ skus, facets }: { skus: StorefrontSku[]; facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = React.useState(params.get("q") ?? "");

  const filters: CatalogFilters = {
    q: params.get("q") ?? undefined,
    category: (params.get("category") as Category | null) ?? "all",
    btu: params.get("btu") ?? undefined,
    voltage: params.get("voltage") ?? undefined,
    unitType: params.get("unitType") ?? undefined,
    stock: (params.get("stock") as CatalogFilters["stock"]) ?? "all",
    minSeer: params.get("minSeer") ? Number(params.get("minSeer")) : undefined,
  };

  const sort = (params.get("sort") as SortKey | null) ?? "relevance";
  const filtered = sortStorefrontSkus(filterStorefrontSkus(filters), sort);

  function setParam(key: string, value?: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setParam("q", query.trim());
  }

  function clear() {
    setQuery("");
    router.push(pathname, { scroll: false });
  }

  const activeCount = Array.from(params.keys()).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form onSubmit={submitSearch} className="rounded-[--r-md] border border-line bg-surface-1 p-3 shadow-[var(--shadow-sm)]">
          <label className="sr-only" htmlFor="catalog-search">Search by SKU, model, BTU, or unit type</label>
          <div className="flex items-center gap-2">
            <Search size={17} className="text-ink-3" />
            <input
              id="catalog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search SKU or model"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink-1 outline-none placeholder:text-ink-4"
            />
            <Button type="submit" size="md">Search</Button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-ink-1">
            <SlidersHorizontal size={16} /> Filters
          </span>
          {activeCount > 0 && (
            <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs font-medium text-ink-3 hover:text-danger">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <FilterGroup label="Category">
          <Select value={filters.category ?? "all"} onChange={(value) => setParam("category", value)}>
            <option value="all">All categories</option>
            {facets.categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup label="Capacity">
          <Select value={filters.btu ?? "all"} onChange={(value) => setParam("btu", value)}>
            <option value="all">Any BTU</option>
            <option value="small">Up to 12k BTU</option>
            <option value="mid">18k-36k BTU</option>
            <option value="large">36k+ BTU</option>
          </Select>
        </FilterGroup>
        <FilterGroup label="Voltage">
          <Select value={filters.voltage ?? "all"} onChange={(value) => setParam("voltage", value)}>
            <option value="all">Any voltage</option>
            {facets.voltages.map((voltage) => (
              <option key={voltage} value={voltage}>{voltage}</option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup label="Unit type">
          <Select value={filters.unitType ?? "all"} onChange={(value) => setParam("unitType", value)}>
            <option value="all">Any unit type</option>
            {facets.unitTypes.map((unitType) => (
              <option key={unitType} value={unitType}>{unitType}</option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup label="Stock">
          <Select value={filters.stock ?? "all"} onChange={(value) => setParam("stock", value)}>
            <option value="all">Any stock status</option>
            <option value="ready">Ready</option>
            <option value="low">Low stock</option>
            <option value="backorder">Backorder</option>
          </Select>
        </FilterGroup>
      </aside>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-3">
            {filtered.length} of {skus.length} SKUs
          </p>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(event) => setParam("sort", event.target.value === "relevance" ? undefined : event.target.value)}
              aria-label="Sort SKUs"
              className="h-9 rounded-[--r-sm] border border-control-border bg-control-bg px-2.5 text-sm text-ink-1 outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-[--r-md] border border-dashed border-line-strong bg-surface-2/50 p-10 text-center">
            <h2 className="font-display text-xl font-semibold text-ink-1">No SKUs match those filters.</h2>
            <p className="mt-2 text-sm text-ink-2">Clear filters, search by model number, or send the job details to our team.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={clear}>Clear filters</Button>
              <Link href="/contact" className="inline-flex h-10 items-center rounded-[--r-sm] border border-line-strong bg-surface-1 px-4 text-sm font-medium text-ink-1 hover:bg-surface-2">
                Contact support
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((sku, index) => (
              <SkuCard key={sku.id} sku={sku} priority={index < 2} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-line pt-5 first:mt-5">
      <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</h3>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-[--r-sm] border border-control-border bg-control-bg px-3 text-sm text-ink-1 outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
    >
      {children}
    </select>
  );
}
