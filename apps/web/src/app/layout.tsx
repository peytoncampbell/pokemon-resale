import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { SetupPage } from "@/components/setup-page";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const AppProviders = dynamic(
  () => import("@/components/providers/app-providers").then((m) => m.AppProviders),
  { ssr: true }
);

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pokemonresale.com'),
  title: {
    default: "Dashboard - Pokemon Resale",
    template: "%s - Pokemon Resale",
  },
  description: "Track deals, manage inventory, and grow your Pokemon card business",
  openGraph: {
    title: "Pokemon Resale Dashboard",
    description: "Track deals, manage inventory, and grow your Pokemon card business",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokemon Resale Dashboard",
    description: "Track deals, manage inventory, and grow your Pokemon card business",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {hasSupabase ? (
          <AppProviders>{children}</AppProviders>
        ) : (
          <SetupPage />
        )}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
