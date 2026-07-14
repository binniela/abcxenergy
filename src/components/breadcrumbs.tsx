import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";

export type Crumb = { label: string; href: string };

/**
 * Visible breadcrumb trail + BreadcrumbList JSON-LD (one source, no drift).
 * The last crumb is the current page and is not linked.
 */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE.origin}${item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-3">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span className="max-w-[60vw] truncate font-medium text-ink-2" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="whitespace-nowrap hover:text-brand">
                    {item.label}
                  </Link>
                  <ChevronRight size={14} className="shrink-0 text-ink-4" aria-hidden />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
