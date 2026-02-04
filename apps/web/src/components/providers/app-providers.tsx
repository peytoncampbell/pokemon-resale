"use client"

import { QueryProvider } from "./query-provider"
import { AuthProvider } from "./auth-provider"
import { CurrencyProvider } from "./currency-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "sonner"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryProvider>
          <CurrencyProvider>
            {children}
            <Toaster theme="dark" position="bottom-right" richColors />
          </CurrencyProvider>
        </QueryProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
