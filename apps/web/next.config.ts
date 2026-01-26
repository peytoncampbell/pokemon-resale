import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pokemontcg.io",
        pathname: "/**",
      },
    ],
  },
  // Use this app directory as Turbopack root (avoids "multiple lockfiles" warning when one exists higher up)
  experimental: {
    turbo: {
      root: ".",
    },
  },
};

export default nextConfig;
