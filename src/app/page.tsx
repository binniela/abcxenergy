import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  FileBadge,
  HardHat,
  Home,
  Leaf,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Tag,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";
import { HomepageHomeownerMiniForm } from "@/components/homepage-conversion-tools";
import { FeaturedSystems, startingPrice } from "@/components/featured-systems";
import { SystemSizer, type SizerSku } from "@/components/system-sizer";
import { getStorefrontSkus, productHref } from "@/lib/storefront/catalog";
import { TrustBadges } from "@/components/trust-badges";
import { Container, Eyebrow, LinkButton } from "@/components/ui";
import { REBATES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bay Area Heat Pumps & Mini Splits at Contractor Pricing | Summit HVAC Supply",
  description:
    "Buy TCL heat pumps and mini splits at contractor pricing from Summit HVAC Supply in Newark, CA. In-stock systems with real prices, licensed Bay Area installers, warranty intact.",
};

/* Three claims, all substantiated by how the business actually operates —
   a stat bar with six items in five columns was doing less with more. */
const trustItems = [
  { icon: <Warehouse size={17} />, label: "Newark warehouse — will-call pickup today" },
  { icon: <Wrench size={17} />, label: "Licensed Bay Area installer network" },
  { icon: <RotateCcw size={17} />, label: "30-day returns on unopened equipment" },
];

const objections = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Your warranty stays intact",
    body: "The “buying online voids your warranty” line is a myth. TCL's manufacturer warranty stays fully valid when a licensed contractor installs the system — and we hand you the AHRI certificate for rebate paperwork.",
  },
  {
    icon: <Wrench size={22} />,
    title: "Licensed, permitted, and Title 24 compliant",
    body: "California requires a C-20 HVAC license and EPA 608 certification to install a mini split — DIY isn't legal here, and it voids the warranty anyway. Our installer network holds both, pulls the permit, and files the Title 24 / HERS paperwork.",
  },
  {
    icon: <Tag size={22} />,
    title: "You see the real price",
    body: "Every SKU shows its price, stock count, and spec sheet before you talk to anyone. Compare it to the equipment line on a full-service quote and you'll know exactly what the markup was.",
  },
];

const whyTcl = [
  { value: "Top-5", label: "global air conditioner manufacturer by volume" },
  { value: "25+ yrs", label: "building compressors and AC systems as an OEM" },
  { value: "AHRI", label: "certified performance ratings on every match-up" },
  { value: "Newark", label: "parts and replacement units stocked locally" },
];

const categories = [
  {
    title: "Single-room mini splits",
    bestFor: "Bedrooms, garages, ADUs, offices, and hot/cold rooms.",
    useCase: "Start here when one space needs comfort.",
    href: "/products/breezein",
  },
  {
    title: "Multi-zone systems",
    bestFor: "Homes needing separate comfort control in multiple rooms.",
    useCase: "Useful when ducts are limited or room needs vary.",
    href: "/products/multi-zone",
  },
  {
    title: "Ducted heat pumps",
    bestFor: "Whole-home replacements and homes with usable ductwork.",
    useCase: "Good fit when replacing central heating and cooling.",
    href: "/products/central-system",
  },
  {
    title: "Light commercial",
    bestFor: "Retail, offices, restaurants, and tenant improvements.",
    useCase: "For higher-capacity systems and job quote support.",
    href: "/products/light-commercial",
  },
  {
    title: "Rebate-eligible systems",
    bestFor: "Homeowners and contractors checking incentive fit early.",
    useCase: "Ask about AHRI, efficiency, and program requirements.",
    href: "/resources",
  },
  {
    title: "Contractor-ready SKUs",
    bestFor: "Pros who know the model, capacity, or job package.",
    useCase: "Use product pages for stock, docs, and quote lists.",
    href: "/products",
  },
];

const visualProofs = [
  {
    src: "/site/generated/homeowner-installer-consult.jpg",
    alt: "Bay Area homeowner reviewing heat pump options with a qualified local installer",
    title: "Homeowner installer help",
    body: "Start with the home and comfort problem, then let an installer confirm the final scope.",
  },
  {
    src: "/site/generated/contractor-will-call-counter.jpg",
    alt: "HVAC contractor reviewing a will-call pickup order at a supply counter",
    title: "Contractor will-call",
    body: "Pros get a familiar counter workflow: stock, documents, account, quote, pickup.",
  },
  {
    src: "/site/generated/light-commercial-rooftop.jpg",
    alt: "Light commercial HVAC rooftop equipment being inspected by a technician",
    title: "Property and commercial",
    body: "Support for multi-unit, tenant improvement, and light commercial equipment scopes.",
  },
];

