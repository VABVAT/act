"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminUser } from "@/lib/auth/guards";
import { saveProductFromFormData } from "@/lib/admin/save-product";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { initialActionState, type ActionState } from "@/lib/utils/action-state";
import { isSupabaseAdminConfigured } from "@/lib/utils/env";

function parseStoragePath(publicUrl: string) {
  const marker = "/storage/v1/object/public/products/";
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return publicUrl.slice(markerIndex + marker.length);
}

export async function createProductAction(
  previousState: ActionState = initialActionState,
  formData: FormData,
) {
  void previousState;
  if (!isSupabaseAdminConfigured()) {
    return {
      status: "error" as const,
      message: "Supabase admin access is not configured yet.",
    };
  }

  await requireAdminUser();
  return saveProductFromFormData(formData);
}

export async function updateProductAction(
  productId: string,
  previousState: ActionState = initialActionState,
  formData: FormData,
) {
  void previousState;
  if (!isSupabaseAdminConfigured()) {
    return {
      status: "error" as const,
      message: "Supabase admin access is not configured yet.",
    };
  }

  await requireAdminUser();
  return saveProductFromFormData(formData, productId);
}

export async function deleteProductAction(productId: string) {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, message: "Supabase admin access is not configured yet." };
  }

  await requireAdminUser();

  const supabase = createAdminSupabaseClient();
  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId);

  await supabase.from("products").delete().eq("id", productId);

  const storagePaths = (images ?? [])
    .map((image) => parseStoragePath(image.image_url))
    .filter((value): value is string => Boolean(value));

  if (storagePaths.length > 0) {
    await supabase.storage.from("products").remove(storagePaths);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { ok: true };
}

const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function updateOrderStatusAction(input: {
  orderId: string;
  orderStatus: string;
}) {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, message: "Supabase admin access is not configured yet." };
  }

  await requireAdminUser();

  const parsed = orderStatusSchema.safeParse(input.orderStatus);

  if (!parsed.success) {
    return { ok: false, message: "Invalid order status." };
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({
      order_status: parsed.data,
    })
    .eq("id", input.orderId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  return { ok: true };
}
