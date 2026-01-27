'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useExpectedItems, useDeleteExpectedItem, type ProcurementExpectedItem } from '@/hooks/use-expected-items'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, Package, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'

const STATUS_COLORS = {
  PENDING: 'secondary',
  RECEIVED: 'success',
  PARTIAL: 'info',
  MISSING: 'destructive',
} as const

interface ExpectedItemsListProps {
  procurementId: string
  onAddItem?: () => void
  onReconcile?: () => void
}

export function ExpectedItemsList({ procurementId, onAddItem, onReconcile }: ExpectedItemsListProps) {
  const { data: items, isLoading, error } = useExpectedItems(procurementId)
  const deleteItem = useDeleteExpectedItem()

  const handleDelete = async (id: string) => {
    if (confirm('Remove this expected item?')) {
      await deleteItem.mutateAsync({ id, procurementId })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-vision-blue border-r-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
        <p className="text-sm text-red-400">Failed to load expected items</p>
      </div>
    )
  }

  const pendingCount = items?.filter(i => i.status === 'PENDING').length || 0
  const totalExpected = items?.reduce((sum, i) => sum + i.expected_quantity, 0) || 0
  const totalReceived = items?.reduce((sum, i) => sum + i.received_quantity, 0) || 0
  const totalCost = items?.reduce((sum, i) => sum + (i.expected_cost || 0) * i.expected_quantity, 0) || 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Expected Items</h3>
          <p className="text-sm text-white/60">
            {totalReceived}/{totalExpected} items received
          </p>
        </div>
        <div className="flex gap-2">
          {onReconcile && pendingCount > 0 && (
            <Button variant="outline" size="sm" onClick={onReconcile}>
              <Check className="mr-2 h-4 w-4" />
              Reconcile
            </Button>
          )}
          {onAddItem && (
            <Button size="sm" onClick={onAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expected
            </Button>
          )}
        </div>
      </div>

      {items && items.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-xs text-white/60">Expected Items</p>
              <p className="text-lg font-bold text-white">{totalExpected}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Received</p>
              <p className="text-lg font-bold text-green-400">{totalReceived}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Expected Cost</p>
              <p className="text-lg font-bold text-vision-cyan">{formatCurrency(totalCost)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10">
                <CardContent className="flex items-center gap-4 p-4">
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
                      <Package className="h-6 w-6 text-white/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{item.card_name}</h4>
                    <p className="text-sm text-white/60 truncate">{item.set_name || 'Unknown Set'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={STATUS_COLORS[item.status]} className="text-xs">
                        {item.status}
                      </Badge>
                      <span className="text-xs text-white/60">
                        {item.received_quantity}/{item.expected_quantity} received
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.expected_cost && (
                      <p className="font-semibold text-vision-cyan">{formatCurrency(item.expected_cost)}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="hover:bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-xl border border-white/10">
          <Package className="h-12 w-12 text-white/30 mb-3" />
          <p className="text-white/60 text-sm mb-4">No expected items added yet</p>
          {onAddItem && (
            <Button variant="outline" size="sm" onClick={onAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expected Item
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
