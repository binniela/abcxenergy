import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  HardHat,
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
import { REBATES } from "@/lib/site";
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
            <Eyebrow>Bay Area TCL HVAC supply · Newark, CA</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink-1 sm:text-5xl lg:text-[3.4rem]">
              Bay Area TCL heat pumps and mini splits, supplied locally.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              Buy equipment, request installer help, or open a contractor
              account from our Newark supply hub. We help homeowners buying one
              system and HVAC pros who need fast Bay Area stock.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/homeowners" size="lg">
                Find the right system
                <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/dealers" variant="secondary" size="lg">
                Open contractor account
              </LinkButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-stock-ready" />
                Buying one system? Yes, we can help.
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-eco" />
                Equipment supply only; installation is by qualified local contractors.
              </span>
              <span className="basis-full text-ink-3">
                Serving San Jose, Oakland, Fremont, San Francisco, the Peninsula,
                East Bay, South Bay, North Bay, and nearby Bay Area cities.
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
            title="Choose the path that matches how you buy."
            sub="Retail buyers get plain-English guidance and installer help. Contractors keep the fast SKU, stock, and quote workflow."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <RoleCard
              icon={<Home size={20} />}
              tone="primary"
              title="I’m buying for my home"
              body="Need one mini split or heat pump? We explain the options, rebate basics, and how to get matched with a Bay Area installer."
              cta="Start homeowner guide"
              href="/homeowners"
            />
            <RoleCard
              icon={<HardHat size={20} />}
              tone="primary"
              title="I’m a contractor"
              body="Check SKU availability, build job quotes, download documents, and open a pro account for contractor pricing."
              cta="Open contractor account"
              href="/dealers"
            />
            <RoleCard
              icon={<Building2 size={20} />}
              tone="muted"
              title="I manage a property"
              body="Compare systems for apartments, offices, restaurants, and tenant improvements with Bay Area delivery support."
              cta="Request property quote"
              href="/quote"
            />
          </div>
        </Container>
      </section>

      {/* ── Why us ─────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-surface-1 py-16 lg:py-20">
        <Container>
          <SectionHead
            eyebrow="Why Bay Area buyers choose us"
            title="Local supply with a clear path for homes and job sites."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[--r-md] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            <ValueCell
              icon={<TrendingUp size={20} />}
              title="One system is welcome"
              body="Retail buyers can ask about a single system without needing a trade account or SKU fluency."
            />
            <ValueCell
              icon={<PackageCheck size={20} />}
              title="Actually local"
              body="Core TCL systems are stocked in Newark for Bay Area will-call, local delivery, and fast job support."
            />
            <ValueCell
              icon={<Truck size={20} />}
              title="Contractor tools stay fast"
              body="Pros still get SKU search, spec sheets, stock status, quote lists, and account pricing after sign-in."
            />
            <ValueCell
              icon={<FileBadge size={20} />}
              title="Rebate-aware guidance"
              body="We surface Federal 25C and TECH Clean California context so buyers ask better questions."
            />
          </div>
        </Container>
      </section>

      {/* ── Featured products ──────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionHead
              title="Shop systems without guessing."
              sub="Homeowners can start with use case and comfort needs. Contractors can still filter by BTU, SEER2, zones, and documents."
              align="left"
            />
            <Link
              href="/products"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover sm:inline-flex"
            >
              Shop all systems
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
              Bay Area fulfillment
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Stocked in Newark, CA for Bay Area pickup and delivery.
            </h2>
            <p className="mt-4 max-w-lg text-white/65">
              Homeowners can ask about one system. Contractors can reserve job
              stock. Property teams can coordinate delivery from a local hub.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <Stat value="Newark" label="local will-call hub" />
              <Stat value="Bay Area" label="delivery coordination" />
              <Stat value="One unit" label="retail help available" />
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
                Bay Area buyers should ask about rebates early.
              </h2>
              <p className="mt-1 max-w-xl text-sm text-ink-2">
                {REBATES.map((r) => r.name).join(", ")}. We help homeowners
                and contractors understand what to confirm before a project is quoted.
              </p>
            </div>
          </div>
          <LinkButton href="/resources" variant="secondary" className="shrink-0">
            See rebate options
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
                Buying one system, opening a pro account, or quoting a property?
              </h2>
              <p className="mt-4 text-lg text-ink-2">
                Start with the lane that fits. We will keep the equipment,
                installer, and fulfillment questions separate and clear.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <LinkButton href="/homeowners" size="lg">
                  Buying one for your home?
                  <ArrowRight size={18} />
                </LinkButton>
                <LinkButton href="/quote" variant="ghost" size="lg">
                  Quote / Help
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
      <div className="mt-1 text-xs leading-snug text-white/70">{label}</div>
    </div>
  );
}
