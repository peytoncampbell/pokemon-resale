import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, InventoryItem, InventoryInsert } from '@/lib/supabase'
import { pokemonApi } from '@/lib/pokemon-api'

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
      const userId = await getCurrentUserId()
      
      let query = supabase
        .from('inventory')
        .select('*')
        .eq('user_id', userId)
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
      const userId = await getCurrentUserId()
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
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
      
      const insertData: InventoryInsert = {
        user_id: userId,
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
      const userId = await getCurrentUserId()
      const { id, ...updateData } = data
      
      const { data: result, error } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
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
      const userId = await getCurrentUserId()
      
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

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
