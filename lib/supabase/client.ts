"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicEnv } from "@/lib/utils/env";

export function createBrowserSupabaseClient() {
  const { url, publishableKey } = getSupabasePublicEnv();

  return createBrowserClient<Database>(url, publishableKey);
}
