'use client'

import { MetricCard } from './metric-card'
import { SkeletonMetricCard } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp, BarChart3, Receipt } from 'lucide-react'
import { useDashboard } from '@/hooks/use-dashboard'
import { useCurrency } from '@/hooks/use-currency'

export function PortfolioMetrics() {
  const dashboard = useDashboard()
  const { formatConverted } = useCurrency()

  if (dashboard.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    )
  }

  const { portfolioValue, realizedProfit, unrealizedGain, itemCount } = dashboard

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  )
}
