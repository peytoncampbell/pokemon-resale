'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonList } from '@/components/ui/skeleton'
import { Package } from 'lucide-react'
import { useInventoryItems } from '@/hooks/use-inventory'
import { formatCurrency } from '@/lib/utils'
import { useCurrency } from '@/hooks/use-currency'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

export function RecentInventoryCard() {
  const { data: inventory, isLoading } = useInventoryItems()
  const { currency } = useCurrency()

  const recentInventory = useMemo(() => inventory?.slice(0, 5) || [], [inventory])

  if (isLoading) {
    return <SkeletonList rows={5} />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Inventory</CardTitle>
          <Link
            href="/inventory"
            className="text-sm font-medium text-vision-cyan hover:text-vision-blue transition-colors"
          >
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recentInventory.length > 0 ? (
          <div className="space-y-4">
            {recentInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="w-16 h-20 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.card_image ? (
                    <Image
                      src={item.card_image}
                      alt={item.card_name}
                      width={64}
                      height={80}
                      className="object-contain"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.card_name}</h3>
                  <p className="text-sm text-white/60 truncate">
                    {item.set_name} • {item.location || 'No location'}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs rounded-lg border-white/20 text-white/80">
                      {item.condition || 'NM'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-vision-cyan">
                    {formatCurrency(item.acquisition_cost, currency)}
                  </p>
                  <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">No inventory yet</p>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-vision-blue to-vision-cyan text-white font-medium hover:shadow-lg hover:shadow-vision-blue/20 transition-all"
            >
              Add your first item
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
