import { Store, Truck, PackageCheck } from "lucide-react";
import { Container, Chip } from "@/components/ui";
import { createServerSupabase } from "@/lib/backend/supabase-ssr";
import { FulfillmentAdvance } from "@/components/fulfillment-advance";
import {
  FULFILLMENT_STATUS_LABEL,
  type FulfillmentMethod,
} from "@/lib/backend/fulfillment";

export const metadata = { title: "Fulfillment Queue" };

type OrderRow = {
  id: string;
  order_number: string;
  fulfillment_method: FulfillmentMethod | null;
  fulfillment_status: string;
  fulfillment_window: string | null;
  delivery_zip: string | null;
  delivery_address: string | null;
  buyer_name: string | null;
  total: number;
  paid: boolean;
};

const METHOD_META: Record<FulfillmentMethod, { label: string; icon: React.ReactNode }> = {
  pickup: { label: "Will-call pickup", icon: <Store size={16} /> },
  local_delivery: { label: "Local delivery", icon: <Truck size={16} /> },
  freight: { label: "Freight", icon: <PackageCheck size={16} /> },
};

function currency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default async function FulfillmentQueuePage() {
  const supabase = await createServerSupabase();
  let orders: OrderRow[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("sales_orders")
      .select(
        "id, order_number, fulfillment_method, fulfillment_status, fulfillment_window, delivery_zip, delivery_address, buyer_name, total, paid"
      )
      .not("fulfillment_method", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);
    orders = (data as OrderRow[]) ?? [];
  }

  const methods: FulfillmentMethod[] = ["pickup", "local_delivery", "freight"];

  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
        Fulfillment queue
      </h1>
      <p className="mt-2 max-w-2xl text-ink-2">
        Pickup, delivery, and freight orders from the storefront. Advance each one
        as you stage, hand off, or deliver it.
      </p>

      {!supabase && (
        <div className="mt-8 rounded-(--r-md) border border-dashed border-line-strong bg-surface-2/40 p-10 text-center text-ink-2">
          Connect Supabase to see live checkout orders here. In seeded mode there
          are no storefront orders to fulfill yet.
        </div>
      )}

      {supabase && orders.length === 0 && (
        <div className="mt-8 rounded-(--r-md) border border-dashed border-line-strong bg-surface-2/40 p-10 text-center text-ink-2">
          No fulfillment orders yet. They appear here the moment a customer checks out.
        </div>
      )}

      {methods.map((method) => {
        const group = orders.filter((o) => o.fulfillment_method === method);
        if (group.length === 0) return null;
        return (
          <section key={method} className="mt-10">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-(--r-sm) bg-brand-tint text-brand">
                {METHOD_META[method].icon}
              </span>
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink-1">
                {METHOD_META[method].label}
              </h2>
              <Chip tone="neutral">{group.length}</Chip>
            </div>
            <div className="mt-4 overflow-x-auto rounded-(--r-md) border border-line">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-[0.12em] text-ink-3">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Window / dest.</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Advance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {group.map((o) => (
                    <tr key={o.id} className="bg-surface-1">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-ink-1">{o.order_number}</td>
                      <td className="px-4 py-3 text-ink-2">{o.buyer_name ?? "Account order"}</td>
                      <td className="px-4 py-3 text-ink-2">
                        {o.fulfillment_window ?? "n/a"}
                        {o.delivery_address && (
                          <span className="block text-xs text-ink-3">{o.delivery_address}</span>
                        )}
                        {!o.delivery_address && o.delivery_zip && (
                          <span className="block text-xs text-ink-3">ZIP {o.delivery_zip}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="tnum text-ink-1">{currency(Number(o.total))}</span>
                        <Chip tone={o.paid ? "eco" : "copper"}>{o.paid ? "Paid" : "Unpaid"}</Chip>
                      </td>
                      <td className="px-4 py-3">
                        <Chip tone="neutral">
                          {FULFILLMENT_STATUS_LABEL[o.fulfillment_status] ?? o.fulfillment_status}
                        </Chip>
                      </td>
                      <td className="px-4 py-3">
                        <FulfillmentAdvance orderId={o.id} method={method} status={o.fulfillment_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </Container>
  );
}
