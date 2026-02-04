"use client"

import { useEffect } from "react"
import { QueryProvider } from "./query-provider"
import { AuthProvider } from "./auth-provider"
import { CurrencyProvider } from "./currency-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "sonner"

function AxeDevTool() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      import("@axe-core/react").then((axe) => {
        import("react-dom").then((ReactDOM) => {
          axe.default(
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require("react"),
            ReactDOM,
            1000
          )
        })
      })
    }
  }, [])

  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryProvider>
          <CurrencyProvider>
            {children}
            <Toaster theme="dark" position="bottom-right" richColors />
            {process.env.NODE_ENV === "development" && <AxeDevTool />}
          </CurrencyProvider>
        </QueryProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
