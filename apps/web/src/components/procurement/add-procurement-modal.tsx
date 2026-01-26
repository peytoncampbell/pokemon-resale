'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useAddProcurement } from '@/hooks/use-procurement'

const addProcurementSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  order_date: z.string().optional(),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  shipping: z.number().min(0, 'Shipping must be positive'),
  fees: z.number().min(0, 'Fees must be positive'),
  notes: z.string().optional(),
})

type AddProcurementForm = z.infer<typeof addProcurementSchema>

interface AddProcurementModalProps {
  open: boolean
  onClose: () => void
}

const COMMON_SUPPLIERS = [
  'TCGPlayer',
  'eBay',
  'Card Shop',
  'Facebook Marketplace',
  'Local Store',
  'Other',
]

export function AddProcurementModal({ open, onClose }: AddProcurementModalProps) {
  const addProcurement = useAddProcurement()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddProcurementForm>({
    resolver: zodResolver(addProcurementSchema),
    defaultValues: {
      supplier: '',
      order_date: new Date().toISOString().split('T')[0],
      subtotal: 0,
      shipping: 0,
      fees: 0,
      notes: '',
    },
  })

  const subtotal = watch('subtotal') || 0
  const shipping = watch('shipping') || 0
  const fees = watch('fees') || 0
  const total = subtotal + shipping + fees

  const onSubmit = async (data: AddProcurementForm) => {
    try {
      await addProcurement.mutateAsync({
        supplier: data.supplier,
        order_date: data.order_date,
        subtotal: data.subtotal,
        shipping: data.shipping,
        fees: data.fees,
        notes: data.notes,
      })
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to add procurement:', error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl m-4 border-none">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#DC143C] to-[#FF1744] bg-clip-text text-transparent">
            New Procurement Order
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier / Source *</Label>
            <select
              {...register('supplier')}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 transition-all"
            >
              <option value="">Select a supplier...</option>
              {COMMON_SUPPLIERS.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
            {errors.supplier && (
              <p className="text-sm text-destructive">{errors.supplier.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_date">Order Date</Label>
            <Input
              type="date"
              {...register('order_date')}
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('subtotal', { valueAsNumber: true })}
                className="rounded-xl"
              />
              {errors.subtotal && (
                <p className="text-sm text-destructive">{errors.subtotal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping">Shipping ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('shipping', { valueAsNumber: true })}
                className="rounded-xl"
              />
              {errors.shipping && (
                <p className="text-sm text-destructive">{errors.shipping.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('fees', { valueAsNumber: true })}
                className="rounded-xl"
              />
              {errors.fees && (
                <p className="text-sm text-destructive">{errors.fees.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-[#DC143C]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              rows={2}
              placeholder="Add any notes about this order..."
              {...register('notes')}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 resize-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#DC143C] to-[#FF1744] hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all rounded-xl"
              disabled={addProcurement.isPending}
            >
              {addProcurement.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
