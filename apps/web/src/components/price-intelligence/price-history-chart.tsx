'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePriceHistory, type PriceHistoryDuration } from '@/hooks/use-price-history'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, LineChart as LineChartIcon } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import type { Condition } from '@/types/filters'

interface PriceHistoryChartProps {
  cardId: string
  cardName: string
  condition?: Condition
  userBuyPrice?: number
  userBuyDate?: Date
  userSellPrice?: number
  userSellDate?: Date
  className?: string
  height?: number
}

const DURATION_OPTIONS: { value: PriceHistoryDuration; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
]

export function PriceHistoryChart({
  cardId,
  cardName,
  condition = 'NM',
  userBuyPrice,
  userBuyDate,
  userSellPrice,
  userSellDate,
  className,
  height = 250,
}: PriceHistoryChartProps) {
  const [duration, setDuration] = useState<PriceHistoryDuration>('30d')
  const { data, isLoading, error } = usePriceHistory(cardId, condition, duration)
  const { formatPrice } = useCurrency()

  if (isLoading) {
    return <PriceHistoryChartSkeleton className={className} height={height} />
  }

  if (error || !data) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Price History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-white/40" style={{ height }}>
            <LineChartIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">Unable to load price data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Price History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-white/40" style={{ height }}>
            <LineChartIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">No price history available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Format chart data
  const chartData = data.history.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: point.price,
    fullDate: point.date,
  }))

  // Calculate trend
  const priceChange = data.priceChange30d ?? data.priceChange7d ?? 0
  const TrendIcon = priceChange > 0 ? TrendingUp : priceChange < 0 ? TrendingDown : Minus
  const trendColor = priceChange > 0 ? 'text-emerald-400' : priceChange < 0 ? 'text-red-400' : 'text-white/50'

  // Find user's buy/sell points in chart data
  const buyPointIndex = userBuyDate
    ? chartData.findIndex((d) => new Date(d.fullDate).toDateString() === userBuyDate.toDateString())
    : -1
  const sellPointIndex = userSellDate
    ? chartData.findIndex((d) => new Date(d.fullDate).toDateString() === userSellDate.toDateString())
    : -1

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Price History</CardTitle>
            <p className="text-sm text-white/50 truncate max-w-[200px]" title={cardName}>
              {cardName} ({condition})
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Duration selector */}
            <div className="flex rounded-lg bg-white/5 p-0.5">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDuration(option.value)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                    duration === option.value
                      ? 'bg-vision-blue text-white'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Current price summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-white">
              {data.currentPrice ? formatPrice(data.currentPrice) : 'N/A'}
            </p>
            {priceChange !== 0 && (
              <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
                <TrendIcon className="h-3.5 w-3.5" />
                <span>
                  {priceChange > 0 ? '+' : ''}
                  {formatPrice(priceChange)} ({duration === '7d' ? '7d' : '30d'})
                </span>
              </div>
            )}
          </div>
          {userBuyPrice && (
            <div className="text-right">
              <p className="text-xs text-white/50 uppercase">Your Cost</p>
              <p className="text-lg font-semibold text-white">{formatPrice(userBuyPrice)}</p>
              {data.currentPrice && (
                <p
                  className={cn(
                    'text-xs font-medium',
                    data.currentPrice > userBuyPrice ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {data.currentPrice > userBuyPrice ? '+' : ''}
                  {formatPrice(data.currentPrice - userBuyPrice)} (
                  {(((data.currentPrice - userBuyPrice) / userBuyPrice) * 100).toFixed(1)}%)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Chart */}
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0075FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0075FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                tickFormatter={(value) => `$${value}`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1535',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                formatter={(value) => [formatPrice(value as number), 'Price']}
              />
              {/* User buy price reference line */}
              {userBuyPrice && (
                <ReferenceLine
                  y={userBuyPrice}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  label={{
                    value: 'Your Cost',
                    position: 'right',
                    fill: '#22c55e',
                    fontSize: 10,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#0075FF"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
              {/* User buy point */}
              {buyPointIndex >= 0 && chartData[buyPointIndex] && (
                <ReferenceDot
                  x={chartData[buyPointIndex].date}
                  y={userBuyPrice}
                  r={6}
                  fill="#22c55e"
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
              {/* User sell point */}
              {sellPointIndex >= 0 && chartData[sellPointIndex] && userSellPrice && (
                <ReferenceDot
                  x={chartData[sellPointIndex].date}
                  y={userSellPrice}
                  r={6}
                  fill="#f97316"
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price stats */}
        {(data.avgPrice || data.minPrice || data.maxPrice) && (
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            {data.minPrice && (
              <div>
                <p className="text-xs text-white/50 uppercase">Low</p>
                <p className="text-sm font-medium text-white">{formatPrice(data.minPrice)}</p>
              </div>
            )}
            {data.avgPrice && (
              <div>
                <p className="text-xs text-white/50 uppercase">Avg</p>
                <p className="text-sm font-medium text-white">{formatPrice(data.avgPrice)}</p>
              </div>
            )}
            {data.maxPrice && (
              <div>
                <p className="text-xs text-white/50 uppercase">High</p>
                <p className="text-sm font-medium text-white">{formatPrice(data.maxPrice)}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PriceHistoryChartSkeleton({ className, height = 250 }: { className?: string; height?: number }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div style={{ height }}>
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
