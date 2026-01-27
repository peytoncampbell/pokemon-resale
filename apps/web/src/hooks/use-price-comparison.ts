import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import { pokemonApi } from '@/lib/pokemon-api'

export interface PriceComparison {
  card_id: string
  card_name: string
  acquisition_cost: number
  current_market_price: number | null
  price_difference: number | null
  price_difference_percent: number | null
  last_updated: string | null
}

export function usePriceHistory(cardId: string) {
  return useQuery({
    queryKey: ['price-history', cardId],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('organization_id', orgId)
        .eq('card_id', cardId)
        .order('recorded_at', { ascending: false })
        .limit(30)

      if (error) throw error
      return data
    },
    enabled: !!cardId,
  })
}

export function useRecordPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cardId,
      cardName,
      marketPrice,
      source = 'tcgplayer',
    }: {
      cardId: string
      cardName: string
      marketPrice: number
      source?: string
    }) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data, error } = await supabase
        .from('price_history')
        .insert([{
          organization_id: orgId,
          card_id: cardId,
          card_name: cardName,
          market_price: marketPrice,
          source,
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-history', variables.cardId] })
      queryClient.invalidateQueries({ queryKey: ['price-comparison'] })
    },
  })
}

export function usePriceComparisons() {
  return useQuery({
    queryKey: ['price-comparison'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data: inventory, error } = await supabase
        .from('inventory')
        .select('id, card_id, card_name, acquisition_cost')
        .eq('organization_id', orgId)
        .in('status', ['IN_STOCK', 'LISTED'])

      if (error) throw error

      const { data: latestPrices } = await supabase
        .from('price_history')
        .select('card_id, market_price, recorded_at')
        .eq('organization_id', orgId)
        .order('recorded_at', { ascending: false })

      const priceMap = new Map<string, { price: number; date: string }>()
      latestPrices?.forEach((p: { card_id: string; market_price: number; recorded_at: string }) => {
        if (!priceMap.has(p.card_id)) {
          priceMap.set(p.card_id, { price: p.market_price, date: p.recorded_at })
        }
      })

      return inventory.map((item): PriceComparison => {
        const latest = priceMap.get(item.card_id)
        const priceDiff = latest ? latest.price - item.acquisition_cost : null
        const priceDiffPercent = latest && item.acquisition_cost > 0
          ? ((latest.price - item.acquisition_cost) / item.acquisition_cost) * 100
          : null

        return {
          card_id: item.card_id,
          card_name: item.card_name,
          acquisition_cost: item.acquisition_cost,
          current_market_price: latest?.price || null,
          price_difference: priceDiff,
          price_difference_percent: priceDiffPercent,
          last_updated: latest?.date || null,
        }
      })
    },
  })
}

export function useRefreshPrices() {
  const queryClient = useQueryClient()
  const recordPrice = useRecordPrice()

  return useMutation({
    mutationFn: async (cardIds: string[]) => {
      const results = await Promise.allSettled(
        cardIds.map(async (cardId) => {
          const card = await pokemonApi.getCard(cardId)
          if (!card) throw new Error(`Card not found: ${cardId}`)

          const marketPrice = pokemonApi.getMarketPrice(card)
          if (!marketPrice) throw new Error(`No market price for: ${cardId}`)

          return recordPrice.mutateAsync({
            cardId: card.id,
            cardName: card.name,
            marketPrice,
          })
        })
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      return { successful, failed }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-comparison'] })
    },
  })
}
