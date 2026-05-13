import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdminRouteAccess() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false as const,
      message: "Please log in again to continue.",
      status: 401,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return {
      ok: false as const,
      message: "Admin access is required.",
      status: 403,
    };
  }

  return {
    ok: true as const,
    userId: user.id,
  };
}
