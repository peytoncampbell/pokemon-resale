import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PnLSummary, RealizedProfit, UnrealizedGain } from '@/lib/pnl/types'

// Helper to get auth headers from Supabase session
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

/**
 * usePnLSummary - Query for complete P&L summary (realized + unrealized)
 */
export function usePnLSummary() {
  return useQuery({
    queryKey: ['pnl', 'summary'],
    queryFn: async (): Promise<PnLSummary> => {
      const authHeaders = await getAuthHeaders()
      const params = new URLSearchParams()
      params.set('type', 'summary')

      const response = await fetch(`/api/pnl?${params}`, {
        headers: authHeaders,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch P&L summary')
      }

      return response.json()
    },
  })
}

/**
 * useUnrealizedGains - Query for unrealized gains on held inventory
 */
export function useUnrealizedGains() {
  return useQuery({
    queryKey: ['pnl', 'unrealized'],
    queryFn: async (): Promise<UnrealizedGain[]> => {
      const authHeaders = await getAuthHeaders()
      const params = new URLSearchParams()
      params.set('type', 'unrealized')

      const response = await fetch(`/api/pnl?${params}`, {
        headers: authHeaders,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch unrealized gains')
      }

      return response.json()
    },
  })
}

/**
 * useRealizedProfits - Query for realized profits from completed sales
 */
export function useRealizedProfits(days?: number) {
  return useQuery({
    queryKey: ['pnl', 'realized', days],
    queryFn: async (): Promise<RealizedProfit> => {
      const authHeaders = await getAuthHeaders()
      const params = new URLSearchParams()
      params.set('type', 'realized')
      if (days) {
        params.set('days', String(days))
      }

      const response = await fetch(`/api/pnl?${params}`, {
        headers: authHeaders,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch realized profits')
      }

      return response.json()
    },
  })
}
