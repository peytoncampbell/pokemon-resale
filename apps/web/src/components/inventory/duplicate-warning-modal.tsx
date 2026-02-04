'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, MapPin, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { InventoryItem } from '@/lib/supabase'
import Image from 'next/image'
import { useCurrency } from '@/hooks/use-currency'

interface DuplicateWarningModalProps {
  open: boolean
  onClose: () => void
  onContinue: () => void
  duplicates: InventoryItem[]
  cardName: string
}

export function DuplicateWarningModal({
  open,
  onClose,
  onContinue,
  duplicates,
  cardName,
}: DuplicateWarningModalProps) {
  const { currency } = useCurrency()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title-duplicate-warning" className="relative w-full max-w-lg max-h-[80vh] overflow-hidden bg-vision-navy rounded-2xl shadow-2xl m-4 flex flex-col border border-white/10">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
          <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h2 id="modal-title-duplicate-warning" className="text-lg font-bold text-white">Duplicate Card Found</h2>
            <p className="text-sm text-white/60">This card already exists in your inventory</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">{cardName}</span> is already in your inventory.
            You can still add another copy if you'd like.
          </p>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Existing Copies ({duplicates.length})
            </p>
            {duplicates.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
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
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {item.condition}
                    </Badge>
                    <Badge variant="outline" className="text-xs gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {item.location}
                    </Badge>
                    {item.quantity > 1 && (
                      <span className="text-xs text-white/60">x{item.quantity}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-vision-cyan">{formatCurrency(item.acquisition_cost, currency)}</p>
                  <p className="text-xs text-white/60">{item.status.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 border-t border-white/10 p-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1"
          >
            Add Anyway
          </Button>
        </div>
      </div>
    </div>
  )
}
