"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, Lock } from "lucide-react";
import * as React from "react";
import { useQuote } from "./quote-context";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/resources", label: "Resources" },
  { href: "/dealers", label: "Become a Dealer" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="ABC X-Energy home">
      {/* Plain img tags to static assets — reliable, no optimizer indirection */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" width={48} height={48} className="size-12 shrink-0 object-contain" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wordmark.png"
        alt="ABC X-Energy"
        width={150}
        height={53}
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
}

function QuoteButton() {
  const { count, toggle } = useQuote();
  return (
    <button
      onClick={toggle}
      className="relative inline-flex h-10 items-center gap-2 rounded-[--r-sm] border border-line-strong bg-surface-1 px-3.5 text-sm font-medium text-ink-1 shadow-[var(--shadow-sm)] transition-colors hover:bg-surface-2"
    >
      <FileText size={16} strokeWidth={2.2} />
      Quote
      {count > 0 && (
        <span className="tnum grid min-w-5 place-items-center rounded-full bg-brand px-1 font-mono text-[11px] font-bold text-brand-ink">
          {count}
        </span>
      )}
    </button>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      {/* Brand flame echo — green → orange → red */}
      <div className="h-[3px] w-full" style={{ background: "var(--energy-gradient)" }} />
      <nav className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Wordmark />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-[--r-sm] px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-brand" : "text-ink-2 hover:bg-surface-2 hover:text-ink-1"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            className="hidden items-center gap-1.5 rounded-[--r-sm] px-2.5 py-2 text-sm font-medium text-ink-2 hover:text-ink-1 sm:inline-flex"
          >
            <Lock size={14} strokeWidth={2.2} />
            Portal
          </Link>
          <QuoteButton />
          <Link
            href="/quote"
            className="hidden h-10 items-center rounded-[--r-sm] bg-brand px-4 text-sm font-medium text-brand-ink shadow-[var(--shadow-sm)] transition-colors hover:bg-brand-hover sm:inline-flex"
          >
            Get a Quote
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="grid size-10 place-items-center rounded-[--r-sm] text-ink-1 hover:bg-surface-2 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="border-t border-line bg-canvas lg:hidden">
          <ul className="mx-auto flex w-full max-w-[1180px] flex-col px-4 py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMobile}
                  className="block rounded-[--r-sm] px-3 py-3 text-[15px] font-medium text-ink-1 hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <Link
                href="/quote"
                onClick={closeMobile}
                className="flex h-11 items-center justify-center rounded-[--r-sm] bg-brand text-sm font-medium text-brand-ink"
              >
                Get a Quote
              </Link>
              <Link
                href="/portal"
                onClick={closeMobile}
                className="flex h-11 items-center justify-center rounded-[--r-sm] border border-line-strong bg-surface-1 text-sm font-medium text-ink-1"
              >
                Portal
              </Link>
              <a
                href={SITE.phoneHref}
                className="col-span-2 flex h-11 items-center justify-center rounded-[--r-sm] bg-surface-2 text-sm font-medium text-ink-1"
              >
                Call {SITE.phone}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
