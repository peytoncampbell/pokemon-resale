'use client'

import dynamic from 'next/dynamic'
import { SkeletonChart } from '@/components/ui/skeleton'
import { useAnalytics } from '@/hooks/use-analytics'
import { useMemo } from 'react'

// Dynamic import to code-split recharts (7.8MB) from initial bundle
const SalesChart = dynamic(
  () => import('./sales-chart').then((m) => m.SalesChart),
  {
    loading: () => <SkeletonChart />,
    ssr: false,
  }
)

export function SalesChartWrapper() {
  const { data: analytics, isLoading } = useAnalytics()

  const salesData = useMemo(() => {
    return (
      analytics?.recentActivity?.map((day) => ({
        month: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: day.value,
      })) || []
    )
  }, [analytics?.recentActivity])

  if (isLoading) {
    return <SkeletonChart />
  }

  return (
    <SalesChart
      data={salesData.length > 0 ? salesData : undefined}
      title="Sales overview"
      subtitle={`(+${analytics?.itemsSold || 0}) items sold`}
    />
  )
}
