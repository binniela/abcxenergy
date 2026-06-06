import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" width={34} height={34} className="size-8 object-contain" />
              <span className="font-display text-base font-semibold text-white">
                ABC X-Energy
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              {SITE.brandLine}. Contractor pricing, deep West Coast stock, and
              spec/rebate support — so you bid faster and reorder in one tap.
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
            <FooterLink href="/dealers">Become a Dealer</FooterLink>
            <FooterLink href="/portal/login">Wholesale Portal</FooterLink>
          </FooterCol>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              For contractors
            </h3>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/quote"
                className="flex h-11 items-center justify-center rounded-[--r-sm] bg-white text-sm font-semibold text-[var(--ink-panel)] transition-opacity hover:opacity-90"
              >
                Get a Quote
              </Link>
              <Link
                href="/dealers"
                className="flex h-11 items-center justify-center rounded-[--r-sm] border border-white/20 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Request Wholesale Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ABC X-Energy. Authorized TCL HVAC wholesale distributor.</p>
          <p className="text-white/35">
            Contractor pricing, stock, and spec support for West Coast HVAC pros.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
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
