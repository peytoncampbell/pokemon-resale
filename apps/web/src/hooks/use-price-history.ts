import { useQuery } from '@tanstack/react-query'
import type { Condition } from '@/types/filters'
import type { PriceHistoryData } from '@/types/price-intelligence'

// JustTCG API variant response
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

export function usePriceHistory(
  cardId: string | undefined,
  condition: Condition = 'NM',
  duration: PriceHistoryDuration = '30d'
) {
  return useQuery({
    queryKey: ['price-history', cardId, condition, duration],
    queryFn: async (): Promise<PriceHistoryData | null> => {
      if (!cardId) return null

      const response = await fetch(
        `/api/justtcg?cardId=${encodeURIComponent(cardId)}&include_price_history=true&priceHistoryDuration=${duration}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch price history')
      }

      const data = await response.json()
      const card = data.data?.[0] as JustTCGCard | undefined

      if (!card) return null

      const variant = card.variants?.find((v) => v.condition === conditionMap[condition])

      if (!variant) {
        // Return empty data if no variant found for condition
        return {
          currentPrice: null,
          priceChange7d: null,
          priceChange30d: null,
          avgPrice: null,
          minPrice: null,
          maxPrice: null,
          history: [],
        }
      }

      return {
        currentPrice: variant.price,
        priceChange7d: variant.priceChange7d,
        priceChange30d: variant.priceChange30d,
        avgPrice: variant.avgPrice,
        minPrice: variant.minPrice,
        maxPrice: variant.maxPrice,
        history: variant.priceHistory ?? [],
      }
    },
    enabled: !!cardId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
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
