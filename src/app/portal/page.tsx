import Link from "next/link";
import { ArrowRight, HardHat, Home, ShieldCheck, Store } from "lucide-react";
import { Container, Chip } from "@/components/ui";

const PORTALS = [
  {
    href: "/admin",
    title: "Staff operations",
    label: "Internal",
    body: "Inventory, quotes, orders, invoices, purchasing, receiving, cases, and reports.",
    icon: ShieldCheck,
  },
  {
    href: "/portal/dealer",
    title: "Dealer portal",
    label: "Wholesale",
    body: "Account pricing, quote history, reorder, invoices, balances, and support cases.",
    icon: Store,
  },
  {
    href: "/portal/installer",
    title: "Installer workspace",
    label: "Jobs",
    body: "Job-based product lists, document requests, warranty claims, and rebate packets.",
    icon: HardHat,
  },
  {
    href: "/portal/homeowner",
    title: "Homeowner referral",
    label: "Referral",
    body: "Installer match status, contact history, and recommended efficient systems.",
    icon: Home,
  },
] as const;

export const metadata = {
  title: "Account Portal - Summit HVAC Supply",
};

export default function PortalPage() {
  return (
    <Container className="py-12 lg:py-16">
      <Chip tone="copper">Role-based account access</Chip>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
        Choose a portal workspace.
      </h1>
      <p className="mt-3 max-w-2xl text-ink-2">
        Each workspace is powered by the same wholesale operations data model, with views scoped to the selected role.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PORTALS.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link
              key={portal.href}
              href={portal.href}
              className="group rounded-[--r-md] border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-[--r-md] bg-brand-tint text-brand">
                  <Icon size={20} />
                </span>
                <Chip tone="neutral">{portal.label}</Chip>
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink-1">
                {portal.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{portal.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                Open workspace
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
