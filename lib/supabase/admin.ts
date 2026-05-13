import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseAdminEnv } from "@/lib/utils/env";

export function createAdminSupabaseClient() {
  const { url, secretKey } = getSupabaseAdminEnv();

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
