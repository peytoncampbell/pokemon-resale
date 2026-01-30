'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'
import { useCurrency } from '@/hooks/use-currency'

export function RecentActivityCard() {
  const { data: analytics } = useAnalytics()
  const { formatConverted } = useCurrency()

  if (!analytics?.recentActivity || analytics.recentActivity.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-vision-cyan" />
          Recent Activity (7 days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {analytics.recentActivity.map((day) => (
            <div key={day.date} className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="text-sm text-white/60 mb-1">
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="font-semibold text-white">{day.itemsAdded} items</p>
              <p className="text-sm text-vision-cyan">{formatConverted(day.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
