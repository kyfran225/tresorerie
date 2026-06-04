import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static optimization for routes that need the DB
  experimental: {
    // This can help avoid some pre-rendering issues during build
  }
};

export default nextConfig;
