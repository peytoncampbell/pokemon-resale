'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useInventoryItems, useDeleteInventoryItem } from '@/hooks/use-inventory'
import { formatCurrency } from '@/lib/utils'
import { Grid3X3, List, Plus, Search, MapPin, Trash2 } from 'lucide-react'
import { AddInventoryModal } from '@/components/inventory/add-inventory-modal'
import Image from 'next/image'

const STATUS_COLORS = {
  IN_STOCK: 'success',
  LISTED: 'info',
  SOLD: 'default',
} as const

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: items, isLoading, error } = useInventoryItems(statusFilter)
  const deleteItem = useDeleteInventoryItem()

  const filteredItems = items?.filter((item) =>
    searchQuery ? item.card_name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const totalValue = filteredItems?.reduce((sum, item) => {
    if (item.status === 'IN_STOCK' || item.status === 'LISTED') {
      return sum + (item.acquisition_cost * item.quantity)
    }
    return sum
  }, 0) || 0

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem.mutateAsync(id)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Inventory</h1>
            <p className="text-muted-foreground text-lg">
              Manage your Pokemon card collection
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-[#DC143C] to-[#FF1744] hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all rounded-xl px-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border p-1 bg-background shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] rounded-lg' : 'rounded-lg'}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] rounded-lg' : 'rounded-lg'}
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
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('IN_STOCK')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'IN_STOCK'
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setStatusFilter('LISTED')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'LISTED'
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            Listed
          </button>
          <button
            onClick={() => setStatusFilter('SOLD')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'SOLD'
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            Sold
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border-none bg-gradient-to-br from-background to-accent/10 px-6 py-4 shadow-sm">
          <p className="text-sm font-semibold">
            {filteredItems?.length || 0} items
          </p>
          <p className="text-sm font-semibold text-[#DC143C]">
            Total Value: {formatCurrency(totalValue)}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading inventory...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Failed to load inventory items</p>
          </div>
        )}

        {!isLoading && !error && filteredItems && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all group">
                    <div className="aspect-[3/4] bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center relative">
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
                          <p className="text-sm text-muted-foreground">No image</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold line-clamp-1 text-lg">{item.card_name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.set_name || 'Unknown Set'}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={STATUS_COLORS[item.status]} className="rounded-lg">
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="gap-1 rounded-lg">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Cost</p>
                          <p className="font-bold text-lg text-[#DC143C]">{formatCurrency(item.acquisition_cost)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteItem.isPending}
                          className="hover:bg-destructive/10 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="h-24 w-16 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {item.card_image ? (
                          <Image
                            src={item.card_image}
                            alt={item.card_name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        ) : (
                          <p className="text-xs text-muted-foreground">No image</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate text-lg">{item.card_name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.set_name || 'Unknown Set'}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_COLORS[item.status]} className="rounded-lg">
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="gap-1 rounded-lg">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <span className="text-lg font-bold whitespace-nowrap text-[#DC143C]">
                        {formatCurrency(item.acquisition_cost)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                        className="hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6 ring-8 ring-accent/5">
                  <Plus className="h-14 w-14 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No inventory items found</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  {searchQuery || statusFilter
                    ? 'Try adjusting your filters to see more results'
                    : 'Get started by adding your first Pokemon card to the inventory'}
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-[#DC143C] to-[#FF1744] hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all rounded-xl px-6"
                >
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
    </MainLayout>
  )
}
