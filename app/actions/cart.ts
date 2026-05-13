"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils/env";

const cartSyncSchema = z.array(
  z.object({
    productId: z.uuid(),
    quantity: z.coerce.number().int().min(1).max(10),
    selectedSize: z.string().trim().min(1),
  }),
);

export async function replaceCartAction(items: unknown) {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sign in to sync your bag across devices." };
  }

  const parsed = cartSyncSchema.safeParse(items);

  if (!parsed.success) {
    return { ok: false, message: "Bag sync payload is invalid." };
  }

  const supabase = await createServerSupabaseClient();
  const normalizedItems = parsed.data;

  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return { ok: false, message: deleteError.message };
  }

  if (normalizedItems.length > 0) {
    const { error: insertError } = await supabase.from("cart_items").insert(
      normalizedItems.map((item) => ({
        user_id: user.id,
        product_id: item.productId,
        quantity: item.quantity,
        selected_size: item.selectedSize,
      })),
    );

    if (insertError) {
      return { ok: false, message: insertError.message };
    }
  }

  revalidatePath("/bag");
  return { ok: true };
}

export async function trackRecentlyViewedAction(productId: string) {
  if (!isSupabaseConfigured()) {
    return { ok: false };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { ok: false };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("recently_viewed_products").upsert(
    {
      user_id: user.id,
      product_id: productId,
      viewed_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,product_id",
    },
  );

  if (error) {
    return { ok: false };
  }

  revalidatePath("/");
  return { ok: true };
}
