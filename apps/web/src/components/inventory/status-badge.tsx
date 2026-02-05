'use client'

import { Badge } from '@/components/ui/badge'
import type { InventoryStatus } from '@/lib/pnl/types'

interface StatusBadgeProps {
  status: InventoryStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG = {
  IN_STOCK: {
    label: 'In Stock',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  LISTED: {
    label: 'Listed',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  SOLD: {
    label: 'Sold',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  SHIPPED: {
    label: 'Shipped',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
} as const

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${sizeClass} rounded-full font-medium border`}
    >
      {config.label}
    </Badge>
  )
}
