import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { SITE } from "@/lib/site";
import { SERIES } from "@/lib/products";

/* Deep brand-ink panel — grounds the page and carries the real NAP.
   No placeholder social links (explicit project constraint). */
export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[var(--ink-panel)] text-[oklch(0.92_0.01_257)]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Identity + NAP */}
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo-summit.svg" alt="" width={34} height={34} sizes="34px" className="size-8 object-contain" />
              <span className="font-display text-base font-semibold text-white">
                Summit HVAC Supply
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              {SITE.brandLine}. One-system homeowner help, Bay Area installer
              referral, and fast contractor supply from our Newark hub.
            </p>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5 text-white/70">
                <MapPin size={16} className="mt-0.5 shrink-0 text-white/40" />
                <span>{SITE.address.full}</span>
              </div>
              <a href={SITE.phoneHref} className="flex items-center gap-2.5 text-white/70 hover:text-white">
                <Phone size={16} className="shrink-0 text-white/40" />
                {SITE.phone}
              </a>
              <a href={SITE.smsHref} className="flex items-center gap-2.5 text-white/70 hover:text-white">
                <MessageSquare size={16} className="shrink-0 text-white/40" />
                Text us — fastest during business hours
              </a>
              <a href={SITE.emailHref} className="flex items-center gap-2.5 text-white/70 hover:text-white">
                <Mail size={16} className="shrink-0 text-white/40" />
                {SITE.email}
              </a>
              <div className="flex items-start gap-2.5 text-white/70">
                <Clock size={16} className="mt-0.5 shrink-0 text-white/40" />
                <span>{SITE.hours}</span>
              </div>
            </dl>
          </div>

          <FooterCol title="Products">
            {SERIES.map((s) => (
              <FooterLink key={s.slug} href={`/products/${s.slug}`}>
                {s.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/resources">Resources</FooterLink>
            <FooterLink href="/homeowners">For Homeowners</FooterLink>
            <FooterLink href="/dealers">For Contractors</FooterLink>
            <FooterLink href="/portal/login">Account Portal</FooterLink>
          </FooterCol>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
              Start here
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/homeowners"
                className="flex h-11 items-center justify-center rounded-(--r-sm) bg-white text-sm font-semibold text-[var(--ink-panel)] transition-opacity hover:opacity-90"
              >
                Buying one for your home?
              </Link>
              <Link
                href="/dealers"
                className="flex h-11 items-center justify-center rounded-(--r-sm) border border-white/20 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Open Contractor Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Summit HVAC Supply. Bay Area TCL HVAC supply from Newark, CA.</p>
          <p className="text-white/70">
            Equipment supply only. Installation is handled by qualified local contractors.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/65 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
