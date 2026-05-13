"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils/env";

type WishlistActionResult = {
  ok: boolean;
  requiresAuth?: boolean;
  message?: string;
};

export async function toggleWishlistAction(input: {
  productId: string;
  shouldAdd: boolean;
  path?: string;
}): Promise<WishlistActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, requiresAuth: true, message: "Please sign in to save wishlist items." };
  }

  const supabase = await createServerSupabaseClient();

  if (input.shouldAdd) {
    const { error } = await supabase.from("wishlist_items").insert({
      product_id: input.productId,
      user_id: user.id,
    });

    if (error && !error.message.includes("duplicate key")) {
      return { ok: false, message: error.message };
    }
  } else {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", input.productId);

    if (error) {
      return { ok: false, message: error.message };
    }
  }

  revalidatePath("/wishlist");
  if (input.path) {
    revalidatePath(input.path);
  }

  return {
    ok: true,
    message: input.shouldAdd ? "Added to wishlist." : "Removed from wishlist.",
  };
}
