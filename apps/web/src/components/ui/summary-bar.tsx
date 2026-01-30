'use client'

import { cn } from '@/lib/utils'

interface SummaryBarProps {
  left: React.ReactNode
  right?: React.ReactNode
  className?: string
}

export function SummaryBar({ left, right, className }: SummaryBarProps) {
  return (
    <div className={cn('flex items-center justify-between glass-card px-6 py-4', className)}>
      <div className="flex items-center gap-4">
        {left}
      </div>
      {right && (
        <div className="text-sm font-semibold text-vision-cyan">
          {right}
        </div>
      )}
    </div>
  )
}
