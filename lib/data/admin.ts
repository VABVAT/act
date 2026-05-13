import "server-only";

import { getAdminOrders } from "@/lib/data/orders";

import type { AdminDashboardData } from "@/lib/data/types";

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const orders = await getAdminOrders();
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const pendingOrders = orders.filter((order) => order.orderStatus === "pending").length;

  const productSalesMap = new Map<
    string,
    {
      productId: string | null;
      productName: string;
      productSlug: string | null;
      imageUrl: string | null;
      quantitySold: number;
    }
  >();

  paidOrders.forEach((order) => {
    order.items.forEach((item) => {
      const key = `${item.productId ?? "manual"}-${item.productName}`;
      const current = productSalesMap.get(key);

      if (current) {
        current.quantitySold += item.quantity;
        return;
      }

      productSalesMap.set(key, {
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        imageUrl: item.imageUrl,
        quantitySold: item.quantity,
      });
    });
  });

  return {
    totalOrders: orders.length,
    pendingOrders,
    revenue: paidOrders.reduce((total, order) => total + order.totalAmount, 0),
    topSellingProducts: [...productSalesMap.values()]
      .sort((left, right) => right.quantitySold - left.quantitySold)
      .slice(0, 5),
    recentOrders: orders.slice(0, 5),
  };
}
