import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Supplier, SupplierInsert } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

export type { Supplier }

export interface AddSupplierData {
  name: string
  contact_name?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  rating?: number
  notes?: string
}

export interface UpdateSupplierData extends Partial<AddSupplierData> {
  id: string
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('organization_id', orgId)
        .order('name', { ascending: true })

      if (error) throw error
      return data as Supplier[]
    },
  })
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .eq('organization_id', orgId)
        .single()

      if (error) throw error
      return data as Supplier
    },
    enabled: !!id,
  })
}

export function useAddSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddSupplierData) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const insertData: SupplierInsert = {
        organization_id: orgId,
        name: data.name,
        contact_name: data.contact_name || null,
        email: data.email || null,
        phone: data.phone || null,
        website: data.website || null,
        address: data.address || null,
        rating: data.rating || null,
        notes: data.notes || null,
      }

      const { data: result, error } = await supabase
        .from('suppliers')
        .insert([insertData])
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateSupplierData) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { id, ...updateData } = data

      const { data: result, error } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export function useSupplierStats(supplierId: string) {
  return useQuery({
    queryKey: ['suppliers', supplierId, 'stats'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return null

      const { data: procurements, error } = await supabase
        .from('procurements')
        .select('id, total, status')
        .eq('organization_id', orgId)
        .eq('supplier_id', supplierId)

      if (error) throw error

      const totalOrders = procurements.length
      const totalSpent = procurements
        .filter(p => p.status !== 'CANCELLED')
        .reduce((sum, p) => sum + (p.total || 0), 0)
      const pendingOrders = procurements.filter(p => p.status === 'PENDING').length

      return {
        totalOrders,
        totalSpent,
        pendingOrders,
      }
    },
    enabled: !!supplierId,
  })
}
