import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (supabaseUrl) {
  const resolvedUrl = new URL(supabaseUrl);

  remotePatterns.push({
    protocol: resolvedUrl.protocol.replace(":", "") as "http" | "https",
    hostname: resolvedUrl.hostname,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
