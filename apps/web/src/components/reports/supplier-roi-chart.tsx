'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSupplierROI } from '@/hooks/use-reports'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Store } from 'lucide-react'

export function SupplierROIChart() {
  const { data, isLoading, error } = useSupplierROI()

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

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Supplier ROI</h3>
          <p className="text-sm text-white/60">Return on investment by supplier</p>
        </div>

        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((supplier) => {
              const isPositive = supplier.roi_percentage >= 0
              return (
                <div
                  key={supplier.supplier_name}
                  className="p-4 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Store className="h-5 w-5 text-vision-cyan" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{supplier.supplier_name}</p>
                        <p className="text-xs text-white/60">
                          {supplier.total_orders} orders
                        </p>
                      </div>
                    </div>
                    <Badge variant={isPositive ? 'success' : 'destructive'} className="gap-1">
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {supplier.roi_percentage.toFixed(1)}% ROI
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-white/60">Spent</p>
                      <p className="font-medium text-white">{formatCurrency(supplier.total_spent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Revenue</p>
                      <p className="font-medium text-white">{formatCurrency(supplier.total_revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Profit</p>
                      <p className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(supplier.total_profit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Items Sold</p>
                      <p className="font-medium text-white">{supplier.items_sold}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-white/40">
            No supplier data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
