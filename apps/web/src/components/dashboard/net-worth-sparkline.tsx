'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from '@/hooks/use-organization'
import { useCurrency } from '@/hooks/use-currency'
import { useMemo } from 'react'

interface DayValue {
  date: string
  value: number
}

function useNetWorthHistory() {
  return useQuery({
    queryKey: ['net-worth-history'],
    queryFn: async (): Promise<DayValue[]> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data, error } = await supabase
        .from('price_snapshots')
        .select('market_price, quantity, recorded_at')
        .eq('organization_id', orgId)
        .gte('recorded_at', thirtyDaysAgo.toISOString())
        .order('recorded_at', { ascending: true })

      if (error || !data || data.length === 0) return []

      // Group by day, sum market_price * quantity
      const dayMap = new Map<string, number>()
      for (const row of data) {
        const day = row.recorded_at.slice(0, 10)
        const val = (row.market_price || 0) * (row.quantity || 1)
        dayMap.set(day, (dayMap.get(day) || 0) + val)
      }

      return Array.from(dayMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => ({ date, value }))
    },
    staleTime: 10 * 60 * 1000,
  })
}

function Sparkline({ data }: { data: DayValue[] }) {
  const path = useMemo(() => {
    if (data.length < 2) return ''
    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const w = 200
    const h = 50
    const step = w / (values.length - 1)

    return values
      .map((v, i) => {
        const x = i * step
        const y = h - ((v - min) / range) * (h - 4) - 2
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }, [data])

  if (!path) return null

  const isUp = data[data.length - 1].value >= data[0].value
  const color = isUp ? '#05CD99' : '#ef4444'

  return (
    <svg viewBox="0 0 200 50" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={path + ` L200,50 L0,50 Z`} fill="url(#sparkGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NetWorthSparkline() {
  const { data, isLoading } = useNetWorthHistory()
  const { formatConverted } = useCurrency()

  const latestValue = data && data.length > 0 ? data[data.length - 1].value : null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl icon-bg-green shadow-lg shadow-vision-green/30">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Portfolio Value Trend</CardTitle>
            {latestValue !== null && (
              <p className="text-sm text-white/60">Current: {formatConverted(latestValue)}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
        ) : !data || data.length < 2 ? (
          <div className="text-center py-4 text-white/60 text-sm">
            <p>📈 Tracking started — sparkline appears after 2+ days of data.</p>
          </div>
        ) : (
          <Sparkline data={data} />
        )}
      </CardContent>
    </Card>
  )
}
