import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAdminOrders } from "@/lib/data/orders";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/format";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const orders = await getAdminOrders(search);

  return (
    <>
      <SectionHeading
        description="Search orders, inspect customer details, and move fulfilment status forward."
        eyebrow="Orders"
        title="Manage orders"
      />
      <Card>
        <form>
          <Input defaultValue={search} name="q" placeholder="Search by order number, name, or email" type="search" />
        </form>
      </Card>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{order.orderNumber}</h2>
                <Badge>{order.orderStatus}</Badge>
                <Badge tone={order.paymentStatus === "paid" ? "success" : "accent"}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted">
                {order.fullName} • {order.email}
              </p>
              <p className="mt-1 text-sm text-muted">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(order.totalAmount)}
              </span>
              <Link
                href={`/admin/orders/${order.id}`}
                className="inline-flex rounded-full border border-line bg-white/75 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
              >
                View order
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
