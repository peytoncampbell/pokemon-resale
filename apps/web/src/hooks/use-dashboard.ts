/**
 * Dashboard Hook
 *
 * Composed hook that aggregates P&L data, analytics, and transaction history
 * into a single consumable interface for dashboard components.
 */

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase, Transaction, TransactionItem, InventoryItem } from '@/lib/supabase'
import { usePnLSummary } from '@/hooks/use-pnl'
import { useAnalytics } from '@/hooks/use-analytics'
import { getCurrentOrganizationId } from '@/hooks/use-organization'
import { rankDealsByROI, type DealScore } from '@/lib/dashboard/deal-scoring'
import { formatActivityFeed, type ActivityEvent } from '@/lib/dashboard/activity-formatter'

// Transaction with items type
interface TransactionWithItems extends Transaction {
  transaction_items: TransactionItem[]
}

export interface DashboardData {
  portfolioValue: number
  totalCostBasis: number
  itemCount: number
  realizedProfit: {
    netProfit: number
    totalSales: number
    totalFees: number
    itemsSold: number
  }
  unrealizedGain: {
    totalGain: number
    totalMarketValue: number
    totalCostBasis: number
  }
  activityFeed: ActivityEvent[]
  dealRankings: {
    topPerformers: DealScore[]
    worstPerformers: DealScore[]
  }
  isLoading: boolean
  error: Error | null
}

/**
 * Fetch recent transactions for activity feed
 */
function useRecentTransactions() {
  return useQuery({
    queryKey: ['dashboard', 'recent-transactions'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()

      if (!orgId) {
        return []
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('id, type, cash_in, transaction_date, platform, transaction_items(card_name, quantity)')
        .eq('organization_id', orgId)
        .eq('status', 'COMPLETED')
        .order('transaction_date', { ascending: false })
        .limit(20)

      if (error) throw error

      return (data as unknown as TransactionWithItems[]) || []
    },
    staleTime: 30 * 1000, // 30 seconds (matches analytics pattern)
  })
}

/**
 * Fetch recent inventory additions for activity feed
 */
function useRecentInventory() {
  return useQuery({
    queryKey: ['dashboard', 'recent-inventory'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()

      if (!orgId) {
        return []
      }

      const { data, error } = await supabase
        .from('inventory')
        .select('id, card_name, quantity, acquisition_cost, created_at')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      return data || []
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Composed dashboard hook
 * Aggregates P&L summary, analytics, and activity feed into single interface
 */
export function useDashboard(): DashboardData {
  // Fetch all data sources
  const pnlQuery = usePnLSummary()
  const analyticsQuery = useAnalytics()
  const transactionsQuery = useRecentTransactions()
  const inventoryQuery = useRecentInventory()

  // Calculate portfolio value from unrealized gains
  const portfolioValue = useMemo(() => {
    if (!pnlQuery.data?.unrealized_gains) return 0

    return pnlQuery.data.unrealized_gains.reduce((sum, item) => {
      const marketValue = item.current_market_value ?? 0
      return sum + marketValue
    }, 0)
  }, [pnlQuery.data])

  // Calculate total cost basis from unrealized gains
  const totalCostBasis = useMemo(() => {
    if (!pnlQuery.data?.unrealized_gains) return 0

    return pnlQuery.data.unrealized_gains.reduce((sum, item) => {
      return sum + item.cost_basis
    }, 0)
  }, [pnlQuery.data])

  // Calculate deal rankings using ROI
  const dealRankings = useMemo(() => {
    if (!pnlQuery.data?.unrealized_gains) {
      return { topPerformers: [], worstPerformers: [] }
    }

    return rankDealsByROI(pnlQuery.data.unrealized_gains)
  }, [pnlQuery.data])

  // Format activity feed from transactions and inventory
  const activityFeed = useMemo(() => {
    if (!transactionsQuery.data || !inventoryQuery.data) {
      return []
    }

    return formatActivityFeed({
      recentInventory: inventoryQuery.data,
      recentTransactions: transactionsQuery.data,
    })
  }, [transactionsQuery.data, inventoryQuery.data])

  // Aggregate loading states (all must complete)
  const isLoading =
    pnlQuery.isLoading ||
    analyticsQuery.isLoading ||
    transactionsQuery.isLoading ||
    inventoryQuery.isLoading

  // Return first error encountered
  const error =
    pnlQuery.error ||
    analyticsQuery.error ||
    transactionsQuery.error ||
    inventoryQuery.error ||
    null

  return {
    portfolioValue,
    totalCostBasis,
    itemCount: analyticsQuery.data?.totalItems || 0,
    realizedProfit: {
      netProfit: pnlQuery.data?.realized_profit.net_profit || 0,
      totalSales: pnlQuery.data?.realized_profit.total_sales || 0,
      totalFees: pnlQuery.data?.realized_profit.total_fees || 0,
      itemsSold: pnlQuery.data?.realized_profit.items_sold || 0,
    },
    unrealizedGain: {
      totalGain:
        pnlQuery.data?.unrealized_gains.reduce((sum, item) => sum + (item.unrealized_gain ?? 0), 0) || 0,
      totalMarketValue: portfolioValue,
      totalCostBasis,
    },
    activityFeed,
    dealRankings,
    isLoading,
    error,
  }
}
