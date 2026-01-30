"use client"

import { QueryProvider } from "./query-provider"
import { AuthProvider } from "./auth-provider"
import { ErrorBoundary } from "@/components/error-boundary"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
