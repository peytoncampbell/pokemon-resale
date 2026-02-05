'use client'

import { RotateCw, Check, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react'
import type { FreshnessStatus } from '@/lib/price/types'
import { cn } from '@/lib/utils'

interface StalenessBadgeProps {
  freshness: FreshnessStatus
  hoursOld?: number
  recordedAt?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

function formatHoursOld(hours?: number): string {
  if (!hours || hours < 1) return 'just now'
  if (hours < 24) return `${Math.floor(hours)}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatFullDate(isoString?: string): string {
  if (!isoString) return 'Unknown'
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function StalenessBadge({
  freshness,
  hoursOld,
  recordedAt,
  onRefresh,
  isRefreshing,
}: StalenessBadgeProps) {
  const timeAgo = formatHoursOld(hoursOld)
  const fullDate = formatFullDate(recordedAt)

  // Determine visual styling based on freshness
  const badgeConfig = {
    fresh: {
      dotColor: 'bg-emerald-400',
      text: `Updated ${timeAgo}`,
      textColor: 'text-white/50',
      icon: Check,
      showRefresh: false,
      refreshSize: null as null,
    },
    stale: {
      dotColor: 'bg-amber-400',
      text: `Stale - ${timeAgo}`,
      textColor: 'text-amber-400/80',
      icon: AlertTriangle,
      showRefresh: true,
      refreshSize: 'small' as const,
    },
    very_stale: {
      dotColor: 'bg-red-400',
      text: `Very stale - ${timeAgo}`,
      textColor: 'text-red-400/80',
      icon: AlertCircle,
      showRefresh: true,
      refreshSize: 'prominent' as const,
    },
  }

  const config = badgeConfig[freshness]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2" title={`Last updated: ${fullDate}`}>
      <div className="flex items-center gap-1.5">
        {isRefreshing ? (
          <Loader2 className="h-2 w-2 animate-spin text-vision-blue" />
        ) : (
          <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        )}
        <span className={cn('text-xs', config.textColor)}>{config.text}</span>
        {!isRefreshing && freshness !== 'fresh' && (
          <Icon className="h-3 w-3 inline-block opacity-70" />
        )}
      </div>
      {config.showRefresh && onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(
            'inline-flex items-center gap-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            config.refreshSize === 'prominent'
              ? 'px-2 py-1 text-xs font-medium bg-vision-blue/20 hover:bg-vision-blue/30 text-vision-blue'
              : 'p-1 hover:bg-white/5 text-white/50 hover:text-white/70'
          )}
        >
          <RotateCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
          {config.refreshSize === 'prominent' && <span>Refresh</span>}
        </button>
      )}
    </div>
  )
}
