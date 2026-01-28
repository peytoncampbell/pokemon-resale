import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Database } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

type InventoryUpdate = Database['public']['Tables']['inventory']['Update']

export type BulkUpdateData = {
  ids: string[]
  status?: 'IN_STOCK' | 'LISTED' | 'SOLD'
  location?: string
  condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
}

export function useBulkUpdateInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BulkUpdateData) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { ids, ...updateFields } = data

      const { data: result, error } = await supabase
        .from('inventory')
        .update(updateFields as InventoryUpdate)
        .in('id', ids)
        .eq('organization_id', orgId)
        .select()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useBulkDeleteInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { error } = await supabase
        .from('inventory')
        .delete()
        .in('id', ids)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useCheckDuplicates() {
  return useMutation({
    mutationFn: async (cardId: string) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('card_id', cardId)
        .eq('organization_id', orgId)

      if (error) throw error
      return data || []
    },
  })
}