const howItWorks = [
  "Homeowner submits ZIP, home basics, rooms, duct status, and timeline.",
  "Summit reviews the likely equipment lane and rebate questions.",
  "A qualified local contractor confirms sizing, labor, permits, and final install scope.",
  "Summit supplies the equipment from the Newark hub for pickup, delivery, or freight.",
];

const faqs = [
  {
    q: "Does buying my own equipment void the warranty?",
    a: "No. TCL's manufacturer warranty remains fully valid when the system is installed by a licensed contractor. Summit provides the AHRI certificate and documentation your installer and rebate programs need.",
  },
  {
    q: "Will anyone install a system I bought myself?",
    a: "Yes. Summit refers licensed Bay Area installers who regularly work with owner-supplied equipment. Tell us your ZIP and rooms, and we connect you before you buy.",
  },
  {
    q: "Can I buy one mini split or heat pump?",
    a: "Yes. Summit helps Bay Area homeowners buying a single system at retail, no trade account needed, even if you do not know the model number yet.",
  },
  {
    q: "Do I need a permit, and is it a hassle?",
    a: "Yes, mini splits need a mechanical permit in California — but state law now caps residential heat pump permit fees at roughly $150–$200 in most cities, and many issue them same-day online. Your installer pulls the permit and files the Title 24 / HERS paperwork; you don't touch it.",
  },
  {
    q: "Can I install it myself?",
    a: "Not legally in California for a standard mini split — installation requires a C-20 HVAC contractor license and EPA 608 certification for refrigerant work, and DIY installation voids the manufacturer warranty. That's why every referral in our network carries both.",
  },
  {
    q: "Can I still get a rebate or tax credit?",
    a: "Mostly no, as of 2026. The federal 25C credit expired December 31, 2025, and California's single-family heat pump rebate funds are fully reserved with waitlists. If a program reopens for your ZIP, we flag it before you order.",
  },
  {
    q: "Does Summit install HVAC equipment?",
    a: "No. Summit supplies equipment and helps with guidance. Installation is handled by qualified local contractors.",
  },
  {
    q: "Where do you serve?",
    a: `Summit serves ${SITE.serviceArea}, with Newark will-call, Bay Area delivery coordination, and broader West Coast freight support.`,
  },
];

