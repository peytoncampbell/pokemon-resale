'use client'

import { useState, useCallback, useMemo } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useInventoryItems, useDeleteInventoryItem } from '@/hooks/use-inventory'
import { useInventoryFilters, filterInventory, getUniqueLocations, getFilterCounts } from '@/hooks/use-inventory-filters'
import { useExportInventory } from '@/hooks/use-export'
import { useCurrency } from '@/hooks/use-currency'
import { Grid3X3, List, Plus, Search, MapPin, Trash2 } from 'lucide-react'
import { AddInventoryModal } from '@/components/inventory/add-inventory-modal'
import { BulkActionBar } from '@/components/inventory/bulk-action-bar'
import { FilterPanel } from '@/components/inventory/filter-panel'
import { ExportButton } from '@/components/export/export-button'
import { SummaryBar } from '@/components/ui/summary-bar'
import { SkeletonInventoryCard } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { AnimatedGrid, AnimatedList } from '@/components/ui/animated-list'
import { HoloCard } from '@/components/ui/holo-card'
import { ErrorBoundary } from '@/components/error-boundary'
import Image from 'next/image'

const STATUS_COLORS = {
  IN_STOCK: 'success',
  LISTED: 'info',
  SOLD: 'secondary',
  SHIPPED: 'default',
} as const

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Filter state management
  const { filters, setFilter, clearFilters, activeFilterCount, hasActiveFilters } = useInventoryFilters()

  // Fetch all items (we filter client-side for now)
  const { data: paginatedData, isLoading, error } = useInventoryItems()
  const items = paginatedData?.items
  const deleteItem = useDeleteInventoryItem()
  const { exportInventory, isExporting } = useExportInventory()
  const { formatConverted } = useCurrency()

  // Apply filters and sorting
  const filteredItems = useMemo(() => {
    if (!items) return []
    return filterInventory(items, filters)
  }, [items, filters])

  // Get unique locations for the filter dropdown
  const locations = useMemo(() => {
    if (!items) return []
    return getUniqueLocations(items)
  }, [items])

  // Get counts for filter badges
  const filterCounts = useMemo(() => {
    if (!items) return undefined
    return getFilterCounts(items)
  }, [items])

  // Calculate total value of visible items
  const totalValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => {
      if (item.status === 'IN_STOCK' || item.status === 'LISTED') {
        return sum + (item.acquisition_cost * item.quantity)
      }
      return sum
    }, 0)
  }, [filteredItems])

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
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

  const handleClearFilters = useCallback(() => {
    clearFilters()
    setSelectedIds([])
  }, [clearFilters])

  const isAllSelected = filteredItems.length > 0 && selectedIds.length === filteredItems.length
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredItems.length

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Inventory"
          description="Manage your Pokemon card collection"
          actions={
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          }
        />

        {/* Search and View Toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
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

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={setFilter}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
          locations={locations}
          counts={filterCounts}
        />

        {/* Summary Bar */}
        <SummaryBar
          left={
            <>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={toggleSelectAll}
                aria-label="Select all items"
              />
              <p className="text-sm font-semibold text-white">
                {filteredItems.length} items
                {items && filteredItems.length !== items.length && (
                  <span className="text-white/40 font-normal"> of {items.length}</span>
                )}
              </p>
            </>
          }
          right={`Total Value: ${formatConverted(totalValue)}`}
        />

        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load inventory</div>}>
        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonInventoryCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Failed to load inventory items</p>
          </div>
        )}

        {/* Inventory Items */}
        {!isLoading && !error && (
          <>
            {viewMode === 'grid' ? (
              <AnimatedGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <HoloCard key={item.id} type="default" className={`h-full ${selectedIds.includes(item.id) ? 'ring-2 ring-vision-cyan' : ''}`}>
                    <div className="relative h-full flex flex-col">
                      <div className="aspect-[3/4] bg-white/5 flex items-center justify-center relative">
                        <div className="absolute top-3 left-3 z-20">
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
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <p className="text-sm text-white/40">No image</p>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                        <div>
                          <h3 className="font-bold line-clamp-1 text-lg text-white group-hover:text-vision-cyan transition-colors">{item.card_name}</h3>
                          <p className="text-sm text-white/60 line-clamp-1">{item.set_name || 'Unknown Set'}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={STATUS_COLORS[item.status]}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {item.condition || 'NM'}
                          </Badge>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/10">
                          <div>
                            <p className="text-xs text-white/60 font-medium">Cost</p>
                            <p className="font-bold text-lg text-vision-cyan">{formatConverted(item.acquisition_cost)}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteItem.isPending}
                            className="hover:bg-red-500/10 text-red-400 z-20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </HoloCard>
                ))}
              </AnimatedGrid>
            ) : (
              <AnimatedList className="space-y-3">
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
                        {formatConverted(item.acquisition_cost)}
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
              </AnimatedList>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <EmptyState
                variant={hasActiveFilters ? 'search' : 'inventory'}
                title={hasActiveFilters ? 'No items found' : 'No inventory yet'}
                description={
                  hasActiveFilters
                    ? 'Try adjusting your filters to see more results'
                    : 'Get started by adding your first Pokemon card to the inventory'
                }
                action={{
                  label: hasActiveFilters ? 'Clear Filters' : 'Add Card',
                  onClick: () => {
                    if (hasActiveFilters) {
                      handleClearFilters()
                    } else {
                      setIsAddModalOpen(true)
                    }
                  },
                }}
                secondaryAction={
                  hasActiveFilters
                    ? { label: 'Add Card', onClick: () => setIsAddModalOpen(true) }
                    : undefined
                }
              />
            )}
          </>
        )}
        </ErrorBoundary>
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
