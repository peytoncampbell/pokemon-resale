'use client'

import { SalesChart } from './sales-chart'
import { SkeletonChart } from '@/components/ui/skeleton'
import { useAnalytics } from '@/hooks/use-analytics'
import { useMemo } from 'react'

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
