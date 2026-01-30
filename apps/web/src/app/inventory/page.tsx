'use client'

import { useState, useCallback } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useInventoryItems, useDeleteInventoryItem } from '@/hooks/use-inventory'
import { useExportInventory } from '@/hooks/use-export'
import { formatCurrency } from '@/lib/utils'
import { useCurrency } from '@/hooks/use-currency'
import { Grid3X3, List, Plus, Search, MapPin, Trash2 } from 'lucide-react'
import { AddInventoryModal } from '@/components/inventory/add-inventory-modal'
import { BulkActionBar } from '@/components/inventory/bulk-action-bar'
import { ExportButton } from '@/components/export/export-button'
import Image from 'next/image'

const STATUS_COLORS = {
  IN_STOCK: 'success',
  LISTED: 'info',
  SOLD: 'secondary',
} as const

const CONDITION_LABELS = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged',
} as const

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<'IN_STOCK' | 'LISTED' | 'SOLD' | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data: items, isLoading, error } = useInventoryItems(statusFilter)
  const deleteItem = useDeleteInventoryItem()
  const { exportInventory, isExporting } = useExportInventory()
  const { currency } = useCurrency()

  const filteredItems = items?.filter((item) =>
    searchQuery ? item.card_name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const totalValue = filteredItems?.reduce((sum, item) => {
    if (item.status === 'IN_STOCK' || item.status === 'LISTED') {
      return sum + (item.acquisition_cost * item.quantity)
    }
    return sum
  }, 0) || 0

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (!filteredItems) return
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredItems.map(item => item.id))
    }
  }, [filteredItems, selectedIds.length])

  const clearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem.mutateAsync(id)
    }
  }

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (filteredItems) {
      await exportInventory(filteredItems, format)
    }
  }

  const isAllSelected = filteredItems && filteredItems.length > 0 && selectedIds.length === filteredItems.length
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < (filteredItems?.length || 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40">Pages</span>
          <span className="text-white/40">/</span>
          <span className="text-white font-medium">Inventory</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Inventory</h1>
            <p className="text-white/60">
              Manage your Pokemon card collection
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <ExportButton onExport={handleExport} isExporting={isExporting} />
            <div className="flex items-center gap-1 rounded-xl border border-white/10 p-1 bg-white/5">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !statusFilter
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('IN_STOCK')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'IN_STOCK'
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setStatusFilter('LISTED')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'LISTED'
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Listed
          </button>
          <button
            onClick={() => setStatusFilter('SOLD')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'SOLD'
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Sold
          </button>
        </div>

        <div className="flex items-center justify-between glass-card px-6 py-4">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={toggleSelectAll}
              aria-label="Select all items"
            />
            <p className="text-sm font-semibold text-white">
              {filteredItems?.length || 0} items
            </p>
          </div>
          <p className="text-sm font-semibold text-vision-cyan">
            Total Value: {formatCurrency(totalValue, currency)}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-vision-blue border-r-transparent"></div>
              <p className="mt-2 text-sm text-white/60">Loading inventory...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Failed to load inventory items</p>
          </div>
        )}

        {!isLoading && !error && filteredItems && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className={`overflow-hidden hover:shadow-lg hover:shadow-vision-blue/10 transition-all group ${selectedIds.includes(item.id) ? 'ring-2 ring-vision-cyan' : ''}`}>
                    <div className="aspect-[3/4] bg-white/5 flex items-center justify-center relative">
                      <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          aria-label={`Select ${item.card_name}`}
                        />
                      </div>
                      {item.card_image ? (
                        <Image
                          src={item.card_image}
                          alt={item.card_name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-sm text-white/40">No image</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold line-clamp-1 text-lg text-white">{item.card_name}</h3>
                        <p className="text-sm text-white/60 line-clamp-1">{item.set_name || 'Unknown Set'}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={STATUS_COLORS[item.status]}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {item.condition || 'NM'}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div>
                          <p className="text-xs text-white/60 font-medium">Cost</p>
                          <p className="font-bold text-lg text-vision-cyan">{formatCurrency(item.acquisition_cost, currency)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteItem.isPending}
                          className="hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className={`hover:shadow-lg hover:shadow-vision-blue/10 transition-all ${selectedIds.includes(item.id) ? 'ring-2 ring-vision-cyan' : ''}`}>
                    <CardContent className="flex items-center gap-4 p-5">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        aria-label={`Select ${item.card_name}`}
                      />
                      <div className="h-24 w-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {item.card_image ? (
                          <Image
                            src={item.card_image}
                            alt={item.card_name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        ) : (
                          <p className="text-xs text-white/40">No image</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate text-lg text-white">{item.card_name}</h3>
                        <p className="text-sm text-white/60 truncate">{item.set_name || 'Unknown Set'}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-white/60 mt-1">Quantity: {item.quantity}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_COLORS[item.status]}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {item.condition || 'NM'}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <span className="text-lg font-bold whitespace-nowrap text-vision-cyan">
                        {formatCurrency(item.acquisition_cost, currency)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                        className="hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-28 w-28 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Plus className="h-14 w-14 text-white/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">No inventory items found</h3>
                <p className="text-white/60 mb-6 text-center max-w-md">
                  {searchQuery || statusFilter
                    ? 'Try adjusting your filters to see more results'
                    : 'Get started by adding your first Pokemon card to the inventory'}
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AddInventoryModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <BulkActionBar
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
      />
    </MainLayout>
  )
}
