"use client"

import { QueryProvider } from "./query-provider"
import { AuthProvider } from "./auth-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </AuthProvider>
  )
}
