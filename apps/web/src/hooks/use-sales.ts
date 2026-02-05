import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { SaleRecordInput, RealizedProfit } from '@/lib/pnl/types'

// Helper to get auth headers from Supabase session
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

interface SaleResponse {
  transaction_id: string
  cost_basis: number
  fees: number
  net_profit: number
  lot_breakdown: Array<{
    lot_id: string
    quantity_consumed: number
    unit_cost: number
  }>
}

/**
 * useSellInventory - Mutation to record a sale
 * Calls POST /api/inventory/sell with FIFO lot consumption
 */
export function useSellInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SaleRecordInput): Promise<SaleResponse> => {
      const authHeaders = await getAuthHeaders()
      const response = await fetch('/api/inventory/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to record sale')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['pnl'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })
}

/**
 * useSaleHistory - Query for past sales (realized profits)
 */
export function useSaleHistory(filters?: { days?: number }) {
  return useQuery({
    queryKey: ['sales', 'history', filters],
    queryFn: async (): Promise<RealizedProfit> => {
      const authHeaders = await getAuthHeaders()
      const params = new URLSearchParams()
      params.set('type', 'realized')
      if (filters?.days) {
        params.set('days', String(filters.days))
      }

      const response = await fetch(`/api/pnl?${params}`, {
        headers: authHeaders,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sale history')
      }

      return response.json()
    },
  })
}
