'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { useDashboard } from '@/hooks/use-dashboard'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { ActivityEvent } from '@/lib/dashboard/activity-formatter'

export function ActivityFeedCard() {
  const dashboard = useDashboard()
  const { activityFeed } = dashboard

  // Show empty state if no activity
  if (activityFeed.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl icon-bg-blue shadow-lg shadow-vision-blue/30">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/60">
            <p>No recent activity.</p>
            <p className="text-sm mt-1">Add inventory or record a sale to see events here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show first 10 events
  const displayEvents = activityFeed.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl icon-bg-blue shadow-lg shadow-vision-blue/30">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayEvents.map((event) => (
            <ActivityRow key={event.id} event={event} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const Icon = event.type === 'sell' ? TrendingDown : TrendingUp
  const iconColor = event.type === 'sell' ? 'text-vision-green' : 'text-vision-blue'
  const iconBg = event.type === 'sell' ? 'bg-vision-green/20' : 'bg-vision-blue/20'

  const relativeTime = formatDistanceToNow(event.timestamp, { addSuffix: true })

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0',
          iconBg
        )}
      >
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">{event.description}</p>
        <p className="text-xs text-white/60 mt-1">{relativeTime}</p>
      </div>
      {event.amount !== null && (
        <div className="text-right ml-2">
          <p
            className={cn(
              'text-sm font-semibold',
              event.isPositive ? 'text-vision-green' : 'text-white'
            )}
          >
            ${event.amount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}
