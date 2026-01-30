'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalytics } from '@/hooks/use-analytics'

export function InventoryStatusCard() {
  const { data: analytics, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

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
