// Real business facts — single source of truth. No placeholder social links anywhere.
export const SITE = {
  name: "Summit HVAC Supply",
  legalName: "Summit HVAC Supply",
  origin: "https://www.summithvacsupply.com",
  tagline: "Bay Area TCL heat pumps and mini splits, supplied locally",
  brandLine: "Bay Area TCL HVAC supply from Newark, CA",
  address: {
    street: "5437 Central Ave., Suite 10",
    city: "Newark",
    state: "CA",
    zip: "94560",
    full: "5437 Central Ave., Suite 10, Newark, CA 94560",
  },
  phone: "(415) 988-4445",
  phoneHref: "tel:+14159884445",
  email: "info@summithvacsupply.com",
  emailHref: "mailto:info@summithvacsupply.com",
  hours: "Mon-Fri 7:00a-5:00p PT · Newark will-call, Bay Area delivery & freight",
  serviceArea: "San Jose, Oakland, Fremont, San Francisco, the Peninsula, East Bay, South Bay, North Bay & nearby Bay Area cities",
  broaderServiceArea: "California, Oregon, Washington, Nevada & Arizona",
  ahriDirectory: "https://www.ahridirectory.org/",
  energyStar: "https://www.energystar.gov/",
} as const;

// Rebate programs surfaced in Resources — real programs, figures depend on each project.
export const REBATES = [
  {
    name: "Federal 25C Tax Credit",
    detail: "Up to $2,000 for qualifying heat pumps (Energy Efficient Home Improvement Credit).",
    confirm: false,
  },
  {
    name: "TECH Clean California",
    detail: "Heat pump incentives for California installs. Amounts vary by contractor enrollment and region.",
    confirm: true,
  },
] as const;
