import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase, InventoryItem, Transaction, TransactionItem } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import type {
  TimeRange,
  SetProfitability,
  PlatformProfitability,
  InventoryAgingBucket,
  SellThroughMetrics,
  AgingBucket,
} from '@/types/analytics'

// Re-export types for convenience
export type { TimeRange, SetProfitability, PlatformProfitability, InventoryAgingBucket, SellThroughMetrics }

export interface AnalyticsSummary {
  totalInventoryValue: number
  totalItems: number
  totalInvested: number
  itemsSold: number
  totalRevenue: number
  totalProfit: number
  pendingProcurements: number
  inventoryByStatus: {
    IN_STOCK: number
    LISTED: number
    SOLD: number
  }
  inventoryByCondition: Record<string, number>
  recentActivity: {
    date: string
    itemsAdded: number
    value: number
  }[]
}

const EMPTY_ANALYTICS: AnalyticsSummary = {
  totalInventoryValue: 0,
  totalItems: 0,
  totalInvested: 0,
  itemsSold: 0,
  totalRevenue: 0,
  totalProfit: 0,
  pendingProcurements: 0,
  inventoryByStatus: { IN_STOCK: 0, LISTED: 0, SOLD: 0 },
  inventoryByCondition: {},
  recentActivity: [],
}

/**
 * Try to use the database function for analytics (more efficient)
 * Falls back to client-side calculation if function doesn't exist
 */
async function fetchAnalyticsFromDatabase(orgId: string): Promise<AnalyticsSummary | null> {
  try {
    const { data, error } = await supabase.rpc('get_organization_analytics', {
      org_id: orgId,
    })

    if (error) {
      // Function might not exist yet, return null to use fallback
      console.warn('Analytics function not available, using client-side calculation:', error.message)
      return null
    }

    // Transform the database response to match our interface
    const dbResult = data as {
      totalInventoryValue: number
      totalItems: number
      totalInvested: number
      itemsSold: number
      totalRevenue: number
      totalProfit: number
      pendingProcurements: number
      inventoryByStatus: { IN_STOCK: number; LISTED: number; SOLD: number }
      recentActivity: { date: string; items_added: number; value: number }[]
    }

    return {
      ...dbResult,
      inventoryByCondition: {}, // Not calculated in DB function yet
      recentActivity: (dbResult.recentActivity || []).map((day) => ({
        date: day.date,
        itemsAdded: day.items_added,
        value: day.value,
      })),
    }
  } catch {
    return null
  }
}

/**
 * Fallback: Calculate analytics client-side (used when DB function unavailable)
 */
