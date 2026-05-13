import Link from "next/link";

import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAdminDashboardData } from "@/lib/data/admin";
import { formatCurrency } from "@/lib/utils/currency";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <>
      <SectionHeading
        description="Track store performance, pending fulfilment, and top-selling products."
        eyebrow="Admin overview"
        title="Dashboard"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Total orders</p>
          <h2 className="mt-3 font-display text-5xl leading-none text-foreground">
            {dashboard.totalOrders}
          </h2>
        </Card>
        <Card>
          <p className="text-sm text-muted">Revenue</p>
          <h2 className="mt-3 font-display text-5xl leading-none text-foreground">
            {formatCurrency(dashboard.revenue)}
          </h2>
        </Card>
        <Card>
          <p className="text-sm text-muted">Pending orders</p>
          <h2 className="mt-3 font-display text-5xl leading-none text-foreground">
            {dashboard.pendingOrders}
          </h2>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">Top-selling products</h3>
            <Link href="/admin/products" className="text-sm font-semibold text-brand">
              View products
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-muted">
            {dashboard.topSellingProducts.length > 0 ? (
              dashboard.topSellingProducts.map((product) => (
                <div key={`${product.productId}-${product.productName}`} className="flex items-center justify-between rounded-2xl bg-background-soft px-4 py-3">
                  <span className="font-semibold text-foreground">{product.productName}</span>
                  <span>{product.quantitySold} sold</span>
                </div>
              ))
            ) : (
              <p>No paid orders yet.</p>
            )}
          </div>
        </Card>
        <Card className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">Recent orders</h3>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand">
              View orders
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-muted">
            {dashboard.recentOrders.length > 0 ? (
              dashboard.recentOrders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-background-soft px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-foreground">{order.orderNumber}</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <p className="mt-1">{order.fullName}</p>
                </div>
              ))
            ) : (
              <p>No orders have been placed yet.</p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
