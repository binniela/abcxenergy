import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, FileText, Home, ShieldCheck, Truck, UserCheck, Wrench } from "lucide-react";
import { AddToQuote } from "@/components/add-to-quote";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BuyBoxAssurance } from "@/components/buy-box-assurance";
import { DeliveryEstimate } from "@/components/delivery-estimate";
import { StickyBuyBar } from "@/components/sticky-buy-bar";
import { ProductGallery } from "@/components/product-gallery";
import { ProductReviews, ReviewStarsInline } from "@/components/product-reviews";
import { getReviews, reviewSummary } from "@/lib/reviews";
import { accessoriesForCategory } from "@/lib/accessories";
import { SkuCard } from "@/components/sku-card";
import { Chip, Container, LinkButton } from "@/components/ui";
import {
  documentHref,
  getRelatedSkus,
  getStorefrontSku,
  getStorefrontSkus,
  productHref,
  skuSlug,
} from "@/lib/storefront/catalog";
import { SITE, financingMonthly } from "@/lib/site";

export function generateStaticParams() {
  return getStorefrontSkus().map((sku) => ({ sku: skuSlug(sku.sku) }));
}

export async function generateMetadata({ params }: PageProps<"/products/sku/[sku]">): Promise<Metadata> {
  const { sku: skuParam } = await params;
  const sku = getStorefrontSku(decodeURIComponent(skuParam));
  if (!sku) return { title: "SKU not found" };
  return {
    title: `${sku.sku} - ${sku.title}`,
    description: `${sku.title}. ${sku.btu.toLocaleString()} BTU, ${sku.voltage}, ${sku.unitType}, ${sku.available} available from Summit HVAC Supply.`,
    alternates: { canonical: productHref(sku) },
  };
}

