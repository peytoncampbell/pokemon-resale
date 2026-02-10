'use client'

import { MetricCard } from './metric-card'
import { SkeletonMetricCard } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp, BarChart3, Receipt, Bell } from 'lucide-react'
import { useDashboard } from '@/hooks/use-dashboard'
import { useCurrency } from '@/hooks/use-currency'
import { usePriceAlerts } from '@/hooks/use-price-alerts'

export function PortfolioMetrics() {
  const dashboard = useDashboard()
  const { formatConverted } = useCurrency()
  const { data: allAlerts } = usePriceAlerts()
  const activeAlerts = allAlerts?.filter((a) => a.isActive && !a.isTriggered) ?? []
  const triggeredAlerts = allAlerts?.filter((a) => a.isTriggered) ?? []

  if (dashboard.isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    )
  }

  const { portfolioValue, realizedProfit, unrealizedGain, itemCount } = dashboard

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
      <MetricCard
        title="Portfolio Value"
        value={formatConverted(portfolioValue)}
        icon={DollarSign}
        iconColor="blue"
        trend={{ value: `${itemCount} items`, isPositive: true }}
      />
      <MetricCard
        title="Realized Profit"
        value={formatConverted(realizedProfit.netProfit)}
        icon={TrendingUp}
        iconColor={realizedProfit.netProfit >= 0 ? 'green' : 'orange'}
        trend={
          realizedProfit.itemsSold > 0
            ? { value: `${realizedProfit.itemsSold} sold`, isPositive: true }
            : undefined
        }
      />
      <MetricCard
        title="Unrealized Gain"
        value={formatConverted(unrealizedGain.totalGain)}
        icon={BarChart3}
        iconColor={unrealizedGain.totalGain >= 0 ? 'cyan' : 'orange'}
        trend={
          unrealizedGain.totalCostBasis > 0
            ? {
                value: `${formatConverted(unrealizedGain.totalCostBasis)} invested`,
                isPositive: true,
              }
            : undefined
        }
      />
      <MetricCard
        title="Total Fees Paid"
        value={formatConverted(realizedProfit.totalFees)}
        icon={Receipt}
        iconColor="purple"
        trend={
          realizedProfit.totalSales > 0
            ? {
                value: `${formatConverted(realizedProfit.totalSales)} sales`,
                isPositive: true,
              }
            : undefined
        }
      />
      <MetricCard
        title="Active Alerts"
        value={String(activeAlerts.length)}
        icon={Bell}
        iconColor="orange"
        trend={
          triggeredAlerts.length > 0
            ? { value: `${triggeredAlerts.length} triggered`, isPositive: false }
            : undefined
        }
      />
    </div>
  )
}
