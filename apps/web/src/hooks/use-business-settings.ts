import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

export interface BusinessSettings {
  id: string
  organization_id: string
  initial_investment: number
  cash_reserves: number
  historical_inventory_cost: number
  historical_revenue: number
  historical_profit: number
  business_start_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BusinessSettingsUpdate {
  initial_investment?: number
  cash_reserves?: number
  historical_inventory_cost?: number
  historical_revenue?: number
  historical_profit?: number
  business_start_date?: string | null
  notes?: string | null
}

const DEFAULT_SETTINGS: Omit<BusinessSettings, 'id' | 'organization_id' | 'created_at' | 'updated_at'> = {
  initial_investment: 0,
  cash_reserves: 0,
  historical_inventory_cost: 0,
  historical_revenue: 0,
  historical_profit: 0,
  business_start_date: null,
  notes: null,
}

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['business-settings'],
    queryFn: async (): Promise<BusinessSettings | null> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return null

      // Try to get existing settings
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('organization_id', orgId)
        .maybeSingle()

      if (error) {
        // Table might not exist yet - return null and let the UI handle it
        console.warn('Error fetching business settings:', error.message)
        return null
      }

      return data as BusinessSettings | null
    },
  })
}

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: BusinessSettingsUpdate) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      // Check if settings exist
      const { data: existing } = await supabase
        .from('business_settings')
        .select('id')
        .eq('organization_id', orgId)
        .maybeSingle()

      if (existing) {
        // Update existing settings
        const { data, error } = await supabase
          .from('business_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('organization_id', orgId)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('business_settings')
          .insert({
            organization_id: orgId,
            ...DEFAULT_SETTINGS,
            ...settings,
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

// Combined analytics that includes business settings
export function useBusinessAnalytics() {
  const { data: settings, isLoading: settingsLoading } = useBusinessSettings()

  return {
    settings,
    isLoading: settingsLoading,
    // Helper getters with defaults
    initialInvestment: settings?.initial_investment ?? 0,
    cashReserves: settings?.cash_reserves ?? 0,
    historicalInventoryCost: settings?.historical_inventory_cost ?? 0,
    historicalRevenue: settings?.historical_revenue ?? 0,
    historicalProfit: settings?.historical_profit ?? 0,
  }
}