async function fetchAnalyticsClientSide(orgId: string): Promise<AnalyticsSummary> {
  // Get all inventory items
  const { data: inventoryData, error: invError } = await supabase
    .from('inventory')
    .select('*')
    .eq('organization_id', orgId)

  if (invError) throw invError
  const inventory = inventoryData as InventoryItem[] | null

  // Get all completed transactions
  const { data: transactionsData, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('organization_id', orgId)
    .eq('status', 'COMPLETED')

  if (txError) throw txError
  const transactions = transactionsData as Transaction[] | null

  // Get pending procurements count
  const { count: pendingProcurements, error: procError } = await supabase
    .from('procurements')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .eq('status', 'PENDING')

  if (procError) throw procError

  // Calculate inventory metrics
  const activeInventory =
    inventory?.filter((item) => item.status === 'IN_STOCK' || item.status === 'LISTED') || []

  const totalInventoryValue = activeInventory.reduce(
    (sum, item) => sum + item.acquisition_cost * item.quantity,
    0
  )

  const totalItems = activeInventory.reduce((sum, item) => sum + item.quantity, 0)

  const totalInvested =
    inventory?.reduce((sum, item) => sum + item.acquisition_cost * item.quantity, 0) || 0

  const itemsSold = inventory?.filter((item) => item.status === 'SOLD').length || 0

  // Calculate revenue from SELL transactions (cash_in)
  const sellTransactions = transactions?.filter((t) => t.type === 'SELL') || []
  const totalRevenue = sellTransactions.reduce((sum, t) => sum + Number(t.cash_in || 0), 0)

  // Calculate total fees from all transactions
  const totalFees = transactions?.reduce((sum, t) => sum + Number(t.fees || 0), 0) || 0

  // Calculate cost of sold items (inventory items marked as SOLD)
  const soldItems = inventory?.filter((item) => item.status === 'SOLD') || []
  const soldItemsCost = soldItems.reduce(
    (sum, item) => sum + item.acquisition_cost * item.quantity,
    0
  )

  // Profit = Revenue - Cost of Goods Sold - Fees
  const totalProfit = totalRevenue - soldItemsCost - totalFees

  // Inventory by status
  const inventoryByStatus = {
    IN_STOCK:
      inventory?.filter((i) => i.status === 'IN_STOCK').reduce((s, i) => s + i.quantity, 0) || 0,
    LISTED: inventory?.filter((i) => i.status === 'LISTED').reduce((s, i) => s + i.quantity, 0) || 0,
    SOLD: inventory?.filter((i) => i.status === 'SOLD').reduce((s, i) => s + i.quantity, 0) || 0,
  }

  // Inventory by condition
  const inventoryByCondition: Record<string, number> = {}
  inventory?.forEach((item) => {
    const condition = item.condition || 'NM'
    inventoryByCondition[condition] = (inventoryByCondition[condition] || 0) + item.quantity
  })

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentItems = inventory?.filter((item) => new Date(item.created_at) >= sevenDaysAgo) || []

  const activityByDate: Record<string, { itemsAdded: number; value: number }> = {}
  recentItems.forEach((item) => {
    const date = new Date(item.created_at).toISOString().split('T')[0]
    if (!activityByDate[date]) {
      activityByDate[date] = { itemsAdded: 0, value: 0 }
    }
    activityByDate[date].itemsAdded += item.quantity
    activityByDate[date].value += item.acquisition_cost * item.quantity
  })

  const recentActivity = Object.entries(activityByDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalInventoryValue,
    totalItems,
    totalInvested,
    itemsSold,
    totalRevenue,
    totalProfit,
    pendingProcurements: pendingProcurements || 0,
    inventoryByStatus,
    inventoryByCondition,
    recentActivity,
  }
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    // Refresh analytics more frequently to reflect recent changes
    staleTime: 30 * 1000, // 30 seconds
    queryFn: async (): Promise<AnalyticsSummary> => {
      const orgId = await getCurrentOrganizationId()

      // Return empty analytics if no organization
      if (!orgId) {
        return EMPTY_ANALYTICS
      }

      // Try database function first (more efficient)
      const dbResult = await fetchAnalyticsFromDatabase(orgId)
      if (dbResult) {
        return dbResult
      }

      // Fallback to client-side calculation
      return fetchAnalyticsClientSide(orgId)
    },
  })
}

// ============================================================================
// Phase 2: Advanced Analytics
// ============================================================================

// Transaction with items type
interface TransactionWithItems extends Transaction {
  transaction_items: TransactionItem[]
}

// Helper to resolve time range to actual dates
function resolveDateRange(timeRange: TimeRange): { from: Date; to: Date } {
  const now = new Date()
  const to = new Date(now)
  let from: Date

  switch (timeRange.preset) {
    case '7d':
      from = new Date(now)
      from.setDate(from.getDate() - 7)
      break
    case '30d':
      from = new Date(now)
      from.setDate(from.getDate() - 30)
      break
    case '90d':
      from = new Date(now)
      from.setDate(from.getDate() - 90)
      break
    case 'ytd':
      from = new Date(now.getFullYear(), 0, 1)
      break
    case 'all':
      from = new Date(2000, 0, 1) // Far past date
      break
    case 'custom':
      from = timeRange.from ?? new Date(2000, 0, 1)
      break
    default:
      from = new Date(now)
      from.setDate(from.getDate() - 30)
  }

  return { from, to: timeRange.to ?? to }
}

// Helper to calculate days between dates
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Fetch all advanced analytics data
async function fetchAdvancedAnalyticsData(orgId: string) {
  const [inventoryResult, transactionsResult] = await Promise.all([
    supabase.from('inventory').select('*').eq('organization_id', orgId),
    supabase
      .from('transactions')
      .select('*, transaction_items(*)')
      .eq('organization_id', orgId)
      .eq('status', 'COMPLETED'),
  ])

  if (inventoryResult.error) throw inventoryResult.error
  if (transactionsResult.error) throw transactionsResult.error

  return {
    inventory: inventoryResult.data as InventoryItem[],
    transactions: transactionsResult.data as unknown as TransactionWithItems[],
  }
}

