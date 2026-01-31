'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlatformProfitability, type TimeRange } from '@/hooks/use-analytics'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import { Store, ShoppingCart, Users, MapPin, MoreHorizontal } from 'lucide-react'
import { TIME_RANGE_OPTIONS } from '@/types/analytics'

interface ProfitByPlatformWidgetProps {
  className?: string
}

const PLATFORM_CONFIG: Record<string, { icon: typeof Store; color: string; bgColor: string }> = {
  TCGPlayer: { icon: ShoppingCart, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  eBay: { icon: Store, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  Facebook: { icon: Users, color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  Local: { icon: MapPin, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  Other: { icon: MoreHorizontal, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
}

export function ProfitByPlatformWidget({ className }: ProfitByPlatformWidgetProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>({ preset: '30d' })
  const { data, isLoading } = usePlatformProfitability(timeRange)
  const { formatPrice } = useCurrency()

  const totalProfit = data.reduce((sum, p) => sum + p.netProfit, 0)
  const totalRevenue = data.reduce((sum, p) => sum + p.totalRevenue, 0)

  if (isLoading) {
    return <ProfitByPlatformSkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Profit by Platform</CardTitle>
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
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Store className="h-8 w-8 mb-2" />
            <p className="text-sm">No sales data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="space-y-3">
              {data.map((platform) => {
                const config = PLATFORM_CONFIG[platform.platform] || PLATFORM_CONFIG.Other
                const Icon = config.icon
                const percentage = totalProfit > 0 ? (platform.netProfit / totalProfit) * 100 : 0
                const barWidth = Math.max(percentage, 0)

                return (
                  <div key={platform.platform} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1.5 rounded-lg', config.bgColor)}>
                          <Icon className={cn('h-3.5 w-3.5', config.color)} />
                        </div>
                        <span className="text-sm text-white font-medium">{platform.platform}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span
                          className={cn(
                            'font-semibold',
                            platform.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                          )}
                        >
                          {formatPrice(platform.netProfit)}
                        </span>
                        <span className="text-white/50 w-12 text-right">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          platform.netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Total Profit</p>
                <p
                  className={cn(
                    'text-lg font-bold',
                    totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {formatPrice(totalProfit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Avg Fee</p>
                <p className="text-lg font-bold text-white">
                  {totalRevenue > 0
                    ? (
                        (data.reduce((sum, p) => sum + p.totalFees, 0) / totalRevenue) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProfitByPlatformSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
        <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
