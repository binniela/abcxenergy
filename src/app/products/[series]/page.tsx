import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronRight,
  FileText,
  BookOpen,
  Check,
  Leaf,
  ArrowRight,
} from "lucide-react";
import {
  SERIES,
  getSeries,
  btuLabel,
  CATEGORY_LABEL,
  ENERGY_STAR_LABEL,
  type Series,
} from "@/lib/products";
import { Container, Chip, LinkButton } from "@/components/ui";
import { SpecStockStrip } from "@/components/spec-stock-strip";
import { AddToQuote } from "@/components/add-to-quote";
import { ProductCard } from "@/components/product-card";
import { SITE } from "@/lib/site";
import { getSeriesBackendSummary } from "@/lib/backend/services";
import { getSeededSeriesCardSummary } from "@/lib/backend/catalog";

export function generateStaticParams() {
  return SERIES.map((s) => ({ series: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[series]">): Promise<Metadata> {
  const { series } = await params;
  const s = getSeries(series);
  if (!s) return { title: "Product not found" };
  return {
    title: `${s.name} - ${s.family}`,
    description: `${s.tagline} ${s.description}`,
  };
}

export default async function SeriesPage({ params }: PageProps<"/products/[series]">) {
  const { series } = await params;
  const s = getSeries(series);
  if (!s) notFound();

  const energyStar = ENERGY_STAR_LABEL[s.energyStar];
  const related = SERIES.filter((x) => x.slug !== s.slug && x.category === s.category).slice(0, 3);
  const fallbackRelated = SERIES.filter((x) => x.slug !== s.slug).slice(0, 3);
  const relatedList = related.length ? related : fallbackRelated;
  const backendSummary = await getSeriesBackendSummary(s.slug);

  // Product structured data (escaped per Next.js JSON-LD guidance).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${s.family} (${s.name})`,
    description: s.description,
    brand: { "@type": "Brand", name: "TCL" },
    category: CATEGORY_LABEL[s.category],
    offers: {
      "@type": "Offer",
      availability:
        s.stock === "ready"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: SITE.name },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "SEER2", value: s.seer2 },
      ...(s.hspf2 ? [{ "@type": "PropertyValue", name: "HSPF2", value: s.hspf2 }] : []),
      { "@type": "PropertyValue", name: "Capacity (BTU)", value: btuLabel(s) },
      { "@type": "PropertyValue", name: "Min operating temp", value: s.minTemp },
      { "@type": "PropertyValue", name: "Refrigerant", value: s.refrigerant },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-line bg-surface-1">
        <Container className="flex items-center gap-1.5 py-3 text-sm text-ink-3">
          <Link href="/" className="hover:text-ink-1">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-ink-1">Products</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-ink-1">{s.name}</span>
        </Container>
      </div>

      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[--r-lg] bg-surface-2 shadow-[var(--shadow-md)]">
              <Image
                src={s.image}
                alt={`${s.name} product image`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
              {energyStar === "ENERGY STAR Most Efficient 2025" && (
                <span className="absolute left-4 top-4">
                  <Chip tone="eco">
                    <Leaf size={12} strokeWidth={2.5} /> Most Efficient 2025
                  </Chip>
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {s.highlights.slice(0, 4).map((highlight) => (
                <div key={highlight} className="relative aspect-square overflow-hidden rounded-[--r-sm] bg-surface-2">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="90px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div>
            <div className="flex items-center gap-2">
              <Chip tone="neutral">{CATEGORY_LABEL[s.category]}</Chip>
              {energyStar && <Chip tone="eco"><Leaf size={12} strokeWidth={2.5} /> {energyStar}</Chip>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
              {s.name}
            </h1>
            <p className="mt-1 font-mono text-sm text-ink-3">{s.family}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
              Type: {s.type}
            </p>

            <SpecStockStrip series={s} className="mt-6" />
            <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[--r-sm] border border-line bg-line text-center">
              <BackendCell label="SKUs" value={`${backendSummary.skus.length}`} />
              <BackendCell label="Available" value={`${backendSummary.availableUnits}`} />
              <BackendCell label="Dealer from" value={currency(backendSummary.startingDealerPrice)} />
            </div>

            <ul className="mt-6 grid gap-2.5">
              {s.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-[15px] text-ink-1">
                  <Check size={17} className="shrink-0 text-eco" strokeWidth={2.5} />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AddToQuote slug={s.slug} name={s.name} full />
              <LinkButton href="/quote" variant="secondary" size="md" className="sm:w-auto">
                Get a Quote
              </LinkButton>
            </div>

            {/* Support requests */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <RequestRow
                href="/contact"
                icon={<FileText size={18} />}
                title="Request spec sheet"
                sub="Performance data for this series"
              />
              <RequestRow
                href="/contact"
                icon={<BookOpen size={18} />}
                title="Request install manual"
                sub="Line set, wiring, startup notes"
              />
            </div>
          </div>
        </div>

        {/* Full spec table */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
            Full specifications
          </h2>
          <div className="mt-5 overflow-hidden rounded-[--r-md] border border-line">
            <SpecTable series={s} />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
            SKU availability
          </h2>
          <p className="mt-1 text-sm text-ink-3">
            Newark warehouse stock, dealer pricing, and mock document actions from the backend catalog.
          </p>
          <div className="mt-5 overflow-x-auto rounded-[--r-md] border border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-[0.12em] text-ink-3">
                <tr>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">BTU</th>
                  <th className="px-4 py-3 font-medium">Dealer</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {backendSummary.skus.map((sku) => (
                  <tr key={sku.id} className="bg-surface-1">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-ink-1">{sku.sku}</td>
                    <td className="px-4 py-3 text-ink-2">{sku.modelNumber}</td>
                    <td className="px-4 py-3 tnum font-mono">{sku.btu.toLocaleString()}</td>
                    <td className="px-4 py-3 tnum font-mono font-semibold">{currency(sku.dealerPrice)}</td>
                    <td className="px-4 py-3">
                      <Chip tone={sku.status === "ready" ? "stock" : sku.status === "low" ? "copper" : "lead"}>
                        {sku.available} {sku.status}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-3">
                      {backendSummary.documents.filter((doc) => doc.skuId === sku.id).length} linked
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related */}
        <section className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
              Compare across the lineup
            </h2>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover">
              All series <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedList.map((r) => (
              <ProductCard key={r.slug} series={r} ops={getSeededSeriesCardSummary(r.slug)} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

function BackendCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-1 px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">{label}</p>
      <p className="tnum mt-1 font-mono text-sm font-semibold text-ink-1">{value}</p>
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function RequestRow({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-[--r-sm] border border-line bg-surface-1 p-3 text-left transition-colors hover:border-ink-4 hover:bg-surface-2"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[--r-sm] bg-brand-tint text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink-1">{title}</span>
        <span className="block truncate text-xs text-ink-3">{sub}</span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-ink-3 group-hover:text-brand" />
    </Link>
  );
}

function SpecTable({ series: s }: { series: Series }) {
  const rows: { label: string; value: string }[] = [
    { label: "Series family", value: s.family },
    { label: "Live site type", value: s.type },
    { label: "System type", value: CATEGORY_LABEL[s.category] },
    { label: "Configuration", value: s.ducted ? "Ducted" : "Ductless" },
    { label: "SEER2 (cooling efficiency)", value: `${s.seer2}` },
    { label: "HSPF2 (heating efficiency)", value: s.hspf2 ? `${s.hspf2}` : "n/a" },
    { label: "Capacity range", value: `${btuLabel(s)} BTU` },
    { label: "Max zones", value: `${s.zones}` },
    { label: "Min operating temp", value: s.minTemp },
    { label: "Refrigerant", value: s.refrigerant },
    {
      label: "Warranty",
      value: `${s.warrantyCompressor} compressor · ${s.warrantyParts} parts`,
    },
  ];

  return (
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={r.label}
            className={i % 2 === 0 ? "bg-surface-1" : "bg-surface-2/50"}
          >
            <th
              scope="row"
              className="w-1/2 border-b border-line px-4 py-3 font-medium text-ink-2 sm:w-2/5"
            >
              {r.label}
            </th>
            <td className="tnum border-b border-line px-4 py-3 font-mono font-medium text-ink-1">
              {r.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