export default function HomePage() {
  const fromPrice = startingPrice();
  const sizerSkus: SizerSku[] = getStorefrontSkus().map((sku) => ({
    id: sku.id,
    sku: sku.sku,
    title: sku.title,
    btu: sku.btu,
    msrp: sku.msrp,
    seriesSlug: sku.seriesSlug,
    image: sku.image,
    available: sku.available,
    href: productHref(sku),
  }));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero — no decorative JPEG (Deloitte: +8.4% conversions per 0.1s of
          mobile speed). Left: the pitch. Right: a working sizer that returns
          in-stock SKUs — the #1 drop-off is buyers not knowing what to buy. */}
      <section className="border-b border-line bg-[var(--ink-panel)]">
        <Container className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-10 lg:py-14">
          <div className="rise">
            <h1 className="font-display text-[2.4rem] font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
              Heat pumps and mini splits at contractor pricing.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              TCL systems from ${fromPrice.toLocaleString()}, on the shelf in Newark.
              Buy it this morning, pick it up this afternoon, and have it installed
              by a C-20 licensed contractor we know — permit pulled, warranty intact.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/products" size="lg" data-conversion-hook="hero-shop-systems">
                Shop systems
                <ArrowRight size={18} />
              </LinkButton>
              <LinkButton
                href="/homeowners#homeowner-request"
                variant="secondary"
                size="lg"
                data-conversion-hook="hero-installer-help"
              >
                Find an installer
              </LinkButton>
            </div>
            <div className="mt-7 hidden max-w-2xl gap-3 text-sm text-white/82 md:grid md:grid-cols-3">
              <HeroProof text="Buy one system — no trade account." />
              <HeroProof text="C-20 licensed install, permit included." />
              <HeroProof text="Warranty stays intact — in writing." />
            </div>
          </div>
          <SystemSizer skus={sizerSkus} />
        </Container>
      </section>

      {/* Products before anything else — nobody scrolls a homepage to fill in a ZIP. */}
      <FeaturedSystems />

      <section className="border-b border-line bg-[var(--ink-panel)] text-white">
        <Container className="grid gap-px bg-white/10 p-0 sm:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 bg-[var(--ink-panel)] px-5 py-4 text-sm text-white/82">
              <span className="text-[oklch(0.78_0.08_55)]">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </Container>
      </section>

      {/* All-in pricing — 48% of abandonment is surprise costs, so publish the
          honest project total and let it stand next to a full-service quote. */}
      <section className="border-b border-line py-14 lg:py-16">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>What it actually costs</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
              The whole project, itemized — not just the box.
            </h2>
            <p className="mt-4 text-ink-2">
              A full-service replacement quote in the Bay Area routinely lands at
              $6,800 or more for a single-zone system. Here is the same project
              when you buy the equipment yourself. No line item is hidden —
              including the permit, which California now caps at roughly $150–$200
              for residential heat pumps.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/products">
                Price your system
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href="/homeowners#homeowner-request" variant="secondary">
                Get installer rates
              </LinkButton>
            </div>
          </div>
          <div className="rounded-(--r-lg) border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)] sm:p-7">
            <p className="text-sm font-semibold text-ink-1">
              Typical single-zone project, owner-supplied
            </p>
            <dl className="mt-4 flex flex-col divide-y divide-line text-sm">
              <CostRow label="TCL single-zone system (9k–18k BTU)" value="$859 – $1,449" />
              <CostRow label="Line set, pad, and mounting kit" value="$250 – $400" />
              <CostRow label="Licensed C-20 installation (flat rate)" value="$950 – $1,400" />
              <CostRow label="Permit + Title 24 / HERS paperwork" value="$150 – $350" />
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t-2 border-ink-1/10 pt-4">
              <span className="font-display text-base font-semibold text-ink-1">All-in total</span>
              <span className="tnum font-display text-2xl font-bold tracking-tight text-ink-1">
                $2,200 – $3,600
              </span>
            </div>
            <p className="mt-3 rounded-(--r-sm) bg-eco-tint/60 px-3 py-2 text-xs leading-relaxed text-eco-ink">
              Typical full-service quote for the same equipment: <strong>$6,800+</strong>.
              If your electrical panel is maxed out, budget $500–$2,500 extra — we
              flag that before you buy, not after.
            </p>
          </div>
        </Container>
      </section>

      {/* The three objections every visitor arrives with, answered loudly. */}
      <section className="py-14 lg:py-16">
        <Container>
          <SectionHead
            eyebrow="Why buying direct works"
            title="The questions contractors hope you never ask."
            sub="Buying your own equipment is exactly what full-service quotes are priced to prevent. Here is why it holds up."
          />
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {objections.map((item) => (
              <article
                key={item.title}
                className="rounded-(--r-md) border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)]"
              >
                <span className="grid size-11 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">
                  {item.icon}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink-1">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{item.body}</p>
              </article>
            ))}
          </div>

          {/* The brand objection gets its own answer — an unfamiliar name needs
              its credentials next to the certifications that back them. */}
          <div className="mt-10 rounded-(--r-lg) border border-line bg-surface-1 p-7 shadow-[var(--shadow-sm)] lg:p-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Eyebrow>Why TCL</Eyebrow>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-1 sm:text-3xl">
                  Not a mystery brand — one of the world&apos;s largest AC manufacturers.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                  TCL builds compressors and complete systems at OEM scale, and every
                  match-up we sell carries an AHRI-certified rating. Parts and
                  replacement units ship from our Newark warehouse, not overseas.
                </p>
                <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-4">
                  {whyTcl.map((stat) => (
                    <div key={stat.value}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="tnum font-display text-2xl font-semibold tracking-tight text-ink-1">
                          {stat.value}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-ink-3">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="lg:max-w-[340px]">
                <TrustBadges className="justify-start gap-x-5 gap-y-4" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface-1 py-14 lg:py-16">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHead
              align="left"
              eyebrow="Product discovery"
              title="Shop by job, not just model number."
              sub="Homeowners can start from use case. Contractors can still move straight to SKU, stock, documents, and quote workflow."
            />
            <LinkButton href="/products" variant="secondary" className="md:mb-1">
              View all products
              <ArrowRight size={16} />
            </LinkButton>
          </div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-(--r-md) border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryTile key={category.title} {...category} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <Eyebrow>Local proof</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
              Bay Area HVAC supply should feel local, specific, and practical.
            </h2>
            <p className="mt-4 text-ink-2">
              Summit operates from Newark for homeowners, contractors, and
              property teams across San Jose, Oakland, Fremont, San Francisco,
              the Peninsula, East Bay, South Bay, North Bay, and nearby cities.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_0.95fr] md:items-stretch">
            <div className="relative min-h-[250px] overflow-hidden rounded-(--r-md) border border-line bg-surface-2 shadow-[var(--shadow-sm)]">
              <Image
                src="/site/generated/bay-area-delivery-loading.jpg"
                alt="HVAC equipment pallet being prepared for Bay Area local delivery"
                fill
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-1/85 to-transparent p-5 text-white">
                <p className="font-display text-xl font-semibold">Loaded from Newark</p>
                <p className="mt-1 text-sm text-white/75">
                  Will-call, Bay Area delivery coordination, and freight support.
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <ProofStat icon={<Warehouse size={20} />} value="Newark" label="local supply hub" />
              <ProofStat icon={<Truck size={20} />} value="Bay Area" label="will-call and delivery coordination" />
              <ProofStat icon={<PackageCheck size={20} />} value="TCL" label="heat pumps and mini splits" />
            </div>
          </div>
        </Container>
      </section>

      {/* Demoted role routing — two compact cards instead of a four-card
          qualify-me funnel at the top of the page. */}
      <section className="border-y border-line bg-surface-1 py-14 lg:py-16">
        <Container>
          <SectionHead
            align="left"
            eyebrow="Who we serve"
            title="One system or a whole job — both doors are open."
          />
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <ServeCard
              icon={<Home size={22} />}
              title="Buying one system for your home"
              body="Shop at retail with no trade account, get sizing help by text, and let us connect you with a licensed installer before you spend a dollar."
              href="/homeowners#homeowner-request"
              cta="Start homeowner request"
            />
            <ServeCard
              icon={<HardHat size={22} />}
              title="Contractor or property team"
              body="SKU search, live Newark stock, AHRI references, submittal PDFs, net terms, and pro pricing after login. Will-call staged before you arrive."
              href="/dealers"
              cta="Open contractor account"
            />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {visualProofs.map((proof) => (
              <VisualProofCard key={proof.title} {...proof} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-[var(--ink-panel)] py-14 text-white lg:py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className="text-sm font-semibold tracking-tight text-[oklch(0.78_0.08_55)]">
              Homeowner path
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              What happens after you ask for help?
            </h2>
            <p className="mt-4 max-w-xl text-white/68">
              Summit does not install equipment. We help you understand the equipment
              lane and keep installation scope with qualified local contractors.
            </p>
            <div className="mt-7 grid gap-3">
              {howItWorks.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-(--r-sm) border border-white/10 bg-white/[0.04] p-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-ink-1">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-white/78">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <HomepageHomeownerMiniForm />
        </Container>
      </section>

      <section className="border-b border-line bg-surface-1 py-10">
        <Container className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-center">
          <div>
            <Eyebrow>Contractor counter</Eyebrow>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-1">
              Know the model? Move fast.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniProof icon={<Search size={18} />} title="SKU/model search" body="Use products for availability and specs." />
            <MiniProof icon={<FileBadge size={18} />} title="Stock and docs" body="AHRI, certifications, and job details." />
            <MiniProof icon={<BadgeCheck size={18} />} title="Pro pricing" body="Sign in for contractor account pricing." />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <LinkButton href="/dealers" size="lg">
              Open contractor account
            </LinkButton>
            <LinkButton href="/portal/login" variant="secondary" size="lg">
              Sign in for pro pricing
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* Honest rebate status — the federal 25C credit expired 12/31/2025 and
          CA single-family programs are waitlisted. With subsidies gone,
          equipment price is the only lever left — which is the whole pitch. */}
      <section className="border-b border-line bg-eco-tint/45 py-12">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-(--r-sm) bg-eco-tint text-eco-ink">
              <Leaf size={20} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
                The rebates are mostly gone. Equipment price is the lever left.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
                The federal 25C heat pump credit expired December 31, 2025, and
                California&apos;s {REBATES.map((rebate) => rebate.name).join(" and ")} single-family
                funds are fully reserved with waitlists. That makes what you pay for
                the equipment the biggest number you can still control — and we&apos;ll
                flag it immediately if a program reopens for your ZIP.
              </p>
            </div>
          </div>
          <LinkButton href="/resources" variant="secondary">
            Current program status
            <ArrowRight size={16} />
          </LinkButton>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <Eyebrow>Quick answers</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1">
                The stuff a retail buyer needs to know immediately.
              </h2>
              <p className="mt-4 text-ink-2">
                Clear answers beat vague inspiration for high-intent HVAC buyers.
              </p>
            </div>
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <article key={faq.q} className="rounded-(--r-md) border border-line bg-surface-1 p-5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink-1">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-14">
        <Container className="grid gap-6 rounded-(--r-lg) bg-[var(--ink-panel)] p-7 text-white md:grid-cols-[1fr_auto] md:items-center lg:p-9">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Buying one system or quoting a job?
            </h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Systems from ${fromPrice.toLocaleString()}, stocked in Newark, with
              installers and rebate paperwork handled. Start where it fits.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/products" size="lg">
              Shop systems
              <ArrowRight size={18} />
            </LinkButton>
            <LinkButton href="/homeowners#homeowner-request" variant="secondary" size="lg">
              Find an installer
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}

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

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-ink-2">{label}</dt>
      <dd className="tnum shrink-0 font-medium text-ink-1">{value}</dd>
    </div>
  );
}

function HeroProof({ text }: { text: string }) {
  return (
    <div className="flex gap-2 rounded-(--r-sm) border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-stock-ready" />
      <span className="leading-snug">{text}</span>
    </div>
  );
}

function ServeCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      data-conversion-hook="buyer-path-card"
      className="group flex flex-col rounded-(--r-md) border border-line bg-canvas p-6 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">
          {icon}
        </span>
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink-1">
          {title}
        </h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        {cta}
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function CategoryTile({
  title,
  bestFor,
  useCase,
  href,
}: {
  title: string;
  bestFor: string;
  useCase: string;
  href: string;
}) {
  return (
    <Link href={href} className="group bg-surface-1 p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink-1">{title}</h3>
        <ArrowRight size={17} className="mt-1 shrink-0 text-brand transition-transform group-hover:translate-x-0.5" />
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold text-ink-4">Best for</dt>
          <dd className="mt-1 leading-relaxed text-ink-2">{bestFor}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-ink-4">Starting use case</dt>
          <dd className="mt-1 leading-relaxed text-ink-2">{useCase}</dd>
        </div>
      </dl>
      <span className="mt-5 inline-flex items-center text-sm font-medium text-brand">
        View path
      </span>
    </Link>
  );
}

function VisualProofCard({
  src,
  alt,
  title,
  body,
}: {
  src: string;
  alt: string;
  title: string;
  body: string;
}) {
  return (
    <article className="overflow-hidden rounded-(--r-md) border border-line bg-surface-1 shadow-[var(--shadow-sm)]">
      <div className="relative aspect-[16/10] bg-surface-2">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold tracking-tight text-ink-1">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{body}</p>
      </div>
    </article>
  );
}

function ProofStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-(--r-md) border border-line bg-surface-1 p-5 shadow-[var(--shadow-sm)]">
      <span className="grid size-10 place-items-center rounded-(--r-sm) bg-copper-tint text-copper">
        {icon}
      </span>
      <p className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-1">
        {value}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">{label}</p>
    </div>
  );
}

function MiniProof({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-(--r-sm) border border-line bg-surface-2 p-4">
      <div className="flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        <h3 className="text-sm font-semibold text-ink-1">{title}</h3>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-3">{body}</p>
    </div>
  );
}
