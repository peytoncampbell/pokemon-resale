'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useInventoryAging } from '@/hooks/use-analytics'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import { Clock, AlertTriangle } from 'lucide-react'

interface InventoryAgingWidgetProps {
  className?: string
}

const BUCKET_COLORS: Record<string, { ring: string; fill: string; text: string }> = {
  fresh: { ring: 'stroke-emerald-500', fill: 'bg-emerald-500', text: 'text-emerald-400' },
  aging: { ring: 'stroke-yellow-500', fill: 'bg-yellow-500', text: 'text-yellow-400' },
  stale: { ring: 'stroke-orange-500', fill: 'bg-orange-500', text: 'text-orange-400' },
  dead: { ring: 'stroke-red-500', fill: 'bg-red-500', text: 'text-red-400' },
}

export function InventoryAgingWidget({ className }: InventoryAgingWidgetProps) {
  const { data, isLoading } = useInventoryAging()
  const { formatPrice } = useCurrency()

  const totalValue = data.reduce((sum, bucket) => sum + bucket.totalValue, 0)
  const totalItems = data.reduce((sum, bucket) => sum + bucket.itemCount, 0)

  // Calculate donut chart segments
  const segments = data.map((bucket, index) => {
    const startAngle = data
      .slice(0, index)
      .reduce((sum, b) => sum + (totalItems > 0 ? (b.itemCount / totalItems) * 360 : 0), 0)
    const angle = totalItems > 0 ? (bucket.itemCount / totalItems) * 360 : 0
    return { ...bucket, startAngle, angle }
  })

  if (isLoading) {
    return <InventoryAgingSkeleton className={className} />
  }

  // Check for concerning aging (stale + dead > 30%)
  const concerningPercentage =
    (data.find((b) => b.bucket === 'stale')?.percentage || 0) +
    (data.find((b) => b.bucket === 'dead')?.percentage || 0)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Inventory Aging</CardTitle>
          {concerningPercentage > 30 && (
            <div className="flex items-center gap-1 text-orange-400 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{concerningPercentage.toFixed(0)}% aging</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Clock className="h-8 w-8 mb-2" />
            <p className="text-sm">No inventory yet</p>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Donut Chart */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {segments.map((segment) => {
                  if (segment.itemCount === 0) return null
                  const colors = BUCKET_COLORS[segment.bucket] || BUCKET_COLORS.fresh
                  const radius = 40
                  const circumference = 2 * Math.PI * radius
                  const strokeDasharray = `${(segment.angle / 360) * circumference} ${circumference}`
                  const strokeDashoffset = -(segment.startAngle / 360) * circumference

                  return (
                    <circle
                      key={segment.bucket}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      strokeWidth="12"
                      className={cn(colors.ring, 'transition-all duration-500')}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  )
                })}
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{totalItems}</span>
                <span className="text-xs text-white/50">items</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
              {data.map((bucket) => {
                const colors = BUCKET_COLORS[bucket.bucket] || BUCKET_COLORS.fresh
                return (
                  <div
                    key={bucket.bucket}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full', colors.fill)} />
                      <span className="text-white/80">{bucket.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('font-medium', colors.text)}>
                        {bucket.itemCount}
                      </span>
                      <span className="text-white/40 text-xs w-8 text-right">
                        {bucket.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Value summary */}
        {totalItems > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider">Total Value</p>
              <p className="text-lg font-bold text-white">{formatPrice(totalValue)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider">At Risk</p>
              <p className="text-lg font-bold text-orange-400">
                {formatPrice(
                  (data.find((b) => b.bucket === 'stale')?.totalValue || 0) +
                    (data.find((b) => b.bucket === 'dead')?.totalValue || 0)
                )}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InventoryAgingSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-2.5 h-2.5 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
