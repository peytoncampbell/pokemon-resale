'use client'

import { Card, CardContent } from '@/components/ui/card'
import { usePlatformPerformance, type DateRange } from '@/hooks/use-reports'
import { formatCurrency } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const PLATFORM_COLORS: Record<string, string> = {
  'TCGPlayer': '#3b82f6',
  'eBay': '#eab308',
  'Facebook': '#1877f2',
  'Local': '#22c55e',
  'Other': '#6b7280',
}

interface PlatformComparisonChartProps {
  dateRange?: DateRange
}

export function PlatformComparisonChart({ dateRange }: PlatformComparisonChartProps) {
  const { data, isLoading, error } = usePlatformPerformance(dateRange)

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

  const totalRevenue = data?.reduce((sum, p) => sum + p.total_revenue, 0) || 0

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Platform Performance</h3>
          <p className="text-sm text-white/60">Sales breakdown by platform</p>
        </div>

        {data && data.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total_revenue"
                    nameKey="platform"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ platform, percent }) =>
                      `${platform} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.platform}
                        fill={PLATFORM_COLORS[entry.platform] || PLATFORM_COLORS.Other}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {data.map((platform) => {
                const percentage = totalRevenue > 0
                  ? ((platform.total_revenue / totalRevenue) * 100).toFixed(1)
                  : '0'

                return (
                  <div
                    key={platform.platform}
                    className="p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: PLATFORM_COLORS[platform.platform] || PLATFORM_COLORS.Other }}
                        />
                        <span className="font-medium text-white">{platform.platform}</span>
                      </div>
                      <span className="text-xs text-white/60">{percentage}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-white/60">Sales</p>
                        <p className="font-medium text-white">{platform.sales_count}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Revenue</p>
                        <p className="font-medium text-vision-cyan">{formatCurrency(platform.total_revenue)}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Avg Sale</p>
                        <p className="font-medium text-white">{formatCurrency(platform.avg_sale_price)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-white/40">
            No sales data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
