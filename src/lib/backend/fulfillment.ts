/**
 * Local-fulfillment domain logic. Pure functions + the Bay Area zone table,
 * usable on the server (checkout) and client (ZIP gate, badges) and in seeded
 * mode with no database. The DB `delivery_zones` table mirrors ZONES and is the
 * authoritative fee source when Supabase is configured.
 */

export type FulfillmentMethod = "pickup" | "local_delivery" | "freight";

export type DeliveryZone = {
  zip: string;
  label: string;
  localDeliveryEligible: boolean;
  deliveryFee: number;
  freeDeliveryOver: number;
  leadTimeHours: number;
};

export const WAREHOUSE = {
  id: "50000000-0000-0000-0000-000000000001",
  name: "Newark Fulfillment Center",
  city: "Newark, CA",
};

/** Bay Area zones served from Newark. Mirrors supabase/seed.sql delivery_zones. */
export const ZONES: DeliveryZone[] = [
  { zip: "94560", label: "Newark", localDeliveryEligible: true, deliveryFee: 0, freeDeliveryOver: 0, leadTimeHours: 4 },
  { zip: "94538", label: "Fremont", localDeliveryEligible: true, deliveryFee: 35, freeDeliveryOver: 2000, leadTimeHours: 8 },
  { zip: "94587", label: "Union City", localDeliveryEligible: true, deliveryFee: 35, freeDeliveryOver: 2000, leadTimeHours: 8 },
  { zip: "94544", label: "Hayward", localDeliveryEligible: true, deliveryFee: 45, freeDeliveryOver: 2000, leadTimeHours: 24 },
  { zip: "94601", label: "Oakland", localDeliveryEligible: true, deliveryFee: 55, freeDeliveryOver: 2500, leadTimeHours: 24 },
  { zip: "95131", label: "San Jose", localDeliveryEligible: true, deliveryFee: 55, freeDeliveryOver: 2500, leadTimeHours: 24 },
  { zip: "94103", label: "San Francisco", localDeliveryEligible: true, deliveryFee: 75, freeDeliveryOver: 3000, leadTimeHours: 24 },
  { zip: "94303", label: "Palo Alto", localDeliveryEligible: true, deliveryFee: 65, freeDeliveryOver: 3000, leadTimeHours: 24 },
];

export function resolveZone(zip: string | null | undefined): DeliveryZone | null {
  if (!zip) return null;
  const z = zip.trim().slice(0, 5);
  return ZONES.find((zone) => zone.zip === z) ?? null;
}

export type FulfillmentOption = {
  method: FulfillmentMethod;
  label: string;
  detail: string;
  fee: number;
  available: boolean;
  /** Why an option is unavailable, for the UI. */
  note?: string;
};

/** The fee for local delivery, honoring the zone's free-over threshold. */
export function localDeliveryFee(zone: DeliveryZone, subtotal: number): number {
  if (!zone.localDeliveryEligible) return 0;
  if (zone.freeDeliveryOver > 0 && subtotal >= zone.freeDeliveryOver) return 0;
  return zone.deliveryFee;
}

/**
 * The fulfillment options to show for a given ZIP + cart subtotal. Pickup is
 * always available (drive to Newark); local delivery only inside a served zone;
 * freight is the fallback for everyone (cost quoted separately).
 */
export function fulfillmentOptions(zip: string | null, subtotal: number): FulfillmentOption[] {
  const zone = resolveZone(zip);
  const pickup: FulfillmentOption = {
    method: "pickup",
    label: "Will-call pickup",
    detail: `Free. Ready same day at ${WAREHOUSE.city}.`,
    fee: 0,
    available: true,
  };
  const delivery: FulfillmentOption = zone?.localDeliveryEligible
    ? {
        method: "local_delivery",
        label: "Local jobsite delivery",
        detail:
          localDeliveryFee(zone, subtotal) === 0
            ? `Free to ${zone.label}. Within ${zone.leadTimeHours}h.`
            : `$${localDeliveryFee(zone, subtotal)} to ${zone.label}. Within ${zone.leadTimeHours}h${
                zone.freeDeliveryOver > 0 ? `, free over $${zone.freeDeliveryOver.toLocaleString()}` : ""
              }.`,
        fee: localDeliveryFee(zone, subtotal),
        available: true,
      }
    : {
        method: "local_delivery",
        label: "Local jobsite delivery",
        detail: "Not available for this ZIP.",
        fee: 0,
        available: false,
        note: zip ? "Outside our Bay Area delivery radius" : "Enter a ZIP to check",
      };
  const freight: FulfillmentOption = {
    method: "freight",
    label: "Freight (LTL)",
    detail: "Curbside freight anywhere. Cost quoted after order.",
    fee: 0,
    available: true,
    note: "Freight cost billed at actual carrier rate",
  };
  return [pickup, delivery, freight];
}

/** A short stock/fulfillment promise for a product, given the visitor's ZIP. */
export function fulfillmentPromise(zip: string | null, inStock: boolean): string {
  if (!inStock) return "Backorder";
  const zone = resolveZone(zip);
  if (!zip) return "In stock, pickup today";
  if (zone?.localDeliveryEligible) {
    return zone.leadTimeHours <= 8
      ? `In stock, delivery to ${zone.label} today`
      : `In stock, delivery to ${zone.label} tomorrow`;
  }
  return "In stock, pickup today or freight";
}

/** Next handful of pickup/delivery windows for the slot picker. */
export function fulfillmentWindows(method: FulfillmentMethod, zip: string | null): string[] {
  const zone = resolveZone(zip);
  const sameDayOk = method === "pickup" || (zone ? zone.leadTimeHours <= 8 : false);
  const days = ["today", "tomorrow", "in 2 days"];
  const slots = ["7:00-9:00 AM", "9:00-11:00 AM", "12:00-2:00 PM", "2:00-4:00 PM"];
  const out: string[] = [];
  const startDay = sameDayOk ? 0 : 1;
  for (let d = startDay; d < days.length; d++) {
    for (const s of slots) out.push(`${capitalize(days[d])}, ${s}`);
  }
  return out.slice(0, 8);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const FULFILLMENT_LABEL: Record<FulfillmentMethod, string> = {
  pickup: "Pickup",
  local_delivery: "Local delivery",
  freight: "Freight",
};

export const FULFILLMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  ready_for_pickup: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  picked_up: "Picked up",
  cancelled: "Cancelled",
};
