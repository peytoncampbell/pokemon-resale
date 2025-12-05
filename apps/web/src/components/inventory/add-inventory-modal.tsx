'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search } from 'lucide-react'
import { useAddInventoryItem, useSearchCards } from '@/hooks/use-inventory'
import { pokemonApi, type PokemonCard } from '@/lib/pokemon-api'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

const addInventorySchema = z.object({
  acquisitionCost: z.number().min(0, 'Cost must be positive'),
  location: z.string().min(1, 'Location is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
})

type AddInventoryForm = z.infer<typeof addInventorySchema>

interface AddInventoryModalProps {
  open: boolean
  onClose: () => void
}

const LOCATIONS = [
  'BIN-01', 'BIN-02', 'BIN-03', 'BIN-04', 'BIN-05',
  'BIN-06', 'BIN-07', 'BIN-08', 'BIN-09', 'BIN-10',
]

export function AddInventoryModal({ open, onClose }: AddInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null)
  const { data: searchResults, isLoading: isSearching } = useSearchCards(searchQuery)
  const addItem = useAddInventoryItem()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddInventoryForm>({
    resolver: zodResolver(addInventorySchema),
    defaultValues: {
      location: LOCATIONS[0],
      quantity: 1,
      acquisitionCost: 0,
    },
  })

  const onSubmit = async (data: AddInventoryForm) => {
    if (!selectedCard) return

    try {
      await addItem.mutateAsync({
        card_id: selectedCard.id,
        card_name: selectedCard.name,
        card_image: selectedCard.images.small,
        set_name: selectedCard.set.name,
        location: data.location,
        acquisition_cost: data.acquisitionCost,
        quantity: data.quantity,
        notes: data.notes,
      })
      reset()
      setSelectedCard(null)
      setSearchQuery('')
      onClose()
    } catch (error) {
      console.error('Failed to add inventory item:', error)
    }
  }

  const handleCardSelect = (card: PokemonCard) => {
    setSelectedCard(card)
    const marketPrice = pokemonApi.getMarketPrice(card)
    if (marketPrice) {
      reset({
        location: LOCATIONS[0],
        quantity: 1,
        acquisitionCost: marketPrice,
      })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-background rounded-lg shadow-lg m-4 flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Add Card to Inventory</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedCard ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Pokemon Cards</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by card name (e.g., Charizard)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                  />
                </div>
              </div>

              {isSearching && (
                <div className="flex items-center justify-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                </div>
              )}

              {searchResults && searchResults.data.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.data.map((card) => {
                    const marketPrice = pokemonApi.getMarketPrice(card)
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardSelect(card)}
                        className="text-left rounded-lg border bg-card hover:bg-accent transition-colors p-3"
                      >
                        <div className="aspect-[3/4] bg-muted rounded mb-2 relative overflow-hidden">
                          <Image
                            src={card.images.small}
                            alt={card.name}
                            fill
                            className="object-contain"
                            sizes="200px"
                          />
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-1">{card.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{card.set.name}</p>
                        {marketPrice && (
                          <p className="text-sm font-bold text-primary mt-1">
                            ~{formatCurrency(marketPrice, 'USD')}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {searchQuery.length > 2 && !isSearching && searchResults?.data.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No cards found</p>
                </div>
              )}

              {searchQuery.length <= 2 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Type at least 3 characters to search
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="flex gap-4 pb-4 border-b">
                <div className="w-32 h-44 bg-muted rounded relative overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedCard.images.small}
                    alt={selectedCard.name}
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{selectedCard.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedCard.set.name}</p>
                  {pokemonApi.getMarketPrice(selectedCard) && (
                    <Badge variant="info" className="mb-2">
                      Market Price: ~{formatCurrency(pokemonApi.getMarketPrice(selectedCard)!, 'USD')}
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCard(null)}
                  >
                    Choose Different Card
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Location <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('location')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Quantity <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive">{errors.quantity.message}</p>
                  )}
                </div>
              </div>

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
                  <p className="text-sm text-destructive">{errors.acquisitionCost.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add any additional notes..."
                  {...register('notes')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedCard(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={addItem.isPending}>
                  {addItem.isPending ? 'Adding...' : 'Add to Inventory'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
