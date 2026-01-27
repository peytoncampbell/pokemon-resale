import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Procurement, ProcurementInsert } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

export type { Procurement }

export interface AddProcurementData {
  supplier: string
  order_date?: string
  subtotal?: number
  shipping?: number
  fees?: number
  status?: 'PENDING' | 'RECEIVED' | 'CANCELLED'
  notes?: string
}

export interface UpdateProcurementData {
  id: string
  supplier?: string
  order_date?: string
  subtotal?: number
  shipping?: number
  fees?: number
  total?: number
  status?: 'PENDING' | 'RECEIVED' | 'CANCELLED'
  notes?: string
}

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

export function useProcurements(statusFilter?: string) {
  return useQuery({
    queryKey: ['procurements', statusFilter],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []
      
      let query = supabase
        .from('procurements')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error

      return data as Procurement[]
    },
  })
}

export function useProcurement(id: string) {
  return useQuery({
    queryKey: ['procurements', id],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const { data, error } = await supabase
        .from('procurements')
        .select('*')
        .eq('id', id)
        .eq('organization_id', orgId)
        .single()

      if (error) throw error

      return data as Procurement
    },
    enabled: !!id,
  })
}

export function useProcurementItems(procurementId: string) {
  return useQuery({
    queryKey: ['procurements', procurementId, 'items'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('organization_id', orgId)
        .eq('procurement_id', procurementId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data
    },
    enabled: !!procurementId,
  })
}

export function useAddProcurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddProcurementData) => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const total = (data.subtotal || 0) + (data.shipping || 0) + (data.fees || 0)
      
      const insertData: ProcurementInsert = {
        user_id: userId,
        organization_id: orgId,
        supplier: data.supplier,
        order_date: data.order_date,
        subtotal: data.subtotal || 0,
        shipping: data.shipping || 0,
        fees: data.fees || 0,
        total,
        status: data.status || 'PENDING',
        notes: data.notes || null,
      }

      const { data: result, error } = await supabase
        .from('procurements')
        .insert([insertData])
        .select()
        .single()

      if (error) throw error

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
    },
  })
}

export function useUpdateProcurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProcurementData) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      const { id, ...updateData } = data
      
      // Recalculate total if any cost fields changed
      if (updateData.subtotal !== undefined || updateData.shipping !== undefined || updateData.fees !== undefined) {
        const { data: current } = await supabase
          .from('procurements')
          .select('subtotal, shipping, fees')
          .eq('id', id)
          .single()
        
        if (current) {
          const subtotal = updateData.subtotal ?? current.subtotal
          const shipping = updateData.shipping ?? current.shipping
          const fees = updateData.fees ?? current.fees
          updateData.total = subtotal + shipping + fees
        }
      }
      
      const { data: result, error } = await supabase
        .from('procurements')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (error) throw error

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
    },
  })
}

export function useDeleteProcurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      // First unlink any inventory items
      await supabase
        .from('inventory')
        .update({ procurement_id: null })
        .eq('procurement_id', id)
        .eq('organization_id', orgId)
      
      const { error } = await supabase
        .from('procurements')
        .delete()
        .eq('id', id)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}
