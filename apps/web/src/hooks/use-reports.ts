import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'

export interface ProfitByCondition {
  condition: string
  items_count: number
  total_cost: number
  total_revenue: number
  total_profit: number
  profit_margin: number
}

export interface SupplierROI {
  supplier_id: string
  supplier_name: string
  total_orders: number
  total_spent: number
  items_sold: number
  total_revenue: number
  total_profit: number
  roi_percentage: number
}

export interface SlowMovingItem {
  id: string
  card_id: string
  card_name: string
  card_image: string | null
  set_name: string | null
  condition: string
  location: string
  acquisition_cost: number
  days_in_inventory: number
  status: string
}

export interface PlatformPerformance {
  platform: string
  sales_count: number
  total_revenue: number
  total_fees: number
  avg_sale_price: number
  total_profit: number
}

export interface DateRange {
  start: Date
  end: Date
}

export function useProfitByCondition(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'profit-by-condition', dateRange],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      let query = supabase
        .from('inventory')
        .select(`
          id,
          condition,
          acquisition_cost,
          status,
          sales (
            id,
            sale_price,
            fees,
            shipping_cost,
            sold_at
          )
        `)
        .eq('organization_id', orgId)

      const { data, error } = await query

      if (error) throw error

      const conditionStats: Record<string, ProfitByCondition> = {}
      const conditions = ['NM', 'LP', 'MP', 'HP', 'DMG']
      conditions.forEach(c => {
        conditionStats[c] = {
          condition: c,
          items_count: 0,
          total_cost: 0,
          total_revenue: 0,
          total_profit: 0,
          profit_margin: 0,
        }
      })

      data?.forEach((item: { condition: string; acquisition_cost: number; sales: Array<{ sale_price: number; fees: number; shipping_cost: number; sold_at: string }> }) => {
        const stats = conditionStats[item.condition]
        if (!stats) return

        stats.items_count++
        stats.total_cost += item.acquisition_cost

        if (item.sales && item.sales.length > 0) {
          item.sales.forEach(sale => {
            if (dateRange) {
              const saleDate = new Date(sale.sold_at)
              if (saleDate < dateRange.start || saleDate > dateRange.end) return
            }
            stats.total_revenue += sale.sale_price
            stats.total_profit += sale.sale_price - sale.fees - sale.shipping_cost - item.acquisition_cost
          })
        }
      })

      return Object.values(conditionStats).map(stats => ({
        ...stats,
        profit_margin: stats.total_revenue > 0
          ? ((stats.total_profit / stats.total_revenue) * 100)
          : 0,
      }))
    },
  })
}

export function useSupplierROI() {
  return useQuery({
    queryKey: ['reports', 'supplier-roi'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data: procurements, error: procError } = await supabase
        .from('procurements')
        .select(`
          id,
          supplier,
          supplier_id,
          total,
          status,
          inventory (
            id,
            acquisition_cost,
            status,
            sales (
              id,
              sale_price,
              fees,
              shipping_cost
            )
          )
        `)
        .eq('organization_id', orgId)
        .neq('status', 'CANCELLED')

      if (procError) throw procError

      const supplierStats: Record<string, SupplierROI> = {}

      procurements?.forEach((proc: {
        supplier: string
        supplier_id: string | null
        total: number
        inventory: Array<{
          status: string
          acquisition_cost: number
          sales: Array<{ sale_price: number; fees: number; shipping_cost: number }>
        }>
      }) => {
        const key = proc.supplier_id || proc.supplier
        if (!supplierStats[key]) {
          supplierStats[key] = {
            supplier_id: proc.supplier_id || '',
            supplier_name: proc.supplier,
            total_orders: 0,
            total_spent: 0,
            items_sold: 0,
            total_revenue: 0,
            total_profit: 0,
            roi_percentage: 0,
          }
        }

        const stats = supplierStats[key]
        stats.total_orders++
        stats.total_spent += proc.total

        proc.inventory?.forEach(item => {
          if (item.status === 'SOLD' && item.sales?.length > 0) {
            stats.items_sold++
            item.sales.forEach(sale => {
              stats.total_revenue += sale.sale_price
              stats.total_profit += sale.sale_price - sale.fees - sale.shipping_cost - item.acquisition_cost
            })
          }
        })
      })

      return Object.values(supplierStats).map(stats => ({
        ...stats,
        roi_percentage: stats.total_spent > 0
          ? ((stats.total_profit / stats.total_spent) * 100)
          : 0,
      })).sort((a, b) => b.roi_percentage - a.roi_percentage)
    },
  })
}

