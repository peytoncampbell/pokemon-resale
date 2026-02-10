'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'

interface Mover {
  cardName: string
  priceChange: number
  percentChange: number
}

function useTopMovers() {
  return useQuery({
    queryKey: ['top-movers'],
    queryFn: async (): Promise<{ gainers: Mover[]; losers: Mover[] }> => {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {}
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
      }
      const res = await fetch('/api/prices/movers', { headers })
      if (!res.ok) return { gainers: [], losers: [] }
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function TopMovers() {
  const { data, isLoading } = useTopMovers()
  const { formatConverted } = useCurrency()

  const gainers = data?.gainers ?? []
  const losers = data?.losers ?? []
  const hasData = gainers.length > 0 || losers.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-vision-cyan/20 shadow-lg shadow-vision-cyan/30">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Top Movers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : !hasData ? (
          <div className="text-center py-8 text-white/60">
            <p>No price data yet</p>
            <p className="text-sm mt-1">Price changes will appear after multiple snapshots.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {gainers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <h4 className="text-sm font-semibold text-green-400">Gainers</h4>
                </div>
                <div className="space-y-2">
                  {gainers.map((m, i) => (
                    <MoverRow key={i} mover={m} isGainer formatConverted={formatConverted} />
                  ))}
                </div>
              </div>
            )}
            {losers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <h4 className="text-sm font-semibold text-red-400">Losers</h4>
                </div>
                <div className="space-y-2">
                  {losers.map((m, i) => (
                    <MoverRow key={i} mover={m} isGainer={false} formatConverted={formatConverted} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MoverRow({
  mover,
  isGainer,
  formatConverted,
}: {
  mover: Mover
  isGainer: boolean
  formatConverted: (v: number) => string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <p className="text-sm font-medium text-white truncate flex-1 min-w-0">{mover.cardName}</p>
      <div className="text-right ml-3">
        <p className={cn('text-sm font-semibold', isGainer ? 'text-green-400' : 'text-red-400')}>
          {isGainer ? '+' : ''}{mover.percentChange.toFixed(1)}%
        </p>
        <p className={cn('text-xs', isGainer ? 'text-green-400/80' : 'text-red-400/80')}>
          {isGainer ? '+' : ''}{formatConverted(mover.priceChange)}
        </p>
      </div>
    </div>
  )
}
