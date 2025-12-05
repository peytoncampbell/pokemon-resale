import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { pokemonApi } from '@/lib/pokemon-api'

export interface InventoryItem {
  id: string
  card_id: string
  card_name: string
  card_image: string | null
  set_name: string | null
  location: string
  acquisition_cost: number
  quantity: number
  status: 'IN_STOCK' | 'LISTED' | 'SOLD'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AddInventoryData {
  card_id: string
  card_name: string
  card_image?: string
  set_name?: string
  location: string
  acquisition_cost: number
  quantity?: number
  status?: 'IN_STOCK' | 'LISTED' | 'SOLD'
  notes?: string
}

export function useInventoryItems(statusFilter?: string) {
  return useQuery({
    queryKey: ['inventory', 'items', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('inventory')
        .select('*')
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

export function useAddInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddInventoryData) => {
      const { data: result, error } = await supabase
        .from('inventory')
        .insert([
          {
            card_id: data.card_id,
            card_name: data.card_name,
            card_image: data.card_image || null,
            set_name: data.set_name || null,
            location: data.location,
            acquisition_cost: data.acquisition_cost,
            quantity: data.quantity || 1,
            status: data.status || 'IN_STOCK',
            notes: data.notes || null,
          },
        ])
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
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useRecentCards() {
  return useQuery({
    queryKey: ['pokemon', 'recent'],
    queryFn: () => pokemonApi.getRecentCards(),
  })
}

export function useSearchCards(query: string) {
  return useQuery({
    queryKey: ['pokemon', 'search', query],
    queryFn: () => pokemonApi.searchCards(query),
    enabled: query.length > 2,
  })
}