export default async function SkuPage({ params }: PageProps<"/products/sku/[sku]">) {
  const { sku: skuParam } = await params;
  const sku = getStorefrontSku(decodeURIComponent(skuParam));
  if (!sku) notFound();
  const related = getRelatedSkus(sku, 3);
  const reviews = getReviews(sku.id, sku.seriesSlug);
  const summary = reviewSummary(reviews);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sku.title,
    sku: sku.sku,
    mpn: sku.modelNumber,
    image: `${SITE.origin}${sku.image}`,
    brand: { "@type": "Brand", name: "TCL" },
    description: `${sku.title} for ${sku.unitType} applications.`,
    offers: {
      "@type": "Offer",
      url: `${SITE.origin}${productHref(sku)}`,
      priceCurrency: "USD",
      price: sku.msrp,
      availability: sku.available > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: SITE.name },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Model", value: sku.modelNumber },
      { "@type": "PropertyValue", name: "BTU", value: sku.btu },
      { "@type": "PropertyValue", name: "Voltage", value: sku.voltage },
      { "@type": "PropertyValue", name: "AHRI Reference", value: sku.ahriReference },
      { "@type": "PropertyValue", name: "Refrigerant", value: sku.refrigerant },
    ],
    // Only emitted when real reviews exist — never fabricated.
    ...(summary
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: summary.average,
            reviewCount: summary.count,
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            author: { "@type": "Person", name: r.author },
            datePublished: r.date,
            ...(r.title ? { name: r.title } : {}),
            reviewBody: r.body,
          })),
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="border-b border-line bg-surface-1">
        <Container className="py-3">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop Systems", href: "/products" },
              { label: sku.categoryLabel, href: `/products?category=${sku.category}` },
              { label: sku.sku, href: productHref(sku) },
            ]}
          />
        </Container>
      </div>
      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <ProductGallery
              images={[sku.image]}
              title={sku.title}
              specs={[
                { label: "Capacity", value: `${sku.btu.toLocaleString()} BTU` },
                { label: "Voltage", value: sku.voltage },
                { label: "Unit type", value: sku.unitType },
                { label: "Refrigerant", value: sku.refrigerant },
              ]}
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="neutral">{sku.categoryLabel}</Chip>
              <Chip tone={sku.stockStatus === "ready" ? "stock" : sku.stockStatus === "low" ? "copper" : "lead"}>
                {sku.available} available in {sku.warehouse.code}
              </Chip>
            </div>
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">{sku.sku}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">{sku.title}</h1>
            <p className="mt-2 text-ink-2">{sku.modelNumber} · {sku.btu.toLocaleString()} BTU · {sku.voltage} · {sku.unitType}</p>
            {summary && (
              <a href="#reviews" className="mt-2 inline-block">
                <ReviewStarsInline summary={summary} />
              </a>
            )}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="tnum font-display text-3xl font-semibold tracking-tight text-ink-1">
                {currency(sku.msrp)}
              </span>
              <span className="text-sm text-ink-2">
                retail · as low as{" "}
                <span className="tnum font-semibold text-ink-1">{currency(financingMonthly(sku.msrp))}/mo</span>{" "}
                with financing
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-(--r-md) border border-line bg-line sm:grid-cols-4">
              <Metric label="Retail" value={currency(sku.msrp)} />
              <Metric label="Contractor" value="Sign in" />
              <Metric label="AHRI" value={sku.ahriReference} />
              <Metric label="Refrigerant" value={sku.refrigerant} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <BuyerPath
                icon={<Home size={18} />}
                title="Buying this for your home?"
                body="Buy at retail with no trade account — ships from Newark or ready for will-call. We can also refer qualified Bay Area installers."
                href="/homeowners#homeowner-request"
                cta="Get installer help"
              />
              <BuyerPath
                icon={<UserCheck size={18} />}
                title="Contractor or property buyer?"
                body="Add this SKU to a quote, then sign in or open a contractor account for pro pricing."
                href="/dealers"
                cta="Contractor account"
              />
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AddToQuote sku={sku} full />
              <LinkButton href="/quote" variant="secondary">Request a Quote</LinkButton>
            </div>

            <DeliveryEstimate inStock={sku.available > 0} />
            <BuyBoxAssurance price={sku.msrp} className="mt-5" />
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Trust icon={<Truck size={18} />} title="Newark stock" body={`${sku.available} available from ${sku.warehouse.name}`} />
              <Trust icon={<ShieldCheck size={18} />} title="Warranty" body={`${sku.warrantyCompressor} compressor / ${sku.warrantyParts} parts`} />
              <Trust icon={<Check size={18} />} title="Certifications" body={sku.certifications.join(", ")} />
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">Specifications</h2>
            <div className="mt-5 overflow-hidden rounded-(--r-md) border border-line">
              <Spec label="SKU" value={sku.sku} />
              <Spec label="Model number" value={sku.modelNumber} />
              <Spec label="Capacity" value={`${sku.btu.toLocaleString()} BTU`} />
              <Spec label="Unit type" value={sku.unitType} />
              <Spec label="Dimensions" value={sku.dimensions} />
              <Spec label="Weight" value={`${sku.weightLbs} lb`} />
              <Spec label="Voltage" value={sku.voltage} />
              <Spec label="Warehouse" value={`${sku.warehouse.name} (${sku.warehouse.address})`} />
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">Documents</h2>
            <div className="mt-5 grid gap-3">
              {sku.documents.map((doc) => (
                <a key={doc.id} href={documentHref(doc)} className="flex items-center gap-3 rounded-(--r-sm) border border-line bg-surface-1 p-3 text-sm font-medium text-ink-1 hover:border-ink-4">
                  <FileText size={18} className="text-brand" />
                  {doc.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">Complete your install</h2>
              <p className="mt-1 text-sm text-ink-2">Common companion items for this system — add them to your quote and we&apos;ll confirm exact parts.</p>
            </div>
            <Link href={`/quote?sku=${encodeURIComponent(sku.sku)}`} className="text-sm font-medium text-brand hover:text-brand-hover">
              Add accessories to quote →
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accessoriesForCategory(sku.category).map((item) => (
              <div key={item.key} className="rounded-(--r-md) border border-line bg-surface-1 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-(--r-sm) bg-copper-tint text-copper">
                    <Wrench size={16} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-ink-1">{item.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-2">{item.blurb}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">Plain-English buying guidance</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Guidance title="Best for" body={`${sku.unitType} projects where the listed ${sku.btu.toLocaleString()} BTU capacity and ${sku.voltage} electrical setup match the installer-confirmed design.`} />
            <Guidance title="Not ideal for" body="Projects without professional sizing, uncertain electrical capacity, or rebate paperwork that has not been checked before purchase." />
            <Guidance title="Bay Area note" body="Summit can help with equipment availability from Newark and installer referral, but the installing contractor confirms placement, permits, startup, and labor." />
          </div>
        </section>

        <ProductReviews reviews={reviews} summary={summary} />

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">Related SKUs</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <SkuCard key={item.id} sku={item} />)}
          </div>
        </section>
      </Container>

      <StickyBuyBar sku={sku} priceLabel={currency(sku.msrp)} />
    </>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-1 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">{label}</p>
      <p className="tnum mt-1 break-words font-mono text-sm font-semibold text-ink-1">{value}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid border-b border-line bg-surface-1 sm:grid-cols-[220px_1fr]">
      <dt className="px-4 py-3 text-sm font-medium text-ink-2">{label}</dt>
      <dd className="px-4 py-3 font-mono text-sm font-semibold text-ink-1">{value}</dd>
    </div>
  );
}

function Trust({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-(--r-md) border border-line bg-surface-1 p-4">
      <span className="grid size-10 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">{icon}</span>
      <h3 className="mt-3 font-display text-base font-semibold text-ink-1">{title}</h3>
      <p className="mt-1 text-sm text-ink-2">{body}</p>
    </div>
  );
}

function BuyerPath({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="rounded-(--r-md) border border-line bg-surface-1 p-4 transition-colors hover:border-line-strong hover:bg-surface-2">
      <span className="grid size-10 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">{icon}</span>
      <h2 className="mt-3 font-display text-base font-semibold text-ink-1">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">{body}</p>
      <span className="mt-3 inline-flex text-sm font-medium text-brand">{cta}</span>
    </Link>
  );
}

function Guidance({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-(--r-md) border border-line bg-surface-1 p-5">
      <h3 className="font-display text-base font-semibold text-ink-1">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}
