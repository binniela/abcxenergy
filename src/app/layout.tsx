import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QuoteProvider } from "@/components/quote-context";
import { QuoteDrawer } from "@/components/quote-drawer";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site";

// Body: Inter — neutral, legible at small sizes for spec-dense pages.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Display: Space Grotesk — engineered weight & tight tracking, gives the
// flagship a confident, instrument-panel presence without going cold.
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
// Data: JetBrains Mono — tabular figures so spec rails and tables align.
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.abcxenergy.com"),
  title: {
    default: "ABC X-Energy — Wholesale TCL HVAC for West Coast Contractors",
    template: "%s · ABC X-Energy",
  },
  description:
    "Wholesale TCL HVAC systems — in stock and shipped fast across the West Coast. AHRI-certified, contractor pricing, spec sheets, and rebate support.",
  keywords: [
    "TCL HVAC wholesale",
    "wholesale heat pumps",
    "contractor HVAC distributor",
    "mini split wholesale California",
  ],
  openGraph: {
    title: "ABC X-Energy — Wholesale TCL HVAC",
    description:
      "In-stock TCL HVAC, contractor pricing, fast West Coast fulfillment. AHRI-certified.",
    type: "website",
    siteName: SITE.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[--r-sm] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-brand-ink"
        >
          Skip to content
        </a>
        <QuoteProvider>
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
          <QuoteDrawer />
        </QuoteProvider>
      </body>
    </html>
  );
}
