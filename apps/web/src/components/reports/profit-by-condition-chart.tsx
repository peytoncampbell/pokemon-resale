'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useProfitByCondition, type ProfitByCondition } from '@/hooks/use-reports'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CONDITION_COLORS: Record<string, string> = {
  NM: '#22c55e',
  LP: '#3b82f6',
  MP: '#eab308',
  HP: '#f97316',
  DMG: '#ef4444',
}

const CONDITION_LABELS: Record<string, string> = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged',
}

interface ProfitByConditionChartProps {
  dateRange?: { start: Date; end: Date }
}

export function ProfitByConditionChart({ dateRange }: ProfitByConditionChartProps) {
  const { data, isLoading, error } = useProfitByCondition(dateRange)

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-vision-blue border-r-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <p className="text-red-400">Failed to load data</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data?.filter(d => d.items_count > 0) || []

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Profit by Condition</h3>
          <p className="text-sm text-white/60">Which card conditions are most profitable</p>
        </div>

        {chartData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis
                    type="category"
                    dataKey="condition"
                    stroke="rgba(255,255,255,0.4)"
                    tickFormatter={(v) => CONDITION_LABELS[v] || v}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Profit']}
                  />
                  <Bar dataKey="total_profit" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.condition} fill={CONDITION_COLORS[entry.condition]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {data?.map((stat) => (
                <div
                  key={stat.condition}
                  className="p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: CONDITION_COLORS[stat.condition] }}
                    />
                    <span className="text-xs text-white/60">{stat.condition}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{stat.items_count} items</p>
                  <p className="text-xs text-white/60">
                    {stat.profit_margin.toFixed(1)}% margin
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-white/40">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
