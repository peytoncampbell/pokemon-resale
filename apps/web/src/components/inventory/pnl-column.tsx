'use client'

import { calculateUnrealizedGain, formatPnL, formatPercentage } from '@/lib/pnl/calculations'

interface PnLColumnProps {
  costBasis: number
  marketPrice: number | null
  quantity: number
}

export function PnLColumn({ costBasis, marketPrice, quantity }: PnLColumnProps) {
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

  const pnl = formatPnL(unrealized_gain)
  const percentage = formatPercentage(gain_percentage)

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-sm font-semibold ${pnl.colorClass}`}>
        {pnl.formatted}
      </span>
      <span className={`text-xs ${percentage.colorClass}`}>
        {percentage.formatted}
      </span>
    </div>
  )
}
