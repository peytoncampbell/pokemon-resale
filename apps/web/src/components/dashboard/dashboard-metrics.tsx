'use client'

import { MetricCard } from './metric-card'
import { SkeletonMetricCard } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp, Wallet, BarChart3, PiggyBank } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'
import { useBusinessSettings } from '@/hooks/use-business-settings'
import { useCurrency } from '@/hooks/use-currency'
import { calculateROI } from '@/lib/utils'

export function DashboardMetrics() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics()
  const { data: businessSettings, isLoading: settingsLoading } = useBusinessSettings()
  const { formatConverted } = useCurrency()

  const isLoading = analyticsLoading || settingsLoading

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    )
  }

  // Tracked data (from app usage)
  const trackedInvested = analytics?.totalInvested || 0
  const trackedRevenue = analytics?.totalRevenue || 0
  const trackedProfit = analytics?.totalProfit || 0
  const inventoryValue = analytics?.totalInventoryValue || 0
  const itemsSold = analytics?.itemsSold || 0
  const totalItems = analytics?.totalItems || 0

  // Historical data (from business settings)
  const historicalRevenue = businessSettings?.historical_revenue || 0
  const historicalProfit = businessSettings?.historical_profit || 0
  const historicalInventoryCost = businessSettings?.historical_inventory_cost || 0
  const initialInvestment = businessSettings?.initial_investment || 0
  const cashReserves = businessSettings?.cash_reserves || 0

  // Combined totals (historical + tracked)
  const totalInvested = trackedInvested + historicalInventoryCost + initialInvestment
  const totalRevenue = trackedRevenue + historicalRevenue
  const totalProfit = trackedProfit + historicalProfit

  // Calculate ROI based on all invested capital vs total profit
  const investedCapital = totalInvested - inventoryValue // Capital that's been "used" (not still in inventory)
  const roi = investedCapital > 0 ? calculateROI(totalProfit, investedCapital) : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Inventory Value"
        value={formatConverted(inventoryValue)}
        icon={DollarSign}
        iconColor="blue"
        trend={{ value: `${totalItems} items in stock`, isPositive: true }}
      />
      <MetricCard
        title="Total Revenue"
        value={formatConverted(totalRevenue)}
        icon={Wallet}
        iconColor="green"
        trend={
          itemsSold > 0
            ? { value: `${itemsSold} items sold`, isPositive: true }
            : historicalRevenue > 0
            ? { value: `Includes ${formatConverted(historicalRevenue)} historical`, isPositive: true }
            : undefined
        }
      />
      <MetricCard
        title="Total Profit"
        value={formatConverted(totalProfit)}
        icon={TrendingUp}
        iconColor={totalProfit >= 0 ? 'cyan' : 'orange'}
        trend={
          roi !== 0
            ? {
                value: `${roi > 0 ? '+' : ''}${roi.toFixed(1)}% ROI`,
                isPositive: roi > 0,
              }
            : undefined
        }
      />
      <MetricCard
        title="Cash Reserves"
        value={formatConverted(cashReserves)}
        icon={PiggyBank}
        iconColor="purple"
        trend={
          totalInvested > 0
            ? { value: `${formatConverted(totalInvested)} invested`, isPositive: true }
            : undefined
        }
      />
    </div>
  )
}
