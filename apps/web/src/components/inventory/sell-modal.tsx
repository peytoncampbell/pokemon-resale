'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, DollarSign } from 'lucide-react'
import { useSellInventory } from '@/hooks/use-sales'
import { calculateFeeEstimate } from '@/lib/pnl/calculations'
import type { InventoryItem } from '@/lib/supabase'
import type { Platform } from '@/lib/pnl/types'
import { toast } from 'sonner'
import Image from 'next/image'

interface SellModalProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
}

const saleSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  sale_price: z.number().min(0.01, 'Sale price must be greater than 0'),
  platform: z.enum(['TCGPlayer', 'eBay', 'Direct', 'Other']),
  shipping_cost: z.number().min(0).optional(),
  buyer_name: z.string().optional(),
  notes: z.string().optional(),
})

type SaleFormData = z.infer<typeof saleSchema>

export function SellModal({ item, isOpen, onClose }: SellModalProps) {
  const [feeEstimate, setFeeEstimate] = useState<ReturnType<typeof calculateFeeEstimate> | null>(null)
  const sellMutation = useSellInventory()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      quantity: 1,
      sale_price: 0,
      platform: 'TCGPlayer',
      shipping_cost: 0,
    },
  })

  const watchedSalePrice = watch('sale_price')
  const watchedPlatform = watch('platform')
  const watchedQuantity = watch('quantity')

  // Update fee estimate when price or platform changes
  useEffect(() => {
    if (watchedSalePrice > 0) {
      const estimate = calculateFeeEstimate(watchedSalePrice, watchedPlatform as Platform)
      setFeeEstimate(estimate)
    } else {
      setFeeEstimate(null)
    }
  }, [watchedSalePrice, watchedPlatform])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
      setFeeEstimate(null)
    }
  }, [isOpen, reset])

  const onSubmit = async (data: SaleFormData) => {
    if (!item) return

    try {
      const result = await sellMutation.mutateAsync({
        inventory_id: item.id,
        quantity: data.quantity,
        sale_price: data.sale_price,
        platform: data.platform,
        shipping_cost: data.shipping_cost || 0,
      })

      toast.success(`Sale recorded! Profit: $${result.net_profit.toFixed(2)}`, {
        description: `${data.quantity}x ${item.card_name} sold for $${data.sale_price.toFixed(2)}`,
      })

      onClose()
    } catch (error) {
      toast.error('Failed to record sale', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleClose = () => {
    if (!sellMutation.isPending) {
      onClose()
    }
  }

  if (!isOpen || !item) return null

  // Calculate estimated profit if we have cost basis
  const estimatedProfit = feeEstimate && item.acquisition_cost
    ? feeEstimate.net_proceeds - (item.acquisition_cost * watchedQuantity)
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-sell"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-vision-cyan" />
            <h2
              id="modal-title-sell"
              className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent"
            >
              Record Sale
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={sellMutation.isPending}
            className="rounded-xl hover:bg-accent/50"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Item Info Card */}
            <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              {item.card_image && (
                <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.card_image}
                    alt={item.card_name}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-white truncate">{item.card_name}</h3>
                <p className="text-sm text-white/60 truncate">{item.set_name || 'Unknown Set'}</p>
                <p className="text-sm text-white/60 mt-1">
                  Condition: <span className="text-white">{item.condition || 'NM'}</span>
                </p>
                <p className="text-sm text-white/60">
                  Available: <span className="text-white">{item.quantity}</span>
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-white mb-2">
                  Quantity to Sell *
                </label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity', { valueAsNumber: true })}
                  min={1}
                  max={item.quantity}
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-400 mt-1">{errors.quantity.message}</p>
                )}
              </div>

              {/* Sale Price */}
              <div>
                <label htmlFor="sale_price" className="block text-sm font-medium text-white mb-2">
                  Sale Price (Total) *
                </label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  {...register('sale_price', { valueAsNumber: true })}
                  min={0.01}
                  className={errors.sale_price ? 'border-red-500' : ''}
                />
                {errors.sale_price && (
                  <p className="text-xs text-red-400 mt-1">{errors.sale_price.message}</p>
                )}
              </div>

              {/* Platform */}
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-white mb-2">
                  Platform *
                </label>
                <select
                  id="platform"
                  {...register('platform')}
                  className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white ring-offset-vision-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 focus-visible:border-vision-blue/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                >
                  <option value="TCGPlayer">TCGPlayer</option>
                  <option value="eBay">eBay</option>
                  <option value="Direct">Direct Sale</option>
                  <option value="Other">Other</option>
                </select>
                {errors.platform && (
                  <p className="text-xs text-red-400 mt-1">{errors.platform.message}</p>
                )}
              </div>

              {/* Shipping Cost */}
              <div>
                <label htmlFor="shipping_cost" className="block text-sm font-medium text-white mb-2">
                  Shipping Cost
                </label>
                <Input
                  id="shipping_cost"
                  type="number"
                  step="0.01"
                  {...register('shipping_cost', { valueAsNumber: true })}
                  min={0}
                  defaultValue={0}
                />
              </div>
            </div>

            {/* Buyer Name (optional) */}
            <div>
              <label htmlFor="buyer_name" className="block text-sm font-medium text-white mb-2">
                Buyer Name (Optional)
              </label>
              <Input
                id="buyer_name"
                type="text"
                {...register('buyer_name')}
                placeholder="Enter buyer name..."
              />
            </div>

            {/* Notes (optional) */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Additional notes about this sale..."
                className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white ring-offset-vision-navy placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 focus-visible:border-vision-blue/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
              />
            </div>

            {/* Fee Estimate Panel */}
            {feeEstimate && (
              <div className="rounded-xl bg-vision-blue/10 border border-vision-blue/20 p-4 space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-vision-cyan" />
                  Fee Estimate
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/60">Platform Fee</p>
                    <p className="text-white font-medium">
                      ${feeEstimate.total_fees.toFixed(2)}
                    </p>
                    <p className="text-xs text-white/40">
                      {(feeEstimate.fee_rate * 100).toFixed(2)}%
                      {feeEstimate.fixed_fee > 0 && ` + $${feeEstimate.fixed_fee.toFixed(2)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Net After Fees</p>
                    <p className="text-white font-medium">
                      ${feeEstimate.net_proceeds.toFixed(2)}
                    </p>
                  </div>
                </div>
                {estimatedProfit !== null && (
                  <div className="pt-3 border-t border-vision-blue/20">
                    <p className="text-white/60 text-sm">Estimated Profit</p>
                    <p className={`text-lg font-bold ${estimatedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {estimatedProfit >= 0 ? '+' : ''}${estimatedProfit.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={sellMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={sellMutation.isPending}
                className="flex-1"
              >
                {sellMutation.isPending ? 'Recording...' : 'Record Sale'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
