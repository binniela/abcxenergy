export type LocalPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  points: string[];
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

export const LOCAL_PAGES: LocalPage[] = [
  {
    slug: "bay-area-hvac-supply",
    title: "Bay Area HVAC Supply - Newark TCL Heat Pumps & Mini Splits",
    description:
      "Bay Area TCL HVAC supply from Newark, CA with homeowner equipment guidance, contractor will-call, local delivery coordination, and spec support.",
    eyebrow: "Bay Area HVAC supply",
    h1: "TCL heat pumps and mini splits supplied locally from Newark.",
    intro:
      "Summit supports Bay Area homeowners buying one system, property teams comparing equipment, and contractors who need stock, documents, and fast pickup.",
    points: [
      "Newark will-call hub for contractors and project teams.",
      "Homeowner-friendly equipment guidance before installer referral.",
      "Local delivery coordination for eligible Bay Area jobs.",
    ],
    primaryCta: "Buying one for your home?",
    primaryHref: "/homeowners",
    secondaryCta: "Contractor account",
    secondaryHref: "/dealers",
  },
  {
    slug: "bay-area-mini-split-supply",
    title: "Bay Area Mini Split Supply - TCL Ductless Systems",
    description:
      "Shop TCL mini splits for Bay Area homes, ADUs, additions, and contractor jobs with local supply from Newark, CA.",
    eyebrow: "Bay Area mini split supply",
    h1: "Mini split equipment help for Bay Area homes and job sites.",
    intro:
      "A single-room mini split, ADU, or multi-zone project should not require trade-counter vocabulary just to start. We help identify the likely equipment lane and connect installation questions to qualified contractors.",
    points: [
      "Good fit for ADUs, additions, bedrooms, offices, and spot comfort problems.",
      "Ask about one system without knowing the exact SKU.",
      "Contractors can still search models and documents directly.",
    ],
    primaryCta: "Find the right system",
    primaryHref: "/homeowners#homeowner-request",
    secondaryCta: "Shop systems",
    secondaryHref: "/products?category=ductless",
  },
  {
    slug: "bay-area-heat-pump-installer-help",
    title: "Bay Area Heat Pump Installer Help - TCL Equipment Guidance",
    description:
      "Need a Bay Area installer for a TCL heat pump or mini split? Summit supplies equipment and helps homeowners prepare for qualified contractor follow-up.",
    eyebrow: "Installer help",
    h1: "Need this installed? Start with the right equipment questions.",
    intro:
      "Summit does not install equipment. We help homeowners collect the details a Bay Area HVAC contractor needs to size, quote, and install the system correctly.",
    points: [
      "Share ZIP, rooms, ducts, timeline, and rebate interest.",
      "We help clarify equipment and document questions before purchase.",
      "A qualified installer confirms sizing, permits, labor, and startup.",
    ],
    primaryCta: "Get installer help",
    primaryHref: "/homeowners#homeowner-request",
    secondaryCta: "What homeowners should know",
    secondaryHref: "/homeowners",
  },
  {
    slug: "buy-one-mini-split-bay-area",
    title: "Buy One Mini Split in the Bay Area - TCL Equipment Help",
    description:
      "Buying one TCL mini split in the Bay Area? Summit helps retail buyers understand equipment, installation, rebates, and local availability.",
    eyebrow: "Buy one mini split",
    h1: "Yes, you can ask about one mini split.",
    intro:
      "This path is for homeowners and small property buyers who want one system and do not want to feel like they walked into the wrong wholesale counter.",
    points: [
      "No contractor account required to ask equipment questions.",
      "Professional installation is still required for real projects.",
      "We separate equipment supply from installation scope so expectations are clear.",
    ],
    primaryCta: "Ask about one unit",
    primaryHref: "/homeowners#homeowner-request",
    secondaryCta: "View mini splits",
    secondaryHref: "/products?category=ductless",
  },
  {
    slug: "bay-area-heat-pump-rebates",
    title: "Bay Area Heat Pump Rebates - 25C & TECH Clean California",
    description:
      "Learn what Bay Area heat pump buyers should ask about Federal 25C, TECH Clean California, AHRI matchups, and installer eligibility.",
    eyebrow: "Bay Area heat pump rebates",
    h1: "Ask rebate questions before you buy equipment.",
    intro:
      "Rebates can depend on equipment matchups, installer enrollment, project location, and documentation. Summit helps buyers know what to confirm with the installing contractor.",
    points: [
      "Federal 25C may apply to qualifying heat pumps.",
      "TECH Clean California details can vary by contractor and region.",
      "AHRI references and installation details should be checked before purchase.",
    ],
    primaryCta: "Get rebate-aware help",
    primaryHref: "/homeowners#homeowner-request",
    secondaryCta: "Spec resources",
    secondaryHref: "/resources",
  },
  {
    slug: "newark-hvac-will-call-contractors",
    title: "Newark HVAC Will-Call for Contractors - TCL Stock & Docs",
    description:
      "Contractors can use Summit HVAC Supply in Newark for TCL HVAC will-call, stock checks, spec sheets, quote support, and account pricing.",
    eyebrow: "Newark will-call",
    h1: "A contractor supply path from Newark, CA.",
    intro:
      "The public site is friendlier for homeowners, but the pro workflow stays direct: search SKUs, check stock, collect documents, and open an account for contractor pricing.",
    points: [
      "Newark will-call and Bay Area delivery coordination.",
      "SKU-level spec sheets and install manuals.",
      "Contractor account path for pro pricing and repeat buying.",
    ],
    primaryCta: "Open contractor account",
    primaryHref: "/dealers",
    secondaryCta: "Check SKU availability",
    secondaryHref: "/products",
  },
];

export function getLocalPage(slug: string) {
  return LOCAL_PAGES.find((page) => page.slug === slug);
}
