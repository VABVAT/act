import { NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { verifyRazorpayPaymentSignature } from "@/lib/payment/razorpay";
import { isSupabaseAdminConfigured } from "@/lib/utils/env";
import { verifyPaymentSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { message: "Supabase admin access is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = verifyPaymentSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Payment payload is invalid." },
        { status: 400 },
      );
    }

    const admin = createAdminSupabaseClient();
    const { data: order } = await admin
      .from("orders")
      .select("id, order_number, payment_status, razorpay_order_id, user_id")
      .eq("id", parsed.data.orderId)
      .maybeSingle();

    if (!order || order.razorpay_order_id !== parsed.data.razorpayOrderId) {
      return NextResponse.json(
        { message: "Order could not be verified." },
        { status: 400 },
      );
    }

    const signatureIsValid = verifyRazorpayPaymentSignature({
      orderId: order.razorpay_order_id,
      paymentId: parsed.data.razorpayPaymentId,
      signature: parsed.data.razorpaySignature,
    });

    if (!signatureIsValid) {
      await admin.rpc("mark_order_failed", {
        target_order_id: order.id,
        payment_payload: {
          reason: "Signature verification failed",
        },
      });

      return NextResponse.json(
        { message: "Payment signature verification failed." },
        { status: 400 },
      );
    }

    await admin.rpc("mark_order_paid", {
      target_order_id: order.id,
      target_razorpay_payment_id: parsed.data.razorpayPaymentId,
      payment_payload: {
        razorpay_order_id: parsed.data.razorpayOrderId,
        razorpay_payment_id: parsed.data.razorpayPaymentId,
      },
    });

    if (order.user_id) {
      await admin.from("cart_items").delete().eq("user_id", order.user_id);
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.order_number,
      redirectTo: `/orders/${order.order_number}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong while verifying payment.",
      },
      { status: 500 },
    );
  }
}
