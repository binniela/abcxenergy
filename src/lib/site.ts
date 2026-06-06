// Real business facts — single source of truth. No placeholder social links anywhere.
export const SITE = {
  name: "ABC X-Energy",
  legalName: "ABC X-Energy",
  tagline: "Wholesale TCL HVAC for West Coast contractors",
  brandLine: "Authorized TCL HVAC wholesale distributor",
  address: {
    street: "5437 Central Ave., Suite 10",
    city: "Newark",
    state: "CA",
    zip: "94560",
    full: "5437 Central Ave., Suite 10, Newark, CA 94560",
  },
  phone: "(415) 988-4445",
  phoneHref: "tel:+14159884445",
  email: "info@abcxenergy.com",
  emailHref: "mailto:info@abcxenergy.com",
  hours: "Mon–Fri 7:00a–5:00p PT · Will-call & freight",
  serviceArea: "California, Oregon, Washington, Nevada & Arizona",
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
    detail: "Heat pump incentives for California installs — amounts vary by contractor enrollment & region.",
    confirm: true,
  },
] as const;
