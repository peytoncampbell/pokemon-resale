import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

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

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async (): Promise<AnalyticsSummary> => {
      const userId = await getCurrentUserId()

      // Get all inventory items
      const { data: inventory, error: invError } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', userId)

      if (invError) throw invError

      // Get all sales
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', userId)

      if (salesError) throw salesError

      // Get pending procurements count
      const { count: pendingProcurements, error: procError } = await supabase
        .from('procurements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'PENDING')

      if (procError) throw procError

      // Calculate inventory metrics
      const activeInventory = inventory?.filter(
        (item) => item.status === 'IN_STOCK' || item.status === 'LISTED'
      ) || []

      const totalInventoryValue = activeInventory.reduce(
        (sum, item) => sum + (item.acquisition_cost * item.quantity),
        0
      )

      const totalItems = activeInventory.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      const totalInvested = inventory?.reduce(
        (sum, item) => sum + (item.acquisition_cost * item.quantity),
        0
      ) || 0

      const itemsSold = inventory?.filter(item => item.status === 'SOLD').length || 0

      // Calculate sales metrics
      const totalRevenue = sales?.reduce(
        (sum, sale) => sum + sale.sale_price,
        0
      ) || 0

      const totalSalesFees = sales?.reduce(
        (sum, sale) => sum + (sale.fees || 0) + (sale.shipping_cost || 0),
        0
      ) || 0

      // Get cost of sold items
      const soldItemIds = sales?.map(s => s.inventory_id).filter(Boolean) || []
      const soldItemsCost = inventory
        ?.filter(item => soldItemIds.includes(item.id))
        .reduce((sum, item) => sum + item.acquisition_cost, 0) || 0

      const totalProfit = totalRevenue - soldItemsCost - totalSalesFees

      // Inventory by status
      const inventoryByStatus = {
        IN_STOCK: inventory?.filter(i => i.status === 'IN_STOCK').reduce((s, i) => s + i.quantity, 0) || 0,
        LISTED: inventory?.filter(i => i.status === 'LISTED').reduce((s, i) => s + i.quantity, 0) || 0,
        SOLD: inventory?.filter(i => i.status === 'SOLD').reduce((s, i) => s + i.quantity, 0) || 0,
      }

      // Inventory by condition
      const inventoryByCondition: Record<string, number> = {}
      inventory?.forEach(item => {
        const condition = item.condition || 'NM'
        inventoryByCondition[condition] = (inventoryByCondition[condition] || 0) + item.quantity
      })

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentItems = inventory?.filter(
        item => new Date(item.created_at) >= sevenDaysAgo
      ) || []

      const activityByDate: Record<string, { itemsAdded: number; value: number }> = {}
      recentItems.forEach(item => {
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
    },
  })
}