// Calculate set profitability
function calculateSetProfitability(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date }
): SetProfitability[] {
  const setMap = new Map<string, SetProfitability>()

  // Get all items sold in date range
  const soldItems = new Map<string, { sellDate: Date; revenue: number; fees: number }>()

  transactions
    .filter((t) => {
      const txDate = new Date(t.transaction_date)
      return t.type === 'SELL' && txDate >= dateRange.from && txDate <= dateRange.to
    })
    .forEach((t) => {
      t.transaction_items
        .filter((item) => item.direction === 'OUT')
        .forEach((item) => {
          if (item.inventory_id) {
            // Calculate proportional fees
            const totalValue = t.transaction_items
              .filter((i) => i.direction === 'OUT')
              .reduce((sum, i) => sum + i.total_value, 0)
            const itemFees = totalValue > 0 ? (t.fees * item.total_value) / totalValue : 0

            soldItems.set(item.inventory_id, {
              sellDate: new Date(t.transaction_date),
              revenue: item.total_value,
              fees: itemFees,
            })
          }
        })
    })

  // Process inventory items
  inventory.forEach((item) => {
    const setName = item.set_name || 'Unknown Set'
    const existing = setMap.get(setName) || {
      setName,
      game: item.game_type,
      itemsSold: 0,
      itemsInStock: 0,
      totalCost: 0,
      totalRevenue: 0,
      totalFees: 0,
      netProfit: 0,
      roi: 0,
      avgDaysToSell: null,
    }

    if (item.status === 'SOLD') {
      const saleInfo = soldItems.get(item.id)
      if (saleInfo) {
        existing.itemsSold++
        existing.totalCost += item.acquisition_cost
        existing.totalRevenue += saleInfo.revenue
        existing.totalFees += saleInfo.fees
      }
    } else {
      existing.itemsInStock++
      existing.totalCost += item.acquisition_cost
    }

    setMap.set(setName, existing)
  })

  // Calculate final metrics
  return Array.from(setMap.values())
    .map((set) => {
      const netProfit = set.totalRevenue - set.totalCost - set.totalFees
      const roi = set.totalCost > 0 ? (netProfit / set.totalCost) * 100 : 0
      return {
        ...set,
        netProfit,
        roi: Math.round(roi * 10) / 10,
      }
    })
    .sort((a, b) => b.netProfit - a.netProfit)
}

// Calculate platform profitability
function calculatePlatformProfitability(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date }
): PlatformProfitability[] {
  const platformMap = new Map<string, PlatformProfitability>()

  // Get inventory cost map
  const inventoryCostMap = new Map<string, number>()
  inventory.forEach((item) => {
    inventoryCostMap.set(item.id, item.acquisition_cost)
  })

  // Process sell transactions in date range
  transactions
    .filter((t) => {
      const txDate = new Date(t.transaction_date)
      return t.type === 'SELL' && txDate >= dateRange.from && txDate <= dateRange.to
    })
    .forEach((t) => {
      const platform = t.platform || 'Other'
      const existing = platformMap.get(platform) || {
        platform,
        transactionCount: 0,
        itemsSold: 0,
        totalRevenue: 0,
        totalFees: 0,
        netProfit: 0,
        avgSalePrice: 0,
        avgProfit: 0,
        feePercentage: 0,
      }

      existing.transactionCount++

      const outItems = t.transaction_items.filter((item) => item.direction === 'OUT')
      outItems.forEach((item) => {
        existing.itemsSold += item.quantity
        existing.totalRevenue += item.total_value

        // Calculate cost from inventory
        const cost = item.inventory_id ? (inventoryCostMap.get(item.inventory_id) ?? 0) : 0
        existing.netProfit += item.total_value - cost
      })

      existing.totalFees += t.fees

      platformMap.set(platform, existing)
    })

  // Calculate final metrics
  return Array.from(platformMap.values())
    .map((p) => {
      p.netProfit -= p.totalFees
      p.avgSalePrice = p.itemsSold > 0 ? p.totalRevenue / p.itemsSold : 0
      p.avgProfit = p.itemsSold > 0 ? p.netProfit / p.itemsSold : 0
      p.feePercentage = p.totalRevenue > 0 ? (p.totalFees / p.totalRevenue) * 100 : 0
      return p
    })
    .sort((a, b) => b.netProfit - a.netProfit)
}

