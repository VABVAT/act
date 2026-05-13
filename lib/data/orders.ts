import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/utils/env";

import type {
  OrderRecord,
  OrderRowWithRelations,
  ShippingAddressSnapshot,
} from "@/lib/data/types";

const orderSelect = `
  *,
  order_items (*),
  payments (*)
`;

function mapOrder(row: OrderRowWithRelations): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    userId: row.user_id,
    subtotalAmount: row.subtotal_amount,
    deliveryFee: row.delivery_fee,
    discountAmount: row.discount_amount,
    totalAmount: row.total_amount,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    shippingAddress: row.shipping_address as ShippingAddressSnapshot,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: row.order_items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productSlug: item.product_slug,
      productSku: item.product_sku,
      imageUrl: item.image_url,
      quantity: item.quantity,
      selectedSize: item.selected_size,
      price: item.price,
    })),
    payment: row.payments?.[0] ?? null,
  };
}

export async function getUserOrders(userId: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return ((data as OrderRowWithRelations[] | null) ?? []).map(mapOrder);
}

export async function getUserOrderByNumber(userId: string, orderNumber: string) {
  const orders = await getUserOrders(userId);
  return orders.find((order) => order.orderNumber === orderNumber) ?? null;
}

export async function getAdminOrders(search = "") {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("orders")
    .select(orderSelect)
    .order("created_at", { ascending: false });

  const orders = ((data as OrderRowWithRelations[] | null) ?? []).map(mapOrder);
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return orders;
  }

  return orders.filter((order) =>
    [
      order.orderNumber,
      order.email,
      order.phone,
      order.fullName,
      ...order.items.map((item) => item.productName),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch),
  );
}

export async function getAdminOrderById(orderId: string) {
  const orders = await getAdminOrders();
  return orders.find((order) => order.id === orderId) ?? null;
}

export async function getOrderByIdForAdmin(orderId: string) {
  return getAdminOrderById(orderId);
}
