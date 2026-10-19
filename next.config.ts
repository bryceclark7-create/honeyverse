import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all image sources for local demo
  images: {
    unoptimized: true,
  },
  // Serve from root for PWA
  trailingSlash: false,
};

export default nextConfig;
