'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { useCurrency } from '@/hooks/use-currency'
import { useDashboard } from '@/hooks/use-dashboard'
import { useMemo } from 'react'

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 200
  const height = 40
  const padding = 2

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const pathD = points.map((p, i) => (i === 0 ? `M ${p}` : `L ${p}`)).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10">
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NetWorthSparkline() {
  const { formatConverted } = useCurrency()
  const dashboard = useDashboard()

  // For now show current portfolio value with a simple indicator
  // Full historical sparkline would need a dedicated price_history_daily table
  const portfolioValue = dashboard.portfolioValue || 0
  const unrealizedGain = dashboard.unrealizedGain?.totalGain || 0
  const isPositive = unrealizedGain >= 0

  if (dashboard.isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/60 font-medium">Portfolio Trend</p>
            <p className="text-lg font-bold text-white">{formatConverted(portfolioValue)}</p>
            <p className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{formatConverted(unrealizedGain)} unrealized
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">
            <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {dashboard.unrealizedGain?.totalCostBasis > 0
                ? `${isPositive ? '+' : ''}${((unrealizedGain / dashboard.unrealizedGain.totalCostBasis) * 100).toFixed(1)}%`
                : '—'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
