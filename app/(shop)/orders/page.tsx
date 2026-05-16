import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { getUserOrders } from "@/lib/data/orders";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/format";

export default async function OrdersPage() {
  const user = await requireAuthenticatedUser("/orders");
  const orders = await getUserOrders(user.id);

  return (
    <div className="content-wrap py-8 md:py-12">
      <SectionHeading
        description="Track dispatch and delivery updates for confirmed purchases linked to your account."
        eyebrow="My orders"
        title="Order history"
      />
      <div className="mt-8 grid gap-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="grid gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
                    {order.orderNumber}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    {formatCurrency(order.totalAmount)}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{order.orderStatus}</Badge>
                  <Badge tone={order.paymentStatus === "paid" ? "success" : "accent"}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-muted">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.productName} • Size {item.selectedSize} • Qty {item.quantity}
                  </p>
                ))}
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="inline-flex rounded-full border border-line bg-white/75 px-5 py-3 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
                >
                  View order
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No orders yet"
            description="Any confirmed orders linked to your account will appear here with their latest status."
            action={
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
              >
                Shop collection
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
