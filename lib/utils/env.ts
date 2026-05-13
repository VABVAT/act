const LOCAL_SITE_URL = "https://arteezcollection.in";
const PRODUCTION_SITE_URL = "https://arteezcollection.in";

export function getSiteUrl() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "development"
      ? LOCAL_SITE_URL
      : PRODUCTION_SITE_URL);

  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
}

export function isRazorpayConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
  );
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return { url, publishableKey };
}

export function getSupabaseAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return { url, secretKey };
}

export function getRazorpayEnv() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are missing.");
  }

  return { keyId, keySecret, webhookSecret };
}

export function getRuntimeFlags() {
  return {
    supabase: isSupabaseConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    razorpay: isRazorpayConfigured(),
  };
}
