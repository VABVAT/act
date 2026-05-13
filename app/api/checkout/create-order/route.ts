import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { priceCheckoutItems } from "@/lib/data/cart";
import { createRazorpayClient } from "@/lib/payment/razorpay";
import { generateOrderNumber } from "@/lib/utils/order-number";
import {
  getRazorpayEnv,
  isRazorpayConfigured,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/utils/env";
import { createCheckoutOrderSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { message: "Supabase is not configured yet." },
      { status: 503 },
    );
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { message: "Razorpay is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = createCheckoutOrderSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Checkout details are invalid.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pricing = await priceCheckoutItems(parsed.data.items, parsed.data.couponCode);
    const orderNumber = generateOrderNumber();
    const razorpay = createRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(pricing.total * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: {
        app_order_number: orderNumber,
      },
    });

    const admin = createAdminSupabaseClient();
    const { data: createdOrderId, error } = await admin.rpc("create_pending_order", {
      p_order_number: orderNumber,
      p_user_id: user?.id ?? null,
      p_coupon_id: pricing.appliedCoupon?.id ?? null,
      p_full_name: parsed.data.shippingAddress.fullName,
      p_phone: parsed.data.shippingAddress.phone,
      p_email: parsed.data.shippingAddress.email,
      p_shipping_address: parsed.data.shippingAddress,
      p_subtotal_amount: pricing.subtotal,
      p_delivery_fee: pricing.deliveryFee,
      p_discount_amount: pricing.discountAmount,
      p_total_amount: pricing.total,
      p_razorpay_order_id: razorpayOrder.id,
      p_items: pricing.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        selected_size: item.selectedSize,
      })),
    });

    if (error || !createdOrderId) {
      return NextResponse.json(
        { message: error?.message || "Unable to create the order." },
        { status: 400 },
      );
    }

    const { keyId } = getRazorpayEnv();

    return NextResponse.json({
      orderId: createdOrderId,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: pricing.total,
      amountInSubunits: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      customer: parsed.data.shippingAddress,
      summary: pricing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong while creating the order.",
      },
      { status: 500 },
    );
  }
}
