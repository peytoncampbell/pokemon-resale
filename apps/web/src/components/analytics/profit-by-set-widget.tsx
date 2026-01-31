'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSetProfitability, type TimeRange } from '@/hooks/use-analytics'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Package } from 'lucide-react'
import { TIME_RANGE_OPTIONS } from '@/types/analytics'

interface ProfitBySetWidgetProps {
  className?: string
  limit?: number
}

export function ProfitBySetWidget({ className, limit = 10 }: ProfitBySetWidgetProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>({ preset: '30d' })
  const [showLeast, setShowLeast] = useState(false)
  const { data, isLoading } = useSetProfitability(timeRange)
  const { formatPrice } = useCurrency()

  const displayData = showLeast
    ? [...data].sort((a, b) => a.netProfit - b.netProfit).slice(0, limit)
    : data.slice(0, limit)

  if (isLoading) {
    return <ProfitBySetSkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Profit by Set</CardTitle>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setShowLeast(!showLeast)}
              className={cn(
                'px-2 py-1 text-xs rounded-lg border transition-colors',
                showLeast
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              )}
            >
              {showLeast ? 'Least' : 'Most'}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {displayData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Package className="h-8 w-8 mb-2" />
            <p className="text-sm">No sales data yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
              <div className="col-span-4">Set</div>
              <div className="col-span-2 text-right">Sold</div>
              <div className="col-span-3 text-right">Profit</div>
              <div className="col-span-3 text-right">ROI</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {displayData.map((set, index) => (
                <div
                  key={set.setName}
                  className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors items-center"
                >
                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                    <span className="text-xs text-white/40 w-4">{index + 1}.</span>
                    <span className="text-sm text-white truncate" title={set.setName}>
                      {set.setName}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-sm text-white/70">
                    {set.itemsSold}
                  </div>
                  <div className="col-span-3 text-right">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        set.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {formatPrice(set.netProfit)}
                    </span>
                  </div>
                  <div className="col-span-3 text-right flex items-center justify-end gap-1">
                    {set.roi >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span
                      className={cn(
                        'text-sm font-medium',
                        set.roi >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {set.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProfitBySetSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-7 w-14 rounded-lg" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </CardContent>
    </Card>
  )
}
