import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
  title: "Pokemon Resale Platform",
  description: "Track deals, manage inventory, and grow your Pokemon card business",
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
      </body>
    </html>
  );
}
