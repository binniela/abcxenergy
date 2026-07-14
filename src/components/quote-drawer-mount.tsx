"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { useQuote } from "./quote-context";

const LazyQuoteDrawer = dynamic(() => import("./quote-drawer").then((mod) => mod.QuoteDrawer), {
  ssr: false,
});

export function QuoteDrawerMount() {
  const { count, isOpen } = useQuote();
  // `count` is restored from localStorage on the client only, so defer the
  // decision to load the drawer until after mount to avoid a hydration
  // mismatch (server renders nothing, client would render the lazy drawer).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const shouldLoad = mounted && (isOpen || count > 0);

  return shouldLoad ? <LazyQuoteDrawer /> : null;
}
