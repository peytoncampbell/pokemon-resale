import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Condition } from '@/types/filters'
import type { PriceHistoryData } from '@/types/price-intelligence'
import type { FreshnessStatus } from '@/lib/price/types'
import type { GameType } from '@/lib/tcg/types'
import { supabase } from '@/lib/supabase'

// Helper to get auth headers from Supabase session
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

// JustTCG API variant response (for legacy usePriceComparison and useArbitrageOpportunities)
interface JustTCGVariant {
  id: string
  condition: string
  printing: string
  language: string
  price: number | null
  lastUpdated: number
  priceChange7d: number | null
  priceChange30d: number | null
  avgPrice: number | null
  minPrice: number | null
  maxPrice: number | null
  priceHistory?: { date: string; price: number }[]
}

interface JustTCGCard {
  id: string
  name: string
  variants?: JustTCGVariant[]
}

// Map condition code to JustTCG condition string
const conditionMap: Record<Condition, string> = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged',
}

export type PriceHistoryDuration = '7d' | '30d' | '90d' | '180d'

// Extended return type with freshness data
interface PriceHistoryDataWithFreshness extends PriceHistoryData {
  freshness?: FreshnessStatus
  hoursOld?: number
  recordedAt?: string
}

// Map duration to days
function durationToDays(duration: PriceHistoryDuration): number {
  switch (duration) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '180d':
      return 180
    default:
      return 30
  }
}

export function usePriceHistory(
  cardId: string | undefined,
  condition: Condition = 'NM',
  duration: PriceHistoryDuration = '30d'
) {
  return useQuery({
    queryKey: ['price-history', cardId, condition, duration],
    queryFn: async (): Promise<PriceHistoryDataWithFreshness | null> => {
      if (!cardId) return null

      const days = durationToDays(duration)
      const authHeaders = await getAuthHeaders()
      const response = await fetch(
        `/api/prices/history?cardId=${encodeURIComponent(cardId)}&days=${days}`,
        { headers: authHeaders }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch price history')
      }

      const result = await response.json()
      const data = result.data

      if (!data) return null

      // Map API response to PriceHistoryData format
      const history = data.history.map((point: any) => ({
        date: point.recorded_at,
        price: point.market_price,
      }))

      // Calculate price changes from history
      const calculatePriceChange = (daysAgo: number) => {
        if (!data.current || history.length === 0) return null

        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() - daysAgo)

        // Find the closest price point to the target date
        const historicalPoint = history.reduce((closest: any, point: any) => {
          const pointDate = new Date(point.date)
          const closestDate = new Date(closest?.date || 0)
          const pointDiff = Math.abs(pointDate.getTime() - targetDate.getTime())
          const closestDiff = Math.abs(closestDate.getTime() - targetDate.getTime())
          return pointDiff < closestDiff ? point : closest
        }, null)

        if (!historicalPoint || !data.current.market_price) return null

        return data.current.market_price - historicalPoint.price
      }

      return {
        currentPrice: data.current?.market_price ?? null,
        priceChange7d: calculatePriceChange(7),
        priceChange30d: calculatePriceChange(30),
        avgPrice: data.stats?.avg ?? null,
        minPrice: data.stats?.min ?? null,
        maxPrice: data.stats?.max ?? null,
        history,
        freshness: data.current?.freshness,
        hoursOld: data.current?.hours_old,
        recordedAt: data.current?.recorded_at,
      }
    },
    enabled: !!cardId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// Hook to trigger on-demand price refresh
export function usePriceRefresh() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (params: { cardId: string; cardName: string; gameType: GameType }) => {
      const authHeaders = await getAuthHeaders()
      const response = await fetch('/api/prices/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          cardId: params.cardId,
          cardName: params.cardName,
          gameType: params.gameType,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to refresh price')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      // Invalidate price history query to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ['price-history', variables.cardId],
      })
    },
  })

  return {
    refreshPrice: mutation.mutate,
    isRefreshing: mutation.isPending,
  }
}

// Hook to trigger batch price refresh for multiple cards
export function useBatchPriceRefresh() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (cards: { cardId: string; cardName: string; gameType: GameType; setName?: string; productType?: string }[]) => {
      if (cards.length === 0) return { data: { succeeded: 0, failed: 0, results: [] } }

      const authHeaders = await getAuthHeaders()
      const response = await fetch('/api/prices/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          cards: cards.slice(0, 20), // API max is 20
          batchSize: 5,
          delayBetweenMs: 2000,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to refresh prices')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate price and P&L queries to refetch with new prices
      queryClient.invalidateQueries({ queryKey: ['price-history'] })
      queryClient.invalidateQueries({ queryKey: ['pnl'] })
      queryClient.invalidateQueries({ queryKey: ['prices', 'latest'] })
    },
  })

  return {
    refreshPrices: mutation.mutate,
    refreshPricesAsync: mutation.mutateAsync,
    isRefreshing: mutation.isPending,
  }
}

// Hook to get price comparison across all conditions
export function usePriceComparison(cardId: string | undefined) {
  return useQuery({
    queryKey: ['price-comparison', cardId],
    queryFn: async () => {
      if (!cardId) return []

      const response = await fetch(`/api/justtcg?cardId=${encodeURIComponent(cardId)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch price comparison')
      }

      const data = await response.json()
      const card = data.data?.[0] as JustTCGCard | undefined

      if (!card?.variants) return []

      const conditions: Condition[] = ['NM', 'LP', 'MP', 'HP', 'DMG']

      return conditions.map((condition) => {
        const variant = card.variants?.find((v) => v.condition === conditionMap[condition])
        return {
          condition,
          marketPrice: variant?.price ?? null,
          lowPrice: variant?.minPrice ?? null,
          avgPrice: variant?.avgPrice ?? null,
          priceChange7d: variant?.priceChange7d ?? null,
          priceChange30d: variant?.priceChange30d ?? null,
        }
      })
    },
    enabled: !!cardId,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

// Hook to find arbitrage opportunities in inventory
export function useArbitrageOpportunities(minMarginPercent: number = 50) {
  // This would need to combine inventory data with market prices
  // Implementation would fetch inventory and compare against current market prices
  return useQuery({
    queryKey: ['arbitrage-opportunities', minMarginPercent],
    queryFn: async () => {
      // TODO: Implement once we have batch price fetching
      // For now, return empty array
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}
