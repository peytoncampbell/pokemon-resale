'use client'

import { MetricCard } from './metric-card'
import { SkeletonMetricCard } from '@/components/ui/skeleton'
import { DollarSign, Package, TrendingUp, ShoppingCart } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'
import { formatCurrency } from '@/lib/utils'
import { useCurrency } from '@/hooks/use-currency'

export function DashboardMetrics() {
  const { data: analytics, isLoading } = useAnalytics()
  const { currency } = useCurrency()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Inventory Value"
        value={formatCurrency(analytics?.totalInventoryValue || 0, currency)}
        icon={DollarSign}
        iconColor="blue"
        trend={{ value: `${analytics?.totalItems || 0} items`, isPositive: true }}
      />
      <MetricCard
        title="Total Invested"
        value={formatCurrency(analytics?.totalInvested || 0, currency)}
        icon={Package}
        iconColor="green"
      />
      <MetricCard
        title="Items Sold"
        value={String(analytics?.itemsSold || 0)}
        icon={TrendingUp}
        iconColor="orange"
        trend={
          analytics?.totalProfit
            ? {
                value: `${formatCurrency(analytics.totalProfit, currency)} profit`,
                isPositive: analytics.totalProfit > 0,
              }
            : undefined
        }
      />
      <MetricCard
        title="Pending Orders"
        value={String(analytics?.pendingProcurements || 0)}
        icon={ShoppingCart}
        iconColor="purple"
      />
    </div>
  )
}