export function useSlowMovingInventory(daysThreshold: number = 30) {
  return useQuery({
    queryKey: ['reports', 'slow-moving', daysThreshold],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const thresholdDate = new Date()
      thresholdDate.setDate(thresholdDate.getDate() - daysThreshold)

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('organization_id', orgId)
        .in('status', ['IN_STOCK', 'LISTED'])
        .lt('created_at', thresholdDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      return data.map(item => ({
        ...item,
        days_in_inventory: Math.floor((Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      })) as SlowMovingItem[]
    },
  })
}

export function usePlatformPerformance(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['reports', 'platform-performance', dateRange],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      let query = supabase
        .from('sales')
        .select(`
          id,
          platform,
          sale_price,
          fees,
          shipping_cost,
          sold_at,
          inventory (
            acquisition_cost
          )
        `)
        .eq('organization_id', orgId)

      if (dateRange) {
        query = query
          .gte('sold_at', dateRange.start.toISOString())
          .lte('sold_at', dateRange.end.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      const platformStats: Record<string, PlatformPerformance> = {}

      data?.forEach((sale: {
        platform: string | null
        sale_price: number
        fees: number
        shipping_cost: number
        inventory: { acquisition_cost: number } | null
      }) => {
        const platform = sale.platform || 'Other'
        if (!platformStats[platform]) {
          platformStats[platform] = {
            platform,
            sales_count: 0,
            total_revenue: 0,
            total_fees: 0,
            avg_sale_price: 0,
            total_profit: 0,
          }
        }

        const stats = platformStats[platform]
        stats.sales_count++
        stats.total_revenue += sale.sale_price
        stats.total_fees += sale.fees

        const cost = sale.inventory?.acquisition_cost || 0
        stats.total_profit += sale.sale_price - sale.fees - sale.shipping_cost - cost
      })

      return Object.values(platformStats).map(stats => ({
        ...stats,
        avg_sale_price: stats.sales_count > 0
          ? stats.total_revenue / stats.sales_count
          : 0,
      })).sort((a, b) => b.total_revenue - a.total_revenue)
    },
  })
}

export function useMonthlySummary(year: number, month: number) {
  return useQuery({
    queryKey: ['reports', 'monthly-summary', year, month],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return null

      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59)

      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          sale_price,
          fees,
          shipping_cost,
          inventory (acquisition_cost)
        `)
        .eq('organization_id', orgId)
        .gte('sold_at', startDate.toISOString())
        .lte('sold_at', endDate.toISOString())

      if (salesError) throw salesError

      const { data: procurements, error: procError } = await supabase
        .from('procurements')
        .select('total')
        .eq('organization_id', orgId)
        .neq('status', 'CANCELLED')
        .gte('order_date', startDate.toISOString().split('T')[0])
        .lte('order_date', endDate.toISOString().split('T')[0])

      if (procError) throw procError

      const totalRevenue = sales?.reduce((sum, s) => sum + s.sale_price, 0) || 0
      const totalFees = sales?.reduce((sum, s) => sum + s.fees + s.shipping_cost, 0) || 0
      const totalCOGS = sales?.reduce((sum, s) => sum + (s.inventory?.acquisition_cost || 0), 0) || 0
      const totalProfit = totalRevenue - totalFees - totalCOGS
      const totalSpent = procurements?.reduce((sum, p) => sum + p.total, 0) || 0

      return {
        period: `${year}-${String(month).padStart(2, '0')}`,
        sales_count: sales?.length || 0,
        total_revenue: totalRevenue,
        total_fees: totalFees,
        total_cogs: totalCOGS,
        total_profit: totalProfit,
        profit_margin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
        procurement_spend: totalSpent,
        net_cashflow: totalRevenue - totalSpent,
      }
    },
  })
}
