'use client'

import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

interface PriceFreshnessBadgeProps {
  /** Unix timestamp (seconds) of when the price was last updated */
  lastUpdated: number | null | undefined
}

function getTimeSince(timestamp: number): { label: string; color: string } {
  const now = Date.now() / 1000
  const diffSeconds = now - timestamp
  const diffHours = diffSeconds / 3600

  if (diffHours < 1) {
    const mins = Math.floor(diffSeconds / 60)
    return {
      label: `${mins}m ago`,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    }
  }

  if (diffHours < 24) {
    const hours = Math.floor(diffHours)
    return {
      label: `${hours}h ago`,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    }
  }

  const days = Math.floor(diffHours / 24)
  return {
    label: `${days}d ago`,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
}

export function PriceFreshnessBadge({ lastUpdated }: PriceFreshnessBadgeProps) {
  if (!lastUpdated) {
    return (
      <Badge variant="outline" className="text-xs text-white/40 gap-1">
        <Clock className="h-3 w-3" />
        No data
      </Badge>
    )
  }

  const { label, color } = getTimeSince(lastUpdated)

  return (
    <Badge variant="outline" className={`text-xs gap-1 ${color}`}>
      <Clock className="h-3 w-3" />
      {label}
    </Badge>
  )
}
