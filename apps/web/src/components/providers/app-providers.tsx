"use client"

import { QueryProvider } from "./query-provider"
import { AuthProvider } from "./auth-provider"
import { CurrencyProvider } from "./currency-provider"
import { ErrorBoundary } from "@/components/error-boundary"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </QueryProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
