'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { UnifiedCard } from '@/lib/card-types'
import Image from 'next/image'
import { useCurrency } from '@/hooks/use-currency'

const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'] as const

const LOCATIONS = [
  'BIN-01', 'BIN-02', 'BIN-03', 'BIN-04', 'BIN-05',
  'BIN-06', 'BIN-07', 'BIN-08', 'BIN-09', 'BIN-10',
]

const inventoryFormSchema = z.object({
  acquisitionCost: z.number().min(0, 'Cost must be positive'),
  location: z.string().min(1, 'Location is required'),
  condition: z.enum(CONDITIONS),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
})

export type InventoryFormData = z.infer<typeof inventoryFormSchema>

interface InventoryFormProps {
  selectedCard: UnifiedCard
  onSubmit: (data: InventoryFormData) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
}

export function InventoryForm({ selectedCard, onSubmit, onBack, isSubmitting }: InventoryFormProps) {
  const { currency, convertFromBase, formatConverted } = useCurrency()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      location: LOCATIONS[0],
      condition: 'NM',
      quantity: 1,
      acquisitionCost: 0,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* Selected Card Preview */}
      <div className="flex gap-6 pb-6 border-b">
        <div className="w-36 h-48 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl relative overflow-hidden flex-shrink-0">
          <Image
            src={selectedCard.imageSmall}
            alt={selectedCard.name}
            fill
            className="object-contain p-2"
            sizes="144px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-xl">{selectedCard.name}</h3>
            {selectedCard.productType === 'sealed' && (
              <Badge className="bg-amber-500 text-white text-xs">Sealed</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{selectedCard.setName}</p>
          {selectedCard.marketPrice && (
            <Badge variant="info" className="mb-3 rounded-lg">
              Market: {formatConverted(selectedCard.marketPrice)}
            </Badge>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="rounded-xl"
          >
            Choose Different {selectedCard.productType === 'sealed' ? 'Product' : 'Card'}
          </Button>
        </div>
      </div>

      {/* Location & Condition */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Location <span className="text-destructive">*</span>
          </label>
          <select
            {...register('location')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all appearance-none cursor-pointer"
          >
            {LOCATIONS.map((location) => (
              <option key={location} value={location} className="bg-vision-navy text-white">
                {location}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Condition <span className="text-destructive">*</span>
          </label>
          <select
            {...register('condition')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all appearance-none cursor-pointer"
          >
            <option value="NM" className="bg-vision-navy text-white">Near Mint (NM)</option>
            <option value="LP" className="bg-vision-navy text-white">Lightly Played (LP)</option>
            <option value="MP" className="bg-vision-navy text-white">Moderately Played (MP)</option>
            <option value="HP" className="bg-vision-navy text-white">Heavily Played (HP)</option>
            <option value="DMG" className="bg-vision-navy text-white">Damaged (DMG)</option>
          </select>
          {errors.condition && (
            <p className="text-sm text-destructive">{errors.condition.message}</p>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Quantity <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            min="1"
            {...register('quantity', { valueAsNumber: true })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      {/* Acquisition Cost */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Acquisition Cost ({currency}) <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
            $
          </span>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('acquisitionCost', { valueAsNumber: true })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pl-8 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
          />
        </div>
        {errors.acquisitionCost && (
          <p className="text-sm text-destructive">{errors.acquisitionCost.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Notes (optional)</label>
        <textarea
          rows={2}
          placeholder="Add any additional notes..."
          {...register('notes')}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 resize-none transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-xl"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-vision-blue to-vision-cyan hover:shadow-lg hover:shadow-vision-blue/20 transition-all rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add to Inventory'}
        </Button>
      </div>
    </form>
  )
}
