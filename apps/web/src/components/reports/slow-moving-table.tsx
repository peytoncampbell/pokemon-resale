'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSlowMovingInventory } from '@/hooks/use-reports'
import { formatCurrency } from '@/lib/utils'
import { Clock, AlertTriangle, MapPin } from 'lucide-react'
import Image from 'next/image'

interface SlowMovingTableProps {
  daysThreshold?: number
}

export function SlowMovingTable({ daysThreshold = 30 }: SlowMovingTableProps) {
  const [threshold, setThreshold] = useState(daysThreshold)
  const { data, isLoading, error } = useSlowMovingInventory(threshold)

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

  const totalValue = data?.reduce((sum, item) => sum + item.acquisition_cost, 0) || 0

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Slow Moving Inventory
            </h3>
            <p className="text-sm text-white/60">
              Items in stock for more than {threshold} days
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[30, 60, 90].map((days) => (
              <Button
                key={days}
                variant={threshold === days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setThreshold(days)}
              >
                {days}d
              </Button>
            ))}
          </div>
        </div>

        {data && data.length > 0 && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div>
              <p className="text-sm text-yellow-400 font-medium">{data.length} items at risk</p>
              <p className="text-xs text-white/60">Total value: {formatCurrency(totalValue)}</p>
            </div>
          </div>
        )}

        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="h-16 w-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  {item.card_image ? (
                    <Image
                      src={item.card_image}
                      alt={item.card_name}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  ) : (
                    <span className="text-xs text-white/40">No img</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{item.card_name}</p>
                  <p className="text-sm text-white/60 truncate">{item.set_name || 'Unknown Set'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.condition}
                    </Badge>
                    <Badge variant="outline" className="text-xs gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {item.location}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-vision-cyan">{formatCurrency(item.acquisition_cost)}</p>
                  <div className="flex items-center gap-1 text-yellow-400 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{item.days_in_inventory} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <Clock className="h-12 w-12 mb-3 opacity-50" />
            <p>No slow moving items</p>
            <p className="text-sm">All inventory is moving well</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
