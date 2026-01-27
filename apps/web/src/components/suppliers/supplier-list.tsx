'use client'

import { useState } from 'react'
import { useSuppliers, useDeleteSupplier, useSupplierStats, type Supplier } from '@/hooks/use-suppliers'
import { SupplierCard } from './supplier-card'
import { AddSupplierModal } from './add-supplier-modal'
import { Button } from '@/components/ui/button'
import { Plus, Store } from 'lucide-react'

function SupplierCardWithStats({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: Supplier
  onEdit: () => void
  onDelete: () => void
}) {
  const { data: stats } = useSupplierStats(supplier.id)

  return (
    <SupplierCard
      supplier={supplier}
      stats={stats || undefined}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

export function SupplierList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const { data: suppliers, isLoading, error } = useSuppliers()
  const deleteSupplier = useDeleteSupplier()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier? Associated orders will be unlinked.')) {
      await deleteSupplier.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-vision-blue border-r-transparent" />
          <p className="mt-2 text-sm text-white/60">Loading suppliers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
        <p className="text-sm text-red-400">Failed to load suppliers</p>
      </div>
    )
  }

  return (
    <>
      {suppliers && suppliers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCardWithStats
              key={supplier.id}
              supplier={supplier}
              onEdit={() => setEditingSupplier(supplier)}
              onDelete={() => handleDelete(supplier.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-28 w-28 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <Store className="h-14 w-14 text-white/40" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">No suppliers yet</h3>
          <p className="text-white/60 mb-6 text-center max-w-md">
            Add your first supplier to track where you source your cards
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      )}

      <AddSupplierModal
        open={isAddModalOpen || !!editingSupplier}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingSupplier(null)
        }}
        supplier={editingSupplier}
      />
    </>
  )
}
