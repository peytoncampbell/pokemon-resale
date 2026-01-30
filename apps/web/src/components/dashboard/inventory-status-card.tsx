'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalytics } from '@/hooks/use-analytics'

export function InventoryStatusCard() {
  const { data: analytics } = useAnalytics()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Inventory Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-vision-green" />
              <span className="text-sm text-white/80">In Stock</span>
            </div>
            <span className="font-semibold text-white">
              {analytics?.inventoryByStatus?.IN_STOCK || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-vision-blue" />
              <span className="text-sm text-white/80">Listed</span>
            </div>
            <span className="font-semibold text-white">
              {analytics?.inventoryByStatus?.LISTED || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-white/40" />
              <span className="text-sm text-white/80">Sold</span>
            </div>
            <span className="font-semibold text-white">
              {analytics?.inventoryByStatus?.SOLD || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
