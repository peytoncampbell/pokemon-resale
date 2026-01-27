'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { SupplierList } from '@/components/suppliers/supplier-list'
import { AddSupplierModal } from '@/components/suppliers/add-supplier-modal'
import { Plus, Search } from 'lucide-react'
import { useSuppliers } from '@/hooks/use-suppliers'

export default function SuppliersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: suppliers } = useSuppliers()

  const filteredSuppliers = suppliers?.filter((supplier) =>
    searchQuery
      ? supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40">Pages</span>
          <span className="text-white/40">/</span>
          <span className="text-white font-medium">Suppliers</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Suppliers</h1>
            <p className="text-white/60">
              Manage your card suppliers and sources
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
          />
        </div>

        <div className="glass-card px-6 py-4">
          <p className="text-sm font-semibold text-white">
            {filteredSuppliers?.length || 0} suppliers
          </p>
        </div>

        <SupplierList />

        <AddSupplierModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </MainLayout>
  )
}
