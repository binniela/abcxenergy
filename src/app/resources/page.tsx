import type { Metadata } from "next";
import Link from "next/link";
import { FileText, BookOpen, Leaf, ArrowRight, ExternalLink } from "lucide-react";
import { Container, Eyebrow, Chip } from "@/components/ui";
import { SERIES } from "@/lib/products";
import { REBATES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources - Spec Sheets, Install Manuals & Rebate Guides",
  description:
    "Request TCL HVAC spec sheets and install manuals, and get rebate guidance: Federal 25C (up to $2,000) and TECH Clean California.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface-1">
        <Container className="py-12 lg:py-14">
          <Eyebrow>Resources</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
            Everything you need to spec, install, and close the rebate.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-2">
            Spec sheets, install manuals, and current rebate guidance in one place,
            so you spend less time hunting for documents and more time on the roof.
          </p>
        </Container>
      </section>

      {/* Rebates */}
      <Container className="py-12 lg:py-14">
        <div className="flex items-center gap-2">
          <Leaf size={18} className="text-eco" />
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
            Rebate &amp; incentive guides
          </h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ink-2">
          Help your customers buy on total cost with current program guidance and support for project-specific eligibility.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {REBATES.map((r) => (
            <div key={r.name} className="rounded-[--r-md] border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-[--r-md] bg-eco-tint text-eco-ink">
                  <Leaf size={20} strokeWidth={2.2} />
                </span>
                {r.confirm && <Chip tone="copper">Project guidance</Chip>}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink-1">
                {r.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{r.detail}</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover"
              >
                Request guidance <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </Container>

      {/* Document library */}
      <Container className="pb-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-1">
          Spec sheets &amp; install manuals
        </h2>
        <p className="mt-2 text-sm text-ink-3">
          Request the exact support documents for the series you are quoting.
        </p>
        <div className="mt-6 overflow-hidden rounded-[--r-md] border border-line">
          {SERIES.map((s, i) => (
            <div
              key={s.slug}
              className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                i % 2 === 0 ? "bg-surface-1" : "bg-surface-2/50"
              } ${i > 0 ? "border-t border-line" : ""}`}
            >
              <div>
                <Link href={`/products/${s.slug}`} className="font-display text-base font-semibold text-ink-1 hover:text-brand">
                  {s.name}
                </Link>
                <span className="ml-2 font-mono text-xs text-ink-3">{s.family}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <DocChip icon={<FileText size={14} />} label="Request spec sheet" />
                <DocChip icon={<BookOpen size={14} />} label="Request install manual" />
              </div>
            </div>
          ))}
        </div>

        {/* SEO/help cross-links */}
        <div className="mt-10 rounded-[--r-md] border border-line bg-surface-2/50 p-6">
          <h3 className="font-display text-lg font-semibold text-ink-1">Need help choosing?</h3>
          <p className="mt-1.5 max-w-xl text-sm text-ink-2">
            Not sure which series fits a job? Filter the lineup by capacity and
            efficiency, or send us the details and we&apos;ll spec it for you.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover">
              Browse products <ArrowRight size={15} />
            </Link>
            <a href={SITE.ahriDirectory} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-brand">
              AHRI Directory <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}

function DocChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Link
      href="/contact"
      className="inline-flex items-center gap-1.5 rounded-[--r-sm] border border-line bg-surface-1 px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:border-ink-4 hover:text-ink-1"
    >
      {icon}
      {label}
      <ArrowRight size={13} className="text-ink-4" />
    </Link>
  );
}
