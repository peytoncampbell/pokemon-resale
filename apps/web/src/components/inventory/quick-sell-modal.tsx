'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DollarSign, Zap } from 'lucide-react'
import { useCreateTransaction, TransactionItemData } from '@/hooks/use-transactions'
import { useCurrency } from '@/hooks/use-currency'
import type { InventoryItem } from '@/lib/supabase'
import Image from 'next/image'

const PLATFORMS = [
  { value: 'ebay', label: 'eBay', fee: 13.25 },
  { value: 'tcgplayer', label: 'TCGPlayer', fee: 10.25 },
  { value: 'facebook', label: 'Facebook', fee: 0 },
  { value: 'local', label: 'Local/Cash', fee: 0 },
  { value: 'other', label: 'Other', fee: 0 },
] as const

const quickSellSchema = z.object({
  salePrice: z.number().min(0.01, 'Sale price must be greater than 0'),
  platform: z.enum(['ebay', 'tcgplayer', 'facebook', 'local', 'other']),
  platformFee: z.number().min(0).max(100).optional(),
  quantity: z.number().min(1),
})

type QuickSellForm = z.infer<typeof quickSellSchema>

interface QuickSellModalProps {
  open: boolean
  onClose: () => void
  item: InventoryItem | null
}

export function QuickSellModal({ open, onClose, item }: QuickSellModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<typeof PLATFORMS[number]>(PLATFORMS[0])
  const createTransaction = useCreateTransaction()
  const { formatConverted } = useCurrency()
  const priceInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuickSellForm>({
    resolver: zodResolver(quickSellSchema),
    defaultValues: {
      salePrice: 0,
      platform: 'ebay',
      platformFee: 13.25,
      quantity: 1,
    },
  })

  const salePrice = watch('salePrice')
  const platformFee = watch('platformFee') || 0
  const quantity = watch('quantity')

  // Auto-focus on price field when modal opens
  useEffect(() => {
    if (open && priceInputRef.current) {
      setTimeout(() => {
        priceInputRef.current?.focus()
        priceInputRef.current?.select()
      }, 100)
    }
  }, [open])

  // Calculate net proceeds
  const grossSale = salePrice * quantity
  const feeAmount = grossSale * (platformFee / 100)
  const netProceeds = grossSale - feeAmount

  const handlePlatformChange = (platformValue: string) => {
    const platform = PLATFORMS.find((p) => p.value === platformValue)
    if (platform) {
      setSelectedPlatform(platform)
      setValue('platform', platform.value)
      setValue('platformFee', platform.fee)
    }
  }

  const onSubmit = async (data: QuickSellForm) => {
    if (!item) return

    const transactionItem: TransactionItemData = {
      direction: 'OUT',
      card_id: item.card_id,
      card_name: item.card_name,
      card_image: item.card_image,
      set_name: item.set_name,
      game_type: item.game_type,
      condition: item.condition,
      quantity: data.quantity,
      unit_value: data.salePrice,
      inventory_id: item.id,
    }

    try {
      await createTransaction.mutateAsync({
        type: 'SELL',
        counterparty_name: `${selectedPlatform.label} Sale`,
        counterparty_type: 'ONLINE',
        platform: selectedPlatform.label,
        transaction_date: new Date().toISOString().split('T')[0],
        cash_in: grossSale,
        fees: feeAmount,
        items: [transactionItem],
        notes: `Quick Sell via ${selectedPlatform.label}`,
      })

      reset()
      onClose()
    } catch (error) {
      console.error('Failed to create quick sell transaction:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!item) return null

  return (
    <Dialog open={open} onClose={handleClose} title="Quick Sell" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="space-y-6">
          {/* Item Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/10 border border-white/10">
            <div className="w-16 h-24 rounded-lg bg-accent/10 flex-shrink-0 relative overflow-hidden">
              {item.card_image ? (
                <Image
                  src={item.card_image}
                  alt={item.card_name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{item.card_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{item.set_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-accent text-foreground">
                  {item.condition}
                </span>
                <span className="text-xs text-muted-foreground">
                  Available: {item.quantity}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Selection - Large Touch Targets */}
          <div>
            <label className="block text-sm font-semibold mb-2">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformChange(platform.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPlatform.value === platform.value
                      ? 'border-vision-cyan bg-vision-cyan/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-semibold">{platform.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {platform.fee > 0 ? `${platform.fee}% fee` : 'No fee'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sale Price - Large Touch Target */}
          <div>
            <label className="block text-sm font-semibold mb-2">Sale Price</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                {...register('salePrice', {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === '' ? 0 : parseFloat(v)),
                })}
                ref={(e) => {
                  register('salePrice').ref(e)
                  priceInputRef.current = e
                }}
                className="w-full rounded-xl border border-input bg-background pl-14 pr-4 py-4 text-2xl font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
                placeholder="0.00"
              />
            </div>
            {errors.salePrice && (
              <p className="text-sm text-red-400 mt-1">{errors.salePrice.message}</p>
            )}
          </div>

          {/* Quantity */}
          {item.quantity > 1 && (
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <input
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                min={1}
                max={item.quantity}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
              />
            </div>
          )}

          {/* Summary */}
          {salePrice > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-vision-blue/10 to-vision-cyan/10 border border-vision-blue/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gross Sale</span>
                <span className="font-semibold">{formatConverted(grossSale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee ({platformFee}%)</span>
                <span className="font-semibold text-red-400">-{formatConverted(feeAmount)}</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between">
                <span className="font-semibold">Net Proceeds</span>
                <span className="font-bold text-lg text-vision-cyan">{formatConverted(netProceeds)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Profit</span>
                <span className={netProceeds - item.acquisition_cost * quantity >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatConverted(netProceeds - item.acquisition_cost * quantity)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createTransaction.isPending || salePrice <= 0}
            className="bg-gradient-to-r from-vision-blue to-vision-cyan"
          >
            <Zap className="mr-2 h-4 w-4" />
            {createTransaction.isPending ? 'Processing...' : 'Complete Sale'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
