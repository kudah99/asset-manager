import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Suppress hanging promise warnings for cookies() in Supabase client
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
