'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search } from 'lucide-react'
import { useAddInventoryItem, useSearchCards, useRecentCards } from '@/hooks/use-inventory'
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
  const { data: recentCards, isLoading: isLoadingRecent } = useRecentCards()
  const { data: searchResults, isLoading: isSearching } = useSearchCards(searchQuery)
  const addItem = useAddInventoryItem()

  const displayCards = searchQuery.length > 2 ? searchResults : recentCards
  const isLoading = searchQuery.length > 2 ? isSearching : isLoadingRecent

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
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border-none">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#DC143C] to-[#FF1744] bg-clip-text text-transparent">Add Card to Inventory</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedCard ? (
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  {searchQuery.length > 2 ? 'Search Results' : 'Recent Pokemon Cards'}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by card name (e.g., Charizard)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#DC143C] border-r-transparent"></div>
                </div>
              )}

              {!isLoading && displayCards && displayCards.data.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayCards.data.map((card) => {
                    const marketPrice = pokemonApi.getMarketPrice(card)
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardSelect(card)}
                        className="text-left rounded-2xl border-none bg-gradient-to-br from-background to-accent/5 hover:shadow-md transition-all p-4 group"
                      >
                        <div className="aspect-[3/4] bg-accent/10 rounded-xl mb-3 relative overflow-hidden">
                          <Image
                            src={card.images.small}
                            alt={card.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform"
                            sizes="200px"
                          />
                        </div>
                        <h3 className="font-bold text-sm line-clamp-1">{card.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{card.set.name}</p>
                        {marketPrice && (
                          <p className="text-sm font-bold text-[#DC143C]">
                            ~{formatCurrency(marketPrice, 'USD')}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {!isLoading && searchQuery.length > 2 && displayCards?.data.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No cards found. Try a different search.</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex gap-6 pb-6 border-b">
                <div className="w-36 h-48 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl relative overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedCard.images.small}
                    alt={selectedCard.name}
                    fill
                    className="object-contain p-2"
                    sizes="144px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">{selectedCard.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{selectedCard.set.name}</p>
                  {pokemonApi.getMarketPrice(selectedCard) && (
                    <Badge variant="info" className="mb-3 rounded-lg">
                      Market Price: ~{formatCurrency(pokemonApi.getMarketPrice(selectedCard)!, 'USD')}
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCard(null)}
                    className="rounded-xl"
                  >
                    Choose Different Card
                  </Button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Location <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('location')}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 transition-all"
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
                  <label className="text-sm font-semibold">
                    Quantity <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 transition-all"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive">{errors.quantity.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Acquisition Cost (CAD) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('acquisitionCost', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pl-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 transition-all"
                  />
                </div>
                {errors.acquisitionCost && (
                  <p className="text-sm text-destructive">{errors.acquisitionCost.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add any additional notes..."
                  {...register('notes')}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]/20 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedCard(null)}
                  className="flex-1 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#DC143C] to-[#FF1744] hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all rounded-xl"
                  disabled={addItem.isPending}
                >
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
