import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark playwright packages as external - they're only used server-side
  serverExternalPackages: ['playwright-core', '@sparticuz/chromium'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pokemontcg.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tcgplayer-cdn.tcgplayer.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
