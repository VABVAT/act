import { NextResponse } from "next/server";

import { saveProductFromFormData } from "@/lib/admin/save-product";
import { requireAdminRouteAccess } from "@/lib/auth/admin-route";
import { isSupabaseAdminConfigured } from "@/lib/utils/env";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase admin access is not configured yet.",
      },
      { status: 503 },
    );
  }

  const access = await requireAdminRouteAccess();

  if (!access.ok) {
    return NextResponse.json(
      {
        status: "error",
        message: access.message,
      },
      { status: access.status },
    );
  }

  const { id } = await params;
  const formData = await request.formData();
  const result = await saveProductFromFormData(formData, id);

  return NextResponse.json(result, {
    status: result.status === "success" ? 200 : 400,
  });
}
