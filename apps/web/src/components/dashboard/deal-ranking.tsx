'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { useDashboard } from '@/hooks/use-dashboard'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import type { DealScore } from '@/lib/dashboard/deal-scoring'

export function DealRanking() {
  const dashboard = useDashboard()
  const { formatConverted } = useCurrency()

  const { topPerformers, worstPerformers } = dashboard.dealRankings

  // Show empty state if no deals have market prices
  if (topPerformers.length === 0 && worstPerformers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl icon-bg-purple shadow-lg shadow-vision-purple/30">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Deal Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/60">
            <p>No market prices available for deal scoring.</p>
            <p className="text-sm mt-1">Prices update daily.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl icon-bg-purple shadow-lg shadow-vision-purple/30">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Deal Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-vision-green" />
              <h4 className="text-sm font-semibold text-vision-green">Top Performers</h4>
            </div>
            <div className="space-y-2">
              {topPerformers.map((deal, idx) => (
                <DealRow key={`top-${idx}`} deal={deal} formatConverted={formatConverted} />
              ))}
            </div>
          </div>
        )}

        {/* Worst Performers */}
        {worstPerformers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <h4 className="text-sm font-semibold text-red-400">Worst Performers</h4>
            </div>
            <div className="space-y-2">
              {worstPerformers.map((deal, idx) => (
                <DealRow key={`worst-${idx}`} deal={deal} formatConverted={formatConverted} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DealRow({
  deal,
  formatConverted,
}: {
  deal: DealScore
  formatConverted: (value: number) => string
}) {
  const isPositive = (deal.roi ?? 0) >= 0

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{deal.cardName}</p>
        {deal.setName && (
          <p className="text-xs text-white/60 truncate">{deal.setName}</p>
        )}
      </div>
      <div className="text-right ml-4">
        <p
          className={cn(
            'text-sm font-semibold',
            isPositive ? 'text-vision-green' : 'text-red-400'
          )}
        >
          {deal.roi !== null ? `${isPositive ? '+' : ''}${deal.roi.toFixed(1)}%` : 'N/A'}
        </p>
        {deal.unrealizedGain !== null && (
          <p
            className={cn(
              'text-xs',
              isPositive ? 'text-vision-green/80' : 'text-red-400/80'
            )}
          >
            {formatConverted(deal.unrealizedGain)}
          </p>
        )}
      </div>
    </div>
  )
}
