import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // On force le mode dynamique pour éviter que Next.js essaie de contacter la DB au build
  experimental: {
    // any needed options
  },
};

export default nextConfig;