'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { X } from 'lucide-react'
import { useAddSupplier, useUpdateSupplier, type Supplier } from '@/hooks/use-suppliers'
import { useState, useEffect } from 'react'

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_name: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type SupplierForm = z.infer<typeof supplierSchema>

interface AddSupplierModalProps {
  open: boolean
  onClose: () => void
  supplier?: Supplier | null
}

export function AddSupplierModal({ open, onClose, supplier }: AddSupplierModalProps) {
  const [rating, setRating] = useState(supplier?.rating || 0)
  const addSupplier = useAddSupplier()
  const updateSupplier = useUpdateSupplier()
  const isEditing = !!supplier

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || '',
      contact_name: supplier?.contact_name || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      website: supplier?.website || '',
      address: supplier?.address || '',
      notes: supplier?.notes || '',
    },
  })

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        contact_name: supplier.contact_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        website: supplier.website || '',
        address: supplier.address || '',
        notes: supplier.notes || '',
      })
      setRating(supplier.rating || 0)
    } else {
      reset({
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        notes: '',
      })
      setRating(0)
    }
  }, [supplier, reset])

  const onSubmit = async (data: SupplierForm) => {
    try {
      const supplierData = {
        name: data.name,
        contact_name: data.contact_name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        website: data.website || undefined,
        address: data.address || undefined,
        notes: data.notes || undefined,
        rating: rating || undefined,
      }

      if (isEditing) {
        await updateSupplier.mutateAsync({ id: supplier.id, ...supplierData })
      } else {
        await addSupplier.mutateAsync(supplierData)
      }

      reset()
      setRating(0)
      onClose()
    } catch (error) {
      console.error('Failed to save supplier:', error)
    }
  }

  if (!open) return null

  const isPending = addSupplier.isPending || updateSupplier.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden bg-vision-navy rounded-2xl shadow-2xl m-4 flex flex-col border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Supplier' : 'Add Supplier'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register('name')}
              placeholder="Supplier name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Rating</label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Contact Name</label>
              <input
                {...register('contact_name')}
                placeholder="Contact person"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Phone</label>
              <input
                {...register('phone')}
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Website</label>
            <input
              {...register('website')}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50"
            />
            {errors.website && (
              <p className="text-sm text-red-400">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Address</label>
            <input
              {...register('address')}
              placeholder="Full address"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Additional notes..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 resize-none"
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
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
