"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="md:pl-[280px]">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
