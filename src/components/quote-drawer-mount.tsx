"use client";

import dynamic from "next/dynamic";
import { useQuote } from "./quote-context";

const LazyQuoteDrawer = dynamic(() => import("./quote-drawer").then((mod) => mod.QuoteDrawer), {
  ssr: false,
});

export function QuoteDrawerMount() {
  const { count, isOpen } = useQuote();
  const shouldLoad = isOpen || count > 0;

  return shouldLoad ? <LazyQuoteDrawer /> : null;
}
