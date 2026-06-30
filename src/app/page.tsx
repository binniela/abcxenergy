import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  HardHat,
  Wrench,
  Home,
  TrendingUp,
  PackageCheck,
  Truck,
  FileBadge,
  Leaf,
  ArrowUpRight,
} from "lucide-react";
import { Container, Eyebrow, LinkButton, Chip } from "@/components/ui";
import { TrustBadges } from "@/components/trust-badges";
import { ProductCard } from "@/components/product-card";
import { SpecStockStrip } from "@/components/spec-stock-strip";
import { getSeries, SERIES } from "@/lib/products";
import { SITE, REBATES } from "@/lib/site";
import { getSeededSeriesCardSummary } from "@/lib/backend/catalog";

const elite = getSeries("elite")!;
const featured = SERIES;

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_-10%,var(--brand-tint),transparent)]" />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="rise">
            <Eyebrow>Authorized TCL HVAC · Wholesale</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-1 sm:text-5xl lg:text-[3.4rem]">
              Wholesale TCL HVAC, in stock and shipped fast across the West Coast.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              AHRI-certified systems at contractor pricing, with spec sheets,
              stock status, and rebate support built for the way you actually
              bid and reorder. From “I need a unit” to “quote requested” in under
              a minute.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/dealers" size="lg">
                Request Wholesale Account
                <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/quote" variant="secondary" size="lg">
                Get a Quote
              </LinkButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-stock-ready" />
                In-stock units ship same day
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-eco" />
                Serving {SITE.serviceArea}
              </span>
            </div>
          </div>

          {/* Product showcase with the signature strip floating over it */}
          <div className="rise relative">
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[--r-lg] bg-surface-2 shadow-[var(--shadow-lg)]">
              <Image
                src={elite.image}
                alt={`${elite.name} product image`}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain"
              />
              <span className="absolute left-4 top-4">
                <Chip tone="eco">
                  <Leaf size={12} strokeWidth={2.5} /> ENERGY STAR Most Efficient 2025
                </Chip>
              </span>
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-[--r-md] border border-line bg-surface-1/95 p-2 shadow-[var(--shadow-lg)] backdrop-blur">
              <SpecStockStrip series={elite} className="border-0 bg-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Trust band ─────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface-1">
        <Container className="py-8">
          <p className="mb-5 text-center text-sm text-ink-3">
            Certified TCL HVAC lineup
          </p>
          <TrustBadges />
        </Container>
      </section>

      {/* ── Role-based entry ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHead
            title="Built around the contractor. Homeowners welcome too."
            sub="The contractor picks the brand, so the whole site is built for them. Homeowners get a fast path to a vetted installer."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <RoleCard
              icon={<HardHat size={20} />}
              tone="primary"
              title="Contractors & Dealers"
              body="Contractor pricing, deep stock, spec/rebate support, and one-tap reorder. Open a wholesale account."
              cta="Request wholesale account"
              href="/dealers"
            />
            <RoleCard
              icon={<Wrench size={20} />}
              tone="primary"
              title="Installers"
              body="Need units for a specific job? Build a quote from the lineup and get pricing + lead times back fast."
              cta="Get a quote"
              href="/quote"
            />
            <RoleCard
              icon={<Home size={20} />}
              tone="muted"
              title="Homeowners"
              body="Not a contractor? We can connect you with a TCL installer in your area. No pressure, no markup games."
              cta="Find a TCL installer"
              href="/contact"
            />
          </div>
        </Container>
      </section>

      {/* ── Why us ─────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-surface-1 py-16 lg:py-20">
        <Container>
          <SectionHead
            eyebrow="Why contractors choose us"
            title="A value brand, distributed like a premium one."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[--r-md] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            <ValueCell
              icon={<TrendingUp size={20} />}
              title="Margin that works"
              body="TCL value pricing leaves real room on every bid, without cheapening the install."
            />
            <ValueCell
              icon={<PackageCheck size={20} />}
              title="Actually in stock"
              body="Core SKUs stocked deep on the West Coast. Live stock status on every product."
            />
            <ValueCell
              icon={<Truck size={20} />}
              title="Fast, local fulfillment"
              body="Same-day ship on in-stock units from Newark, CA. Will-call and freight."
            />
            <ValueCell
              icon={<FileBadge size={20} />}
              title="Spec & rebate support"
              body="Spec sheets, install manuals, and rebate guidance (25C, TECH Clean CA) on hand."
            />
          </div>
        </Container>
      </section>

      {/* ── Featured products ──────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionHead
              title="Find the right system, fast."
              sub="Filter by BTU, SEER2, zones, and ducting, or jump straight to a series."
              align="left"
            />
            <Link
              href="/products"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover sm:inline-flex"
            >
              All {SERIES.length} series
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ProductCard key={s.slug} series={s} ops={getSeededSeriesCardSummary(s.slug)} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Fulfillment proof ──────────────────────────────────────────── */}
      <section className="border-y border-line bg-[var(--ink-panel)] py-16 text-white lg:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-[oklch(0.78_0.08_55)]">
              West Coast fulfillment
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Stocked in Newark, CA. Shipping the whole West Coast.
            </h2>
            <p className="mt-4 max-w-lg text-white/65">
              Your units do not sit on a truck from across the country. Order in
              the morning, and in-stock SKUs are on their way the same day.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <Stat value="Same-day" label="ship on in-stock units" />
              <Stat value="5 states" label="CA, OR, WA, NV, AZ" />
              <Stat value="Will-call" label="& freight from Newark" />
            </div>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-[--r-lg] shadow-[var(--shadow-lg)]">
            <Image
              src="/site/warehouse-fulfillment.png"
              alt="Organized HVAC warehouse fulfillment area with stocked equipment"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* ── Rebate strip ───────────────────────────────────────────────── */}
      <section className="border-y border-line bg-eco-tint/40 py-12">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-[--r-md] bg-eco-tint text-eco-ink">
              <Leaf size={20} strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink-1">
                Help your customers stack the rebates.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-ink-2">
                {REBATES.map((r) => r.name).join(", ")}. We keep the guides
                current so you can close on total cost, not sticker price.
              </p>
            </div>
          </div>
          <LinkButton href="/resources" variant="secondary" className="shrink-0">
            Rebate & spec resources
            <ArrowRight size={16} />
          </LinkButton>
        </Container>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <Container className="overflow-hidden rounded-[--r-lg] border border-line bg-surface-1 shadow-[var(--shadow-md)]">
          <div className="relative px-8 py-14 text-center sm:px-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_120%_at_50%_-20%,var(--brand-tint),transparent)]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
                Open an account and price your next job today.
              </h2>
              <p className="mt-4 text-lg text-ink-2">
                Contractor pricing, real stock, and spec support. One quick
                application gets you set up.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <LinkButton href="/dealers" size="lg">
                  Request Wholesale Account
                  <ArrowRight size={18} />
                </LinkButton>
                <LinkButton href={SITE.phoneHref} variant="ghost" size="lg">
                  Call {SITE.phone}
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ── Local section helpers ──────────────────────────────────────────────── */

function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-[2.1rem]">
        {title}
      </h2>
      {sub && <p className="mt-3 text-ink-2">{sub}</p>}
    </div>
  );
}

function RoleCard({
  icon,
  title,
  body,
  cta,
  href,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href: string;
  tone: "primary" | "muted";
}) {
  const primary = tone === "primary";
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-[--r-md] border p-6 transition-shadow hover:shadow-[var(--shadow-md)] ${
        primary
          ? "border-line bg-surface-1 shadow-[var(--shadow-sm)]"
          : "border-dashed border-line-strong bg-surface-2/50"
      }`}
    >
      <span
        className={`grid size-11 place-items-center rounded-[--r-md] ${
          primary ? "bg-brand-tint text-brand" : "bg-surface-3 text-ink-3"
        }`}
      >
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink-1">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{body}</p>
      <span
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
          primary ? "text-brand" : "text-ink-2"
        }`}
      >
        {cta}
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function ValueCell({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-surface-1 p-6">
      <span className="grid size-10 place-items-center rounded-[--r-sm] bg-copper-tint text-copper">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-ink-1">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-xs leading-snug text-white/55">{label}</div>
    </div>
  );
}
