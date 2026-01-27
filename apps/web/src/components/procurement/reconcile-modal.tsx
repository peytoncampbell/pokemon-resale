'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useExpectedItems, useReconcileItems, type ProcurementExpectedItem } from '@/hooks/use-expected-items'
import { X, Check, Package, Minus, Plus } from 'lucide-react'
import Image from 'next/image'

interface ReconcileModalProps {
  open: boolean
  onClose: () => void
  procurementId: string
}

interface ReconcileItem {
  id: string
  card_name: string
  card_image: string | null
  expected_quantity: number
  received_quantity: number
}

export function ReconcileModal({ open, onClose, procurementId }: ReconcileModalProps) {
  const { data: items } = useExpectedItems(procurementId)
  const reconcile = useReconcileItems()

  const [receivedCounts, setReceivedCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    items?.forEach((item) => {
      counts[item.id] = item.received_quantity
    })
    return counts
  })

  const handleCountChange = (id: string, delta: number, max: number) => {
    setReceivedCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(max, (prev[id] || 0) + delta)),
    }))
  }

  const handleReconcile = async () => {
    const updates = Object.entries(receivedCounts).map(([id, received_quantity]) => ({
      id,
      received_quantity,
    }))

    await reconcile.mutateAsync({ procurementId, items: updates })
    onClose()
  }

  const pendingItems = items?.filter((i) => i.status === 'PENDING') || []

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-hidden bg-vision-navy rounded-2xl shadow-2xl m-4 flex flex-col border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">Reconcile Items</h2>
            <p className="text-sm text-white/60">Mark items as received</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {pendingItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Check className="h-16 w-16 text-green-400 mb-4" />
              <p className="text-white font-medium">All items reconciled!</p>
              <p className="text-sm text-white/60">No pending items to review</p>
            </div>
          ) : (
            pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
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
                    <Package className="h-6 w-6 text-white/40" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">{item.card_name}</h4>
                  <p className="text-sm text-white/60">
                    Expected: {item.expected_quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCountChange(item.id, -1, item.expected_quantity)}
                    disabled={receivedCounts[item.id] === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center">
                    <span className="text-lg font-bold text-white">
                      {receivedCounts[item.id] || 0}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCountChange(item.id, 1, item.expected_quantity)}
                    disabled={receivedCounts[item.id] >= item.expected_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-400 hover:bg-green-500/10"
                  onClick={() => {
                    setReceivedCounts((prev) => ({
                      ...prev,
                      [item.id]: item.expected_quantity,
                    }))
                  }}
                >
                  All
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3 border-t border-white/10 p-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleReconcile}
            className="flex-1"
            disabled={reconcile.isPending || pendingItems.length === 0}
          >
            {reconcile.isPending ? 'Saving...' : 'Confirm Received'}
          </Button>
        </div>
      </div>
    </div>
  )
}
