import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Truck, ShieldCheck, Users } from "lucide-react";
import { Container, Eyebrow, LinkButton } from "@/components/ui";
import { TrustBadges } from "@/components/trust-badges";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — Wholesale TCL HVAC Distributor in Newark, CA",
  description:
    "ABC X-Energy is an authorized wholesale distributor of TCL HVAC systems, based in Newark, CA, serving contractors across the West Coast.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>About ABC X-Energy</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
              A West Coast distributor built for the people who install the systems.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              We&apos;re an authorized wholesale distributor of TCL HVAC systems based
              in Newark, California. Our job is simple: keep the units contractors
              need in stock, price them so there&apos;s real margin on the bid, and back
              them with the spec sheets and rebate help that close the sale.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/dealers">Request a wholesale account</LinkButton>
              <LinkButton href="/contact" variant="secondary">Contact us</LinkButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[--r-lg] shadow-[var(--shadow-md)]">
            <Image
              src="/site/warehouse-fulfillment.png"
              alt="Organized HVAC warehouse fulfillment area with stocked equipment"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Values */}
      <Container className="py-16">
        <div className="grid gap-px overflow-hidden rounded-[--r-md] border border-line bg-line md:grid-cols-3">
          <Pillar
            icon={<Truck size={20} />}
            title="Stock, locally"
            body="Core TCL SKUs stocked deep in Newark and shipped same-day across five states — not trucked in from across the country."
          />
          <Pillar
            icon={<ShieldCheck size={20} />}
            title="Backed by the cert"
            body="AHRI-certified equipment and ENERGY STAR models, with warranty support and clear spec data on every product."
          />
          <Pillar
            icon={<Users size={20} />}
            title="Contractor-first"
            body="Real people who know HVAC answer the phone. We help you spec the job and find the rebate — then make reordering effortless."
          />
        </div>
      </Container>

      {/* NAP */}
      <section className="border-y border-line bg-surface-1 py-14">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
              Visit or reach us
            </h2>
            <dl className="mt-5 space-y-4 text-[15px]">
              <NapRow icon={<MapPin size={18} />} label="Warehouse & will-call">
                {SITE.address.full}
              </NapRow>
              <NapRow icon={<Phone size={18} />} label="Phone">
                <a href={SITE.phoneHref} className="text-brand hover:text-brand-hover">{SITE.phone}</a>
              </NapRow>
              <NapRow icon={<Mail size={18} />} label="Email">
                <a href={SITE.emailHref} className="text-brand hover:text-brand-hover">{SITE.email}</a>
              </NapRow>
              <NapRow icon={<Clock size={18} />} label="Hours">
                {SITE.hours}
              </NapRow>
            </dl>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-[--r-lg] border border-line bg-surface-2 p-6">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,var(--line)_25px,transparent_26px),linear-gradient(0deg,transparent_24px,var(--line)_25px,transparent_26px)] bg-[length:52px_52px] opacity-45" />
            <div className="relative flex h-full min-h-[212px] flex-col justify-between">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-1 px-3 py-1.5 text-sm font-medium text-ink-1 shadow-[var(--shadow-sm)]">
                <MapPin size={15} className="text-brand" />
                Newark, CA warehouse
              </span>
              <div className="w-fit rounded-[--r-md] border border-line bg-surface-1 p-4 shadow-[var(--shadow-md)]">
                <p className="font-display text-lg font-semibold text-ink-1">{SITE.address.city}, {SITE.address.state}</p>
                <p className="mt-1 max-w-[260px] text-sm leading-relaxed text-ink-2">{SITE.address.full}</p>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
                  Will-call · freight · West Coast service
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <TrustBadges />
      </Container>
    </>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-surface-1 p-7">
      <span className="grid size-11 place-items-center rounded-[--r-md] bg-copper-tint text-copper">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink-1">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
    </div>
  );
}

function NapRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[--r-sm] bg-surface-2 text-ink-3">
        {icon}
      </span>
      <div>
        <dt className="font-mono text-xs uppercase tracking-wider text-ink-3">{label}</dt>
        <dd className="mt-0.5 text-ink-1">{children}</dd>
      </div>
    </div>
  );
}
