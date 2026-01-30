'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, DollarSign, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import type { TransactionStats } from '@/hooks/use-transactions'
import { useCurrency } from '@/hooks/use-currency'

interface TransactionStatsProps {
  stats: TransactionStats | undefined
  isLoading: boolean
}

export function TransactionStatsCards({ stats, isLoading }: TransactionStatsProps) {
  const { formatConverted } = useCurrency()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 w-20 bg-white/10 rounded mb-2" />
              <div className="h-8 w-24 bg-white/10 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Buys',
      value: stats?.totalBuys || 0,
      subtext: formatConverted(stats?.totalCashOut || 0),
      icon: ShoppingCart,
      color: 'text-vision-blue',
      bgColor: 'bg-vision-blue/10',
    },
    {
      label: 'Total Sales',
      value: stats?.totalSells || 0,
      subtext: formatConverted(stats?.totalCashIn || 0),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Total Trades',
      value: stats?.totalTrades || 0,
      subtext: 'Exchanges',
      icon: ArrowLeftRight,
      color: 'text-vision-purple',
      bgColor: 'bg-vision-purple/10',
    },
    {
      label: 'Net Cash Flow',
      value: formatConverted(stats?.netCashFlow || 0),
      subtext: (stats?.netCashFlow || 0) >= 0 ? 'Profit' : 'Spent',
      icon: (stats?.netCashFlow || 0) >= 0 ? TrendingUp : TrendingDown,
      color: (stats?.netCashFlow || 0) >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: (stats?.netCashFlow || 0) >= 0 ? 'bg-green-400/10' : 'bg-red-400/10',
      isValue: true,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.isValue ? card.value : card.value}
                </p>
                <p className="text-xs text-white/40 mt-1">{card.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
