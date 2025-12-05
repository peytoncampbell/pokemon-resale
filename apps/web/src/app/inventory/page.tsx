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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">
              Manage your Pokemon card inventory
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border p-1">
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
          <Button
            variant={!statusFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(undefined)}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'IN_STOCK' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('IN_STOCK')}
          >
            In Stock
          </Button>
          <Button
            variant={statusFilter === 'LISTED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('LISTED')}
          >
            Listed
          </Button>
          <Button
            variant={statusFilter === 'SOLD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('SOLD')}
          >
            Sold
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
          <p className="text-sm font-medium">
            {filteredItems?.length || 0} items
          </p>
          <p className="text-sm font-medium">
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center relative">
                      {item.card_image ? (
                        <Image
                          src={item.card_image}
                          alt={item.card_name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-sm text-muted-foreground">No image</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{item.card_name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.set_name || 'Unknown Set'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_COLORS[item.status]}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Cost</p>
                          <p className="font-bold">{formatCurrency(item.acquisition_cost)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteItem.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="h-20 w-14 rounded bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {item.card_image ? (
                          <Image
                            src={item.card_image}
                            alt={item.card_name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <p className="text-xs text-muted-foreground">No image</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.card_name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.set_name || 'Unknown Set'}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_COLORS[item.status]}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                      <span className="text-lg font-bold whitespace-nowrap">
                        {formatCurrency(item.acquisition_cost)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No inventory items found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first card'}
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
    </MainLayout>
  )
}
