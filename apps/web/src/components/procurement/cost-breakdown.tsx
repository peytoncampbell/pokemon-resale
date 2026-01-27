'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useExpectedItems } from '@/hooks/use-expected-items'
import { DollarSign, Package, TrendingUp, Calculator } from 'lucide-react'
import type { Procurement } from '@/lib/supabase'

interface CostBreakdownProps {
  procurement: Procurement
}

export function CostBreakdown({ procurement }: CostBreakdownProps) {
  const { data: expectedItems } = useExpectedItems(procurement.id)

  const totalExpectedItems = expectedItems?.reduce((sum, i) => sum + i.expected_quantity, 0) || 0
  const linkedItemsCount = totalExpectedItems
  const costPerCard = linkedItemsCount > 0 ? procurement.total / linkedItemsCount : 0

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calculator className="h-5 w-5 text-vision-cyan" />
          Cost Breakdown
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-white/60">Subtotal</span>
            <span className="text-white font-medium">{formatCurrency(procurement.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white/60">Shipping</span>
            <span className="text-white font-medium">{formatCurrency(procurement.shipping)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white/60">Fees</span>
            <span className="text-white font-medium">{formatCurrency(procurement.fees)}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-white/10">
            <span className="text-white font-semibold">Total</span>
            <span className="text-xl font-bold text-vision-cyan">{formatCurrency(procurement.total)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="h-10 w-10 rounded-lg bg-vision-cyan/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-vision-cyan" />
            </div>
            <div>
              <p className="text-xs text-white/60">Expected Items</p>
              <p className="text-lg font-bold text-white">{linkedItemsCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-white/60">Cost per Card</p>
              <p className="text-lg font-bold text-green-400">
                {linkedItemsCount > 0 ? formatCurrency(costPerCard) : '—'}
              </p>
            </div>
          </div>

          {linkedItemsCount === 0 && (
            <p className="text-xs text-white/40 text-center">
              Add expected items to see cost per card calculation
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
