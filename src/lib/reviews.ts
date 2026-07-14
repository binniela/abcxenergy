/**
 * Product reviews registry.
 *
 * IMPORTANT — populate ONLY with real, consented customer reviews. Keyed by
 * SKU id first, then by series slug as a fallback so a review can apply to a
 * whole series. While a product has no real reviews it shows a "no reviews yet"
 * state and emits NO AggregateRating: fabricated ratings violate FTC endorsement
 * rules and Google's review-snippet policy, and risk manual action. Add genuine
 * reviews here and the star summary + Product/AggregateRating schema activate
 * automatically.
 *
 * Example entry:
 *   "sku-brz-09": [
 *     { author: "Marcos R.", role: "Installer", rating: 5, date: "2026-05-02",
 *       location: "Fremont, CA", verified: true,
 *       title: "Quiet and quick to commission",
 *       body: "Paired cleanly, refrigerant charge was spot on…" },
 *   ],
 */

export type Review = {
  author: string;
  role?: string;
  rating: number; // 1–5
  title?: string;
  body: string;
  date: string; // ISO
  location?: string;
  verified?: boolean;
};

export const REVIEWS: Record<string, Review[]> = {};

export function getReviews(skuId: string, seriesSlug: string): Review[] {
  return REVIEWS[skuId] ?? REVIEWS[seriesSlug] ?? [];
}

export type ReviewSummary = { count: number; average: number };

export function reviewSummary(reviews: Review[]): ReviewSummary | null {
  if (reviews.length === 0) return null;
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { count: reviews.length, average: Math.round(average * 10) / 10 };
}
