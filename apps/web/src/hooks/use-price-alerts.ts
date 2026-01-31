import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import { getCurrentUserId } from '@/lib/auth-helpers'
import type {
  PriceAlert,
  CreatePriceAlertInput,
  UpdatePriceAlertInput,
} from '@/types/price-intelligence'

// Database row type (snake_case from Supabase)
interface PriceAlertRow {
  id: string
  organization_id: string
  user_id: string
  card_id: string
  card_name: string
  card_image: string | null
  set_name: string | null
  condition: string
  game_type: string
  alert_type: string
  target_price: number | null
  threshold_percent: number | null
  is_active: boolean
  is_triggered: boolean
  triggered_at: string | null
  triggered_price: number | null
  notify_in_app: boolean
  notify_email: boolean
  created_at: string
  updated_at: string
}

// Transform database row to frontend type
function transformAlert(row: PriceAlertRow): PriceAlert {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    cardId: row.card_id,
    cardName: row.card_name,
    cardImage: row.card_image,
    setName: row.set_name,
    condition: row.condition as PriceAlert['condition'],
    gameType: row.game_type as PriceAlert['gameType'],
    alertType: row.alert_type as PriceAlert['alertType'],
    targetPrice: row.target_price,
    thresholdPercent: row.threshold_percent,
    isActive: row.is_active,
    isTriggered: row.is_triggered,
    triggeredAt: row.triggered_at,
    triggeredPrice: row.triggered_price,
    notifyInApp: row.notify_in_app,
    notifyEmail: row.notify_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function usePriceAlerts(activeOnly: boolean = false) {
  return useQuery({
    queryKey: ['price-alerts', activeOnly],
    queryFn: async (): Promise<PriceAlert[]> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      let query = supabase
        .from('price_alerts')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query

      if (error) throw error

      return (data as PriceAlertRow[]).map(transformAlert)
    },
  })
}

export function usePriceAlert(id: string) {
  return useQuery({
    queryKey: ['price-alerts', id],
    queryFn: async (): Promise<PriceAlert | null> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return null

      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('id', id)
        .eq('organization_id', orgId)
        .single()

      if (error) throw error

      return transformAlert(data as PriceAlertRow)
    },
    enabled: !!id,
  })
}

export function useCreatePriceAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreatePriceAlertInput): Promise<PriceAlert> => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          organization_id: orgId,
          user_id: userId,
          card_id: input.cardId,
          card_name: input.cardName,
          card_image: input.cardImage || null,
          set_name: input.setName || null,
          condition: input.condition || 'NM',
          game_type: input.gameType || 'pokemon',
          alert_type: input.alertType,
          target_price: input.targetPrice || null,
          threshold_percent: input.thresholdPercent || null,
          notify_in_app: input.notifyInApp ?? true,
          notify_email: input.notifyEmail ?? false,
        })
        .select()
        .single()

      if (error) throw error

      return transformAlert(data as PriceAlertRow)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
    },
  })
}

export function useUpdatePriceAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdatePriceAlertInput): Promise<PriceAlert> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (input.isActive !== undefined) updateData.is_active = input.isActive
      if (input.targetPrice !== undefined) updateData.target_price = input.targetPrice
      if (input.thresholdPercent !== undefined) updateData.threshold_percent = input.thresholdPercent
      if (input.notifyInApp !== undefined) updateData.notify_in_app = input.notifyInApp
      if (input.notifyEmail !== undefined) updateData.notify_email = input.notifyEmail

      const { data, error } = await supabase
        .from('price_alerts')
        .update(updateData)
        .eq('id', input.id)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (error) throw error

      return transformAlert(data as PriceAlertRow)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
      queryClient.invalidateQueries({ queryKey: ['price-alerts', variables.id] })
    },
  })
}

export function useDeletePriceAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
    },
  })
}

// Toggle alert active state
export function useTogglePriceAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<PriceAlert> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data, error } = await supabase
        .from('price_alerts')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (error) throw error

      return transformAlert(data as PriceAlertRow)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
    },
  })
}

// Dismiss triggered alert
export function useDismissPriceAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { error } = await supabase
        .from('price_alerts')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] })
    },
  })
}
