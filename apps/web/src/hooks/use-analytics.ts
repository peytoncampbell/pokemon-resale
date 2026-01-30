import { useQuery } from '@tanstack/react-query'
import { supabase, InventoryItem, Sale } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

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

  // Get all sales
  const { data: salesData, error: salesError } = await supabase
    .from('sales')
    .select('*')
    .eq('organization_id', orgId)

  if (salesError) throw salesError
  const sales = salesData as Sale[] | null

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

  // Calculate sales metrics
  const totalRevenue = sales?.reduce((sum, sale) => sum + sale.sale_price, 0) || 0

  const totalSalesFees =
    sales?.reduce((sum, sale) => sum + (sale.fees || 0) + (sale.shipping_cost || 0), 0) || 0

  // Get cost of sold items
  const soldItemIds = sales?.map((s) => s.inventory_id).filter(Boolean) || []
  const soldItemsCost =
    inventory
      ?.filter((item) => soldItemIds.includes(item.id))
      .reduce((sum, item) => sum + item.acquisition_cost, 0) || 0

  const totalProfit = totalRevenue - soldItemsCost - totalSalesFees

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
    // Analytics data doesn't change frequently, cache for 5 minutes
    staleTime: 5 * 60 * 1000,
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
