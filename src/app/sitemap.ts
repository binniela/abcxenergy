import type { MetadataRoute } from "next";
import { SERIES } from "@/lib/products";
import { SITE } from "@/lib/site";
import { getStorefrontSkus, productHref } from "@/lib/storefront/catalog";
import { LOCAL_PAGES } from "@/lib/local-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/products", "/resources", "/homeowners", "/about", "/contact", "/dealers", "/quote", "/portal/login"];
  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.origin}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...SERIES.map((series) => ({
      url: `${SITE.origin}/products/${series.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
    ...LOCAL_PAGES.map((page) => ({
      url: `${SITE.origin}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...getStorefrontSkus().map((sku) => ({
      url: `${SITE.origin}${productHref(sku)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
