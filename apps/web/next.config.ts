import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

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

// Configure bundle analyzer (enabled via ANALYZE=true env var)
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

// Wrap with both bundle analyzer and Sentry
const configWithAnalyzer = bundleAnalyzer(nextConfig);

export default withSentryConfig(configWithAnalyzer, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
