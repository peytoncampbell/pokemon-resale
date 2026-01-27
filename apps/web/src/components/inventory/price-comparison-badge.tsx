'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PriceComparisonBadgeProps {
  acquisitionCost: number
  marketPrice: number | null
  showDifference?: boolean
}

export function PriceComparisonBadge({
  acquisitionCost,
  marketPrice,
  showDifference = false,
}: PriceComparisonBadgeProps) {
  if (!marketPrice) {
    return (
      <Badge variant="outline" className="text-xs text-white/40">
        No market data
      </Badge>
    )
  }

  const difference = marketPrice - acquisitionCost
  const percentChange = acquisitionCost > 0
    ? ((difference / acquisitionCost) * 100)
    : 0

  const isPositive = difference > 0
  const isNeutral = Math.abs(percentChange) < 5

  if (isNeutral) {
    return (
      <Badge variant="outline" className="text-xs gap-1">
        <Minus className="h-3 w-3" />
        {showDifference ? formatCurrency(marketPrice) : '~Market'}
      </Badge>
    )
  }

  return (
    <Badge
      variant={isPositive ? 'success' : 'destructive'}
      className="text-xs gap-1"
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {showDifference ? (
        <>
          {isPositive ? '+' : ''}{formatCurrency(difference)}
          <span className="opacity-70">({percentChange.toFixed(0)}%)</span>
        </>
      ) : (
        <>
          {isPositive ? '+' : ''}{percentChange.toFixed(0)}%
        </>
      )}
    </Badge>
  )
}
