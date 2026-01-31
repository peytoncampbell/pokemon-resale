"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { CommandDock } from "./command-dock"
import { AuthGuard } from "@/components/auth/auth-guard"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[url('/bg-dark-grain.png')] bg-cover bg-fixed">
        {/* Desktop: Grid layout with dock and content side by side */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr] md:gap-4 md:p-4 min-h-screen">
          {/* Dock - flows in grid, not fixed */}
          <CommandDock onMobileMenuToggle={() => setMobileMenuOpen(true)} />

          {/* Main content fills remaining space */}
          <div className="flex flex-col min-h-0">
            <Header onMenuClick={() => {}} />
            <main className="flex-1 px-4 max-w-[1920px]">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile: Stack layout */}
        <div className="md:hidden">
          <CommandDock onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <div className="pt-16">
            <main className="px-4 py-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
