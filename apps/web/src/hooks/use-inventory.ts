import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, InventoryItem, InventoryInsert } from '@/lib/supabase'
import { cardApi } from '@/lib/card-api'
import type { GameType } from '@/lib/card-types'
import { getCurrentOrganizationId } from './use-organization'

export type { InventoryItem }

export interface AddInventoryData {
  card_id: string
  card_name: string
  card_image?: string
  set_name?: string
  location: string
  condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
  acquisition_cost: number
  quantity?: number
  status?: 'IN_STOCK' | 'LISTED' | 'SOLD'
  notes?: string
  procurement_id?: string
  game_type?: 'pokemon' | 'onepiece'
  product_type?: 'card' | 'sealed'
}

export interface UpdateInventoryData {
  id: string
  location?: string
  condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
  acquisition_cost?: number
  quantity?: number
  status?: 'IN_STOCK' | 'LISTED' | 'SOLD'
  notes?: string
  procurement_id?: string
}

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

export function useInventoryItems(statusFilter?: string) {
  return useQuery({
    queryKey: ['inventory', 'items', statusFilter],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []
      
      let query = supabase
        .from('inventory')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error

      return data as InventoryItem[]
    },
  })
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ['inventory', 'item', id],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .eq('organization_id', orgId)
        .single()

      if (error) throw error

      return data as InventoryItem
    },
    enabled: !!id,
  })
}

export function useAddInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddInventoryData) => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const insertData: InventoryInsert = {
        user_id: userId,
        organization_id: orgId,
        card_id: data.card_id,
        card_name: data.card_name,
        card_image: data.card_image || null,
        set_name: data.set_name || null,
        location: data.location,
        condition: data.condition || 'NM',
        acquisition_cost: data.acquisition_cost,
        quantity: data.quantity || 1,
        status: data.status || 'IN_STOCK',
        notes: data.notes || null,
        procurement_id: data.procurement_id || null,
        game_type: data.game_type || 'pokemon',
        product_type: data.product_type || 'card',
      }

      const { data: result, error } = await supabase
        .from('inventory')
        .insert([insertData])
        .select()
        .single()

      if (error) throw error

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateInventoryData) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      const { id, ...updateData } = data
      
      const { data: result, error } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (error) throw error

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useRecentCards(gameType: GameType = 'pokemon') {
  return useQuery({
    queryKey: ['cards', 'recent', gameType],
    queryFn: () => cardApi.getRecentCards(gameType),
  })
}

export function useSearchCards(query: string, gameType: GameType = 'pokemon', enabled = true) {
  return useQuery({
    queryKey: ['cards', 'search', query, gameType],
    queryFn: () => cardApi.searchCards(query, gameType),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes since card data doesn't change often
  })
}

// Sealed products from JustTCG API
export function useSearchSealed(query: string, gameType: GameType = 'pokemon', enabled = true) {
  return useQuery({
    queryKey: ['sealed', 'search', query, gameType],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('game', gameType)
      if (query) params.set('search', query)

      const response = await fetch(`/api/tcg/sealed?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sealed products')
      }
      const result = await response.json()

      // Transform to UnifiedCard format for compatibility
      return {
        data: result.data.map((product: {
          id: string
          name: string
          gameType: GameType
          setName: string
          imageUrl: string
          prices: { market: number | null }
          sealedType: string
        }) => ({
          id: product.id,
          gameType: product.gameType,
          productType: 'sealed' as const,
          name: product.name,
          setName: product.setName,
          imageSmall: product.imageUrl,
          marketPrice: product.prices.market,
          sealedType: product.sealedType,
        })),
        totalCount: result.meta.total,
      }
    },
    enabled: enabled,
    staleTime: 60 * 60 * 1000, // Cache for 1 hour since sealed data changes slowly
  })
}

export function useRecentSealed(gameType: GameType = 'pokemon') {
  return useQuery({
    queryKey: ['sealed', 'recent', gameType],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('game', gameType)
      params.set('limit', '12')

      const response = await fetch(`/api/tcg/sealed?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sealed products')
      }
      const result = await response.json()

      return {
        data: result.data.map((product: {
          id: string
          name: string
          gameType: GameType
          setName: string
          imageUrl: string
          prices: { market: number | null }
          sealedType: string
        }) => ({
          id: product.id,
          gameType: product.gameType,
          productType: 'sealed' as const,
          name: product.name,
          setName: product.setName,
          imageSmall: product.imageUrl,
          marketPrice: product.prices.market,
          sealedType: product.sealedType,
        })),
        totalCount: result.meta.total,
      }
    },
    staleTime: 60 * 60 * 1000,
  })
}
