'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useAddInventoryItem } from '@/hooks/use-inventory'

const addInventorySchema = z.object({
  cardId: z.string().min(1, 'Product name is required'),
  locationId: z.string().min(1, 'Location is required'),
  condition: z.string().min(1, 'Condition is required'),
  acquisitionCost: z.number().min(0, 'Cost must be positive'),
  grade: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
})

type AddInventoryForm = z.infer<typeof addInventorySchema>

interface AddInventoryModalProps {
  open: boolean
  onClose: () => void
}

const LOCATIONS = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'BIN-01' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'BIN-02' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'BIN-03' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'BIN-04' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'BIN-05' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'BIN-06' },
  { id: '00000000-0000-0000-0000-000000000007', name: 'BIN-07' },
  { id: '00000000-0000-0000-0000-000000000008', name: 'BIN-08' },
  { id: '00000000-0000-0000-0000-000000000009', name: 'BIN-09' },
  { id: '00000000-0000-0000-0000-000000000010', name: 'BIN-10' },
]

const CONDITIONS = [
  'Sealed',
  'Near Mint',
  'Lightly Played',
  'Moderately Played',
  'Heavily Played',
  'Damaged',
  'Damaged Box',
]

export function AddInventoryModal({ open, onClose }: AddInventoryModalProps) {
  const addItem = useAddInventoryItem()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddInventoryForm>({
    resolver: zodResolver(addInventorySchema),
    defaultValues: {
      condition: 'Sealed',
      locationId: LOCATIONS[0].id,
    },
  })

  const onSubmit = async (data: AddInventoryForm) => {
    try {
      await addItem.mutateAsync(data)
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to add inventory item:', error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg m-4">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Add Inventory Item</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Product Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Charizard VMAX - Darkness Ablaze"
              {...register('cardId')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.cardId && (
              <p className="text-sm text-destructive">{errors.cardId.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Location <span className="text-destructive">*</span>
              </label>
              <select
                {...register('locationId')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {LOCATIONS.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <p className="text-sm text-destructive">{errors.locationId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Condition <span className="text-destructive">*</span>
              </label>
              <select
                {...register('condition')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <p className="text-sm text-destructive">{errors.condition.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Acquisition Cost (CAD) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('acquisitionCost', { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pl-7 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              {errors.acquisitionCost && (
                <p className="text-sm text-destructive">
                  {errors.acquisitionCost.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Grade (optional)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="e.g., 10"
                {...register('grade', { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.grade && (
                <p className="text-sm text-destructive">{errors.grade.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              rows={3}
              placeholder="Add any additional notes..."
              {...register('notes')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={addItem.isPending}
            >
              {addItem.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