// Calculate inventory aging
function calculateInventoryAging(inventory: InventoryItem[]): InventoryAgingBucket[] {
  const now = new Date()
  const buckets: Record<AgingBucket, { items: InventoryItem[]; totalValue: number }> = {
    fresh: { items: [], totalValue: 0 },
    aging: { items: [], totalValue: 0 },
    stale: { items: [], totalValue: 0 },
    dead: { items: [], totalValue: 0 },
  }

  // Only count unsold inventory
  const unsoldInventory = inventory.filter((item) => item.status !== 'SOLD')

  unsoldInventory.forEach((item) => {
    const daysOld = daysBetween(new Date(item.created_at), now)
    const value = item.acquisition_cost

    let bucket: AgingBucket
    if (daysOld <= 30) {
      bucket = 'fresh'
    } else if (daysOld <= 90) {
      bucket = 'aging'
    } else if (daysOld <= 180) {
      bucket = 'stale'
    } else {
      bucket = 'dead'
    }

    buckets[bucket].items.push(item)
    buckets[bucket].totalValue += value
  })

  const totalItems = unsoldInventory.length

  const agingBucketConfig: Record<AgingBucket, { label: string; daysRange: string; color: string }> = {
    fresh: { label: 'Fresh', daysRange: '0-30 days', color: 'bg-emerald-500' },
    aging: { label: 'Aging', daysRange: '31-90 days', color: 'bg-yellow-500' },
    stale: { label: 'Stale', daysRange: '91-180 days', color: 'bg-orange-500' },
    dead: { label: 'Dead Stock', daysRange: '180+ days', color: 'bg-red-500' },
  }

  return (['fresh', 'aging', 'stale', 'dead'] as AgingBucket[]).map((bucket) => ({
    bucket,
    label: agingBucketConfig[bucket].label,
    daysRange: agingBucketConfig[bucket].daysRange,
    itemCount: buckets[bucket].items.length,
    totalValue: buckets[bucket].totalValue,
    percentage: totalItems > 0 ? (buckets[bucket].items.length / totalItems) * 100 : 0,
    color: agingBucketConfig[bucket].color,
  }))
}

