"use client"

import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 3,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
          },
          mutations: {
            retry: 0,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error(error.message)
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
