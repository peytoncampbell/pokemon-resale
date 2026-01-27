import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, ProcurementExpectedItem, ProcurementExpectedItemInsert } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

export type { ProcurementExpectedItem }

export interface AddExpectedItemData {
  procurement_id: string
  card_id: string
  card_name: string
  card_image?: string
  set_name?: string
  expected_quantity?: number
  expected_cost?: number
  notes?: string
}

export interface UpdateExpectedItemData {
  id: string
  received_quantity?: number
  status?: 'PENDING' | 'RECEIVED' | 'PARTIAL' | 'MISSING'
  notes?: string
}

export function useExpectedItems(procurementId: string) {
  return useQuery({
    queryKey: ['expected-items', procurementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('procurement_expected_items')
        .select('*')
        .eq('procurement_id', procurementId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as ProcurementExpectedItem[]
    },
    enabled: !!procurementId,
  })
}

export function useAddExpectedItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddExpectedItemData) => {
      const insertData: ProcurementExpectedItemInsert = {
        procurement_id: data.procurement_id,
        card_id: data.card_id,
        card_name: data.card_name,
        card_image: data.card_image || null,
        set_name: data.set_name || null,
        expected_quantity: data.expected_quantity || 1,
        expected_cost: data.expected_cost || null,
        notes: data.notes || null,
      }

      const { data: result, error } = await supabase
        .from('procurement_expected_items')
        .insert([insertData])
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expected-items', variables.procurement_id] })
    },
  })
}

export function useUpdateExpectedItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateExpectedItemData) => {
      const { id, ...updateData } = data

      const { data: result, error } = await supabase
        .from('procurement_expected_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['expected-items', result.procurement_id] })
    },
  })
}

export function useDeleteExpectedItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, procurementId }: { id: string; procurementId: string }) => {
      const { error } = await supabase
        .from('procurement_expected_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      return procurementId
    },
    onSuccess: (procurementId) => {
      queryClient.invalidateQueries({ queryKey: ['expected-items', procurementId] })
    },
  })
}

export function useReconcileItems() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      procurementId,
      items,
    }: {
      procurementId: string
      items: Array<{ id: string; received_quantity: number }>
    }) => {
      const updates = items.map(async (item) => {
        const status =
          item.received_quantity === 0
            ? 'MISSING'
            : item.received_quantity < (await getExpectedQuantity(item.id))
            ? 'PARTIAL'
            : 'RECEIVED'

        return supabase
          .from('procurement_expected_items')
          .update({ received_quantity: item.received_quantity, status })
          .eq('id', item.id)
      })

      await Promise.all(updates)
      return procurementId
    },
    onSuccess: (procurementId) => {
      queryClient.invalidateQueries({ queryKey: ['expected-items', procurementId] })
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
    },
  })
}

async function getExpectedQuantity(itemId: string): Promise<number> {
  const { data } = await supabase
    .from('procurement_expected_items')
    .select('expected_quantity')
    .eq('id', itemId)
    .single()

  return data?.expected_quantity || 1
}
