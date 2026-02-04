'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

export interface OnboardingStep {
  id: string
  label: string
  description: string
  completed: boolean
  href: string
}

const DISMISSED_KEY = 'onboarding-dismissed'

export function useOnboarding() {
  const [isDismissed, setIsDismissed] = useState(true) // Default true to avoid flash

  useEffect(() => {
    setIsDismissed(localStorage.getItem(DISMISSED_KEY) === 'true')
  }, [])

  const query = useQuery({
    queryKey: ['onboarding', 'steps'],
    queryFn: async (): Promise<OnboardingStep[]> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return getDefaultSteps()

      // Query actual data counts in parallel
      const [inventoryResult, buyResult, sellResult, alertResult] = await Promise.all([
        supabase
          .from('inventory')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId),
        supabase
          .from('transactions')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .eq('type', 'BUY'),
        supabase
          .from('transactions')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId)
          .eq('type', 'SELL'),
        supabase
          .from('price_alerts')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', orgId),
      ])

      const hasAddedCard = (inventoryResult.count ?? 0) > 0
      const hasRecordedBuy = (buyResult.count ?? 0) > 0
      const hasRecordedSell = (sellResult.count ?? 0) > 0
      const hasSetAlert = (alertResult.count ?? 0) > 0
      // We check localStorage for report views since there's no DB tracking for page visits
      const hasViewedReports = typeof window !== 'undefined'
        ? localStorage.getItem('has-viewed-reports') === 'true'
        : false

      return [
        {
          id: 'add-card',
          label: 'Add your first card',
          description: 'Add a Pokemon card to your inventory',
          completed: hasAddedCard,
          href: '/inventory',
        },
        {
          id: 'record-buy',
          label: 'Record a purchase',
          description: 'Track a buy transaction',
          completed: hasRecordedBuy,
          href: '/transactions',
        },
        {
          id: 'record-sell',
          label: 'Record a sale',
          description: 'Track a sell transaction',
          completed: hasRecordedSell,
          href: '/transactions',
        },
        {
          id: 'view-reports',
          label: 'View your reports',
          description: 'Check your profit & analytics',
          completed: hasViewedReports,
          href: '/reports',
        },
        {
          id: 'set-alert',
          label: 'Set a price alert',
          description: 'Get notified when prices change',
          completed: hasSetAlert,
          href: '/alerts',
        },
      ]
    },
    enabled: !isDismissed,
    staleTime: 5 * 60 * 1000,
  })

  const steps = query.data ?? getDefaultSteps()
  const completedCount = steps.filter((s) => s.completed).length
  const isComplete = completedCount === steps.length

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setIsDismissed(true)
  }

  return {
    steps,
    isComplete,
    completedCount,
    totalSteps: steps.length,
    isDismissed,
    dismiss,
    isLoading: query.isLoading,
  }
}

function getDefaultSteps(): OnboardingStep[] {
  return [
    { id: 'add-card', label: 'Add your first card', description: 'Add a Pokemon card to your inventory', completed: false, href: '/inventory' },
    { id: 'record-buy', label: 'Record a purchase', description: 'Track a buy transaction', completed: false, href: '/transactions' },
    { id: 'record-sell', label: 'Record a sale', description: 'Track a sell transaction', completed: false, href: '/transactions' },
    { id: 'view-reports', label: 'View your reports', description: 'Check your profit & analytics', completed: false, href: '/reports' },
    { id: 'set-alert', label: 'Set a price alert', description: 'Get notified when prices change', completed: false, href: '/alerts' },
  ]
}
