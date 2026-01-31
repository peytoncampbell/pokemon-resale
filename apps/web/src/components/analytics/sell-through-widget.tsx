'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSellThrough, type TimeRange } from '@/hooks/use-analytics'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Activity, Clock, Zap } from 'lucide-react'
import { TIME_RANGE_OPTIONS } from '@/types/analytics'

interface SellThroughWidgetProps {
  className?: string
}

export function SellThroughWidget({ className }: SellThroughWidgetProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>({ preset: '30d' })
  const { data, isLoading } = useSellThrough(timeRange)

  if (isLoading) {
    return <SellThroughSkeleton className={className} />
  }

  if (!data) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Sell-Through Rate</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Activity className="h-8 w-8 mb-2" />
            <p className="text-sm">No sales data yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const TrendIcon =
    data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus
  const trendColor =
    data.trend === 'up'
      ? 'text-emerald-400'
      : data.trend === 'down'
        ? 'text-red-400'
        : 'text-white/50'

  // Determine sell-through health
  const getHealthStatus = (rate: number) => {
    if (rate >= 20) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    if (rate >= 10) return { label: 'Good', color: 'text-green-400', bg: 'bg-green-500/20' }
    if (rate >= 5) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    return { label: 'Slow', color: 'text-orange-400', bg: 'bg-orange-500/20' }
  }

  const health = getHealthStatus(data.currentRate)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sell-Through Rate</CardTitle>
          <select
            value={timeRange.preset}
            onChange={(e) => setTimeRange({ preset: e.target.value as TimeRange['preset'] })}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-vision-blue"
          >
            {TIME_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-vision-navy">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Main Rate Display */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{data.currentRate.toFixed(1)}%</span>
              <div className={cn('flex items-center gap-1', trendColor)}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {data.trend === 'stable'
                    ? 'Stable'
                    : `${data.trend === 'up' ? '+' : ''}${(data.currentRate - data.previousRate).toFixed(1)}%`}
                </span>
              </div>
            </div>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', health.bg, health.color)}>
              {health.label}
            </span>
          </div>

          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="8"
                className="stroke-white/10"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="8"
                className={cn(
                  'transition-all duration-500',
                  data.currentRate >= 20
                    ? 'stroke-emerald-500'
                    : data.currentRate >= 10
                      ? 'stroke-green-500'
                      : data.currentRate >= 5
                        ? 'stroke-yellow-500'
                        : 'stroke-orange-500'
                )}
                strokeDasharray={`${Math.min(data.currentRate, 100) * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <Clock className="h-3 w-3" />
              <span>Avg Days to Sell</span>
            </div>
            <p className="text-xl font-bold text-white">
              {data.avgDaysToSell > 0 ? data.avgDaysToSell : '-'}
              {data.avgDaysToSell > 0 && <span className="text-sm font-normal text-white/50"> days</span>}
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <Zap className="h-3 w-3" />
              <span>Velocity</span>
            </div>
            <p className="text-xl font-bold text-white">
              {data.velocity.toFixed(1)}
              <span className="text-sm font-normal text-white/50"> /day</span>
            </p>
          </div>
        </div>

        {/* Condition Breakdown */}
        {Object.keys(data.byCondition).length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">By Condition</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.byCondition).map(([condition, rate]) => (
                <div
                  key={condition}
                  className="px-2 py-1 bg-white/5 rounded-lg text-xs"
                >
                  <span className="text-white/70">{condition}</span>
                  <span className="ml-1.5 font-medium text-white">{(rate as number).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SellThroughSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}
