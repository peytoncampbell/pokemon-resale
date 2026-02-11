'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { AlertTriangle, MapPin } from 'lucide-react'
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
  const { formatConverted } = useCurrency()

  return (
    <Dialog open={open} onClose={onClose} title="Duplicate Card Found" size="md">
      <DialogContent className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80">
              <span className="font-semibold text-white">{cardName}</span> is already in your inventory.
              You can still add another copy if you'd like.
            </p>
          </div>
        </div>

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
                <p className="font-semibold text-vision-cyan">{formatConverted(item.acquisition_cost)}</p>
                <p className="text-xs text-white/60">{item.status.replace('_', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={onContinue} className="flex-1">
          Add Anyway
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
