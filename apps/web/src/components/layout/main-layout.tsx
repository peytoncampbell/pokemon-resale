"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { CommandDock } from "./command-dock"
import { AuthGuard } from "@/components/auth/auth-guard"
import { NetworkStatusBanner } from "@/components/ui/network-status-banner"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <AuthGuard>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-vision-blue focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to content
      </a>
      <NetworkStatusBanner />
      <div className="min-h-screen bg-[url('/bg-dark-grain.png')] bg-cover bg-fixed">
        {/* Desktop: Grid layout with dock and content side by side */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr] md:gap-6 md:p-4 min-h-screen">
          {/* Dock - flows in grid, not fixed */}
          <CommandDock onMobileMenuToggle={() => setMobileMenuOpen(true)} />

          {/* Main content fills remaining space */}
          <div className="flex flex-col min-h-0">
            {/* Header row with right-aligned controls */}
            <div className="flex justify-end">
              <Header />
            </div>
            {/* Main content */}
            <main id="main-content" className="flex-1 max-w-[1920px]">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile: Stack layout */}
        <div className="md:hidden">
          <CommandDock onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <div className="pt-16">
            <main id="main-content-mobile" className="px-4 py-4">
              {children}
            </main>
          </div>
        </div>
      </div>
      <div aria-live="polite" id="announcements" className="sr-only" />
    </AuthGuard>
  )
}
