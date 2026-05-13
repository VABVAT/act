import { NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { verifyRazorpayWebhookSignature } from "@/lib/payment/razorpay";
import { isSupabaseAdminConfigured } from "@/lib/utils/env";

type RazorpayWebhookPayload = {
  event: string;
  payload?: {
    order?: {
      entity?: {
        id?: string;
      };
    };
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        error_description?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ message: "Webhook receiver not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
  }

  const eventId = request.headers.get("x-razorpay-event-id");
  const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  const admin = createAdminSupabaseClient();

  if (eventId) {
    const { data: existingEvent } = await admin
      .from("payment_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await admin.from("payment_events").insert({
      event_id: eventId,
      event_type: payload.event,
      payload,
      provider: "razorpay",
    });
  }

  const razorpayOrderId =
    payload.payload?.payment?.entity?.order_id || payload.payload?.order?.entity?.id || null;
  const razorpayPaymentId = payload.payload?.payment?.entity?.id || null;

  if (razorpayOrderId) {
    const { data: order } = await admin
      .from("orders")
      .select("id")
      .eq("razorpay_order_id", razorpayOrderId)
      .maybeSingle();

    if (order) {
      if (payload.event === "payment.captured" || payload.event === "order.paid") {
        await admin.rpc("mark_order_paid", {
          target_order_id: order.id,
          target_razorpay_payment_id: razorpayPaymentId || "",
          payment_payload: payload,
        });
      }

      if (payload.event === "payment.failed") {
        await admin.rpc("mark_order_failed", {
          target_order_id: order.id,
          payment_payload: payload,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