// Calculate sell-through rate
function calculateSellThrough(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date }
): SellThroughMetrics {
  // Calculate current period metrics
  const periodDays = daysBetween(dateRange.from, dateRange.to)

  // Get items that were available during the period
  const itemsAvailable = inventory.filter((item) => {
    const createdAt = new Date(item.created_at)
    return createdAt <= dateRange.to
  }).length

  // Get items sold in the period
  const itemsSold = transactions
    .filter((t) => {
      const txDate = new Date(t.transaction_date)
      return t.type === 'SELL' && txDate >= dateRange.from && txDate <= dateRange.to
    })
    .reduce((count, t) => {
      return count + t.transaction_items.filter((i) => i.direction === 'OUT').reduce((sum, i) => sum + i.quantity, 0)
    }, 0)

  // Calculate sell-through rate
  const currentRate = itemsAvailable > 0 ? (itemsSold / itemsAvailable) * 100 : 0

  // Calculate previous period for trend
  const prevFrom = new Date(dateRange.from)
  prevFrom.setDate(prevFrom.getDate() - periodDays)
  const prevTo = new Date(dateRange.from)
  prevTo.setDate(prevTo.getDate() - 1)

  const prevItemsAvailable = inventory.filter((item) => {
    const createdAt = new Date(item.created_at)
    return createdAt <= prevTo
  }).length

  const prevItemsSold = transactions
    .filter((t) => {
      const txDate = new Date(t.transaction_date)
      return t.type === 'SELL' && txDate >= prevFrom && txDate <= prevTo
    })
    .reduce((count, t) => {
      return count + t.transaction_items.filter((i) => i.direction === 'OUT').reduce((sum, i) => sum + i.quantity, 0)
    }, 0)

  const previousRate = prevItemsAvailable > 0 ? (prevItemsSold / prevItemsAvailable) * 100 : 0

  // Determine trend
  let trend: 'up' | 'down' | 'stable' = 'stable'
  const diff = currentRate - previousRate
  if (diff > 1) trend = 'up'
  else if (diff < -1) trend = 'down'

  // Calculate average days to sell for sold items
  let totalDaysToSell = 0
  let soldCount = 0

  transactions
    .filter((t) => t.type === 'SELL')
    .forEach((t) => {
      t.transaction_items
        .filter((item) => item.direction === 'OUT' && item.inventory_id)
        .forEach((item) => {
          const invItem = inventory.find((i) => i.id === item.inventory_id)
          if (invItem) {
            const days = daysBetween(new Date(invItem.created_at), new Date(t.transaction_date))
            totalDaysToSell += days
            soldCount++
          }
        })
    })

  const avgDaysToSell = soldCount > 0 ? Math.round(totalDaysToSell / soldCount) : 0
  const velocity = periodDays > 0 ? itemsSold / periodDays : 0

  // Calculate by condition
  const byCondition: Partial<Record<string, number>> = {}
  const conditionCounts: Record<string, { sold: number; available: number }> = {}

  inventory.forEach((item) => {
    const condition = item.condition
    if (!conditionCounts[condition]) {
      conditionCounts[condition] = { sold: 0, available: 0 }
    }
    if (item.status === 'SOLD') {
      conditionCounts[condition].sold++
    }
    conditionCounts[condition].available++
  })

  Object.entries(conditionCounts).forEach(([condition, counts]) => {
    byCondition[condition] = counts.available > 0 ? (counts.sold / counts.available) * 100 : 0
  })

  return {
    currentRate: Math.round(currentRate * 10) / 10,
    previousRate: Math.round(previousRate * 10) / 10,
    trend,
    avgDaysToSell,
    velocity: Math.round(velocity * 10) / 10,
    byCondition,
  }
}

// Advanced analytics hook with time range support
export function useAdvancedAnalytics(timeRange: TimeRange = { preset: '30d' }) {
  const dateRange = useMemo(() => resolveDateRange(timeRange), [timeRange])

  const query = useQuery({
    queryKey: ['analytics', 'advanced', timeRange.preset, dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) {
        return {
          setProfitability: [],
          platformProfitability: [],
          inventoryAging: [],
          sellThrough: null,
        }
      }

      const { inventory, transactions } = await fetchAdvancedAnalyticsData(orgId)

      return {
        setProfitability: calculateSetProfitability(inventory, transactions, dateRange),
        platformProfitability: calculatePlatformProfitability(inventory, transactions, dateRange),
        inventoryAging: calculateInventoryAging(inventory),
        sellThrough: calculateSellThrough(inventory, transactions, dateRange),
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    setProfitability: query.data?.setProfitability ?? [],
    platformProfitability: query.data?.platformProfitability ?? [],
    inventoryAging: query.data?.inventoryAging ?? [],
    sellThrough: query.data?.sellThrough ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// Individual hooks for specific analytics
export function useSetProfitability(timeRange: TimeRange = { preset: '30d' }) {
  const { setProfitability, isLoading, error, refetch } = useAdvancedAnalytics(timeRange)
  return { data: setProfitability, isLoading, error, refetch }
}

export function usePlatformProfitability(timeRange: TimeRange = { preset: '30d' }) {
  const { platformProfitability, isLoading, error, refetch } = useAdvancedAnalytics(timeRange)
  return { data: platformProfitability, isLoading, error, refetch }
}

export function useInventoryAging() {
  const { inventoryAging, isLoading, error, refetch } = useAdvancedAnalytics({ preset: 'all' })
  return { data: inventoryAging, isLoading, error, refetch }
}

export function useSellThrough(timeRange: TimeRange = { preset: '30d' }) {
  const { sellThrough, isLoading, error, refetch } = useAdvancedAnalytics(timeRange)
  return { data: sellThrough, isLoading, error, refetch }
}
