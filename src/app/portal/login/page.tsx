import Link from "next/link";
import * as React from "react";
import {
  Lock,
  Tag,
  History,
  RefreshCw,
  Boxes,
  FileText,
  ShieldAlert,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Container, Chip, LinkButton } from "@/components/ui";
import { SITE } from "@/lib/site";

const PORTAL_FEATURES = [
  { icon: Tag, label: "Account-specific pricing" },
  { icon: History, label: "Order history" },
  { icon: RefreshCw, label: "One-click reorder" },
  { icon: Boxes, label: "Real-time inventory" },
  { icon: FileText, label: "Invoices & statements" },
  { icon: ShieldAlert, label: "Warranty claims" },
] as const;

export default function PortalLoginPage() {
  return (
    <Container className="py-14 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Early access card */}
        <div className="mx-auto w-full max-w-sm">
          <div className="inline-flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-[--r-md] bg-brand-tint text-brand">
              <Lock size={20} />
            </span>
            <Chip tone="copper">Early access</Chip>
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink-1">
            Wholesale portal
          </h1>
          <p className="mt-2 text-ink-2">
            Account pricing, order history, reorder tools, invoices, and support cases for approved wholesale customers.
          </p>

          <div className="mt-7 rounded-[--r-md] border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)]">
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
              Open a demo workspace
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              Choose a seeded role to review the backend flows: staff operations,
              dealer account management, installer jobs, or homeowner referral.
            </p>
            <LinkButton href="/portal" size="lg" className="mt-5 w-full">
              View portal workspaces
              <ArrowRight size={18} />
            </LinkButton>
            <Link
              href="/admin"
              className="mt-3 flex justify-center text-sm font-medium text-brand hover:text-brand-hover"
            >
              Open staff operations dashboard
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-ink-4">
            Account questions? Call{" "}
            <a href={SITE.phoneHref} className="text-ink-2">{SITE.phone}</a>
          </p>
        </div>

        {/* What's inside */}
        <div className="rounded-[--r-lg] border border-line bg-surface-2/50 p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">
            What dealers will get inside
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PORTAL_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-[--r-md] border border-line bg-surface-1 px-4 py-3.5"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-[--r-sm] bg-brand-tint text-brand">
                    <Icon size={17} />
                  </span>
                  <span className="text-sm font-medium text-ink-1">{f.label}</span>
                </div>
              );
            })}
          </div>
          <Link
            href="/portal/dealer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
          >
            Open seeded dealer account
            <ArrowRight size={15} />
          </Link>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <MiniPortal href="/admin" icon={<LayoutDashboard size={15} />} label="Staff" />
            <MiniPortal href="/portal/installer" icon={<RefreshCw size={15} />} label="Installer" />
            <MiniPortal href="/portal/homeowner" icon={<ShieldAlert size={15} />} label="Homeowner" />
          </div>
        </div>
      </div>
    </Container>
  );
}

function MiniPortal({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-1.5 rounded-[--r-sm] border border-line bg-surface-1 px-3 py-2 text-xs font-medium text-ink-2 transition-colors hover:border-ink-4 hover:text-ink-1"
    >
      {icon}
      {label}
    </Link>
  );
}
