'use client'

import { calculateUnrealizedGain } from '@/lib/pnl/calculations'
import { useCurrency } from '@/hooks/use-currency'

interface PnLColumnProps {
  costBasis: number
  marketPrice: number | null
  quantity: number
}

export function PnLColumn({ costBasis, marketPrice, quantity }: PnLColumnProps) {
  const { formatConverted } = useCurrency()

  const { unrealized_gain, gain_percentage } = calculateUnrealizedGain(
    costBasis,
    marketPrice,
    quantity
  )

  // No market price available
  if (unrealized_gain === null || gain_percentage === null) {
    return (
      <div className="text-sm text-white/40">
        N/A
      </div>
    )
  }

  const isPositive = unrealized_gain >= 0
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400'

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-sm font-semibold ${colorClass}`}>
        {isPositive ? '+' : ''}{formatConverted(unrealized_gain)}
      </span>
      <span className={`text-xs ${colorClass}`}>
        {isPositive ? '+' : ''}{gain_percentage.toFixed(1)}%
      </span>
    </div>
  )
}
