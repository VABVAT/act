import { NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/utils/env";
import { reportPaymentFailureSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { message: "Supabase admin access is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = reportPaymentFailureSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Failure payload is invalid." },
        { status: 400 },
      );
    }

    const admin = createAdminSupabaseClient();
    await admin.rpc("mark_order_failed", {
      target_order_id: parsed.data.orderId,
      payment_payload: {
        reason: parsed.data.reason || "Payment failed or checkout dismissed",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to record payment failure.",
      },
      { status: 500 },
    );
  }
}
