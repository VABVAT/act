import Image from "next/image";
import { notFound } from "next/navigation";

import { OrderStatusForm } from "@/components/admin/order-status-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/format";
import { getAdminOrderById } from "@/lib/data/orders";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <Card className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Order detail
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-foreground">
              {order.orderNumber}
            </h1>
            <p className="mt-3 text-sm text-muted">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{order.orderStatus}</Badge>
            <Badge tone={order.paymentStatus === "paid" ? "success" : "accent"}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
        <OrderStatusForm orderId={order.id} orderStatus={order.orderStatus} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="grid gap-4">
          {order.items.map((item) => (
            <Card key={item.id} className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-background-soft">
                {item.imageUrl ? (
                  <Image
                    alt={item.productName}
                    className="object-cover"
                    fill
                    sizes="120px"
                    src={item.imageUrl}
                  />
                ) : null}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{item.productName}</h2>
                <p className="mt-2 text-sm text-muted">Size {item.selectedSize}</p>
                <p className="mt-1 text-sm text-muted">Qty {item.quantity}</p>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </Card>
          ))}
        </section>
        <aside className="grid gap-4 lg:sticky lg:top-28 lg:h-fit">
          <Card className="grid gap-3 text-sm text-muted">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Customer
            </p>
            <p className="font-semibold text-foreground">{order.fullName}</p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
          </Card>
          <Card className="grid gap-3 text-sm text-muted">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Shipping address
            </p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 ? <p>{order.shippingAddress.addressLine2}</p> : null}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
            {order.shippingAddress.landmark ? <p>{order.shippingAddress.landmark}</p> : null}
          </Card>
          <Card className="grid gap-3 text-sm text-muted">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Payment summary
            </p>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(order.subtotalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(order.discountAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span>Total</span>
              <span className="text-lg font-semibold text-foreground">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
