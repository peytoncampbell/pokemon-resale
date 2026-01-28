'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search } from 'lucide-react'
import { useAddInventoryItem, useSearchCards, useRecentCards } from '@/hooks/use-inventory'
import { useCheckDuplicates } from '@/hooks/use-bulk-operations'
import type { GameType, UnifiedCard } from '@/lib/card-types'
import { formatCurrency } from '@/lib/utils'
import { DuplicateWarningModal } from './duplicate-warning-modal'
import type { InventoryItem } from '@/lib/supabase'
import Image from 'next/image'

const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'] as const

const addInventorySchema = z.object({
  acquisitionCost: z.number().min(0, 'Cost must be positive'),
  location: z.string().min(1, 'Location is required'),
  condition: z.enum(CONDITIONS),
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

const GAME_TYPES: { value: GameType; label: string }[] = [
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'onepiece', label: 'One Piece' },
]

export function AddInventoryModal({ open, onClose }: AddInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [gameType, setGameType] = useState<GameType>('pokemon')
  const [selectedCard, setSelectedCard] = useState<UnifiedCard | null>(null)
  const [duplicates, setDuplicates] = useState<InventoryItem[]>([])
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [pendingSubmitData, setPendingSubmitData] = useState<AddInventoryForm | null>(null)
  const { data: recentCards, isLoading: isLoadingRecent } = useRecentCards(gameType)
  const { data: searchResults, isLoading: isSearching } = useSearchCards(searchQuery, gameType, searchEnabled)
  const addItem = useAddInventoryItem()
  const checkDuplicates = useCheckDuplicates()

  const displayCards = searchEnabled && searchQuery.length > 0 ? searchResults : recentCards
  const isLoading = searchEnabled && searchQuery.length > 0 ? isSearching : isLoadingRecent

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.length > 0) {
      e.preventDefault()
      setSearchEnabled(true)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearchEnabled(false) // Reset trigger on new input
  }

  const handleSearchClick = () => {
    if (searchQuery.length > 0) {
      setSearchEnabled(true)
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddInventoryForm>({
    resolver: zodResolver(addInventorySchema),
    defaultValues: {
      location: LOCATIONS[0],
      condition: 'NM',
      quantity: 1,
      acquisitionCost: 0,
    },
  })

  const performAdd = async (data: AddInventoryForm) => {
    if (!selectedCard) return

    await addItem.mutateAsync({
      card_id: selectedCard.id,
      card_name: selectedCard.name,
      card_image: selectedCard.imageSmall,
      set_name: selectedCard.setName,
      location: data.location,
      condition: data.condition,
      acquisition_cost: data.acquisitionCost,
      quantity: data.quantity,
      notes: data.notes,
      game_type: selectedCard.gameType,
      product_type: selectedCard.productType,
    })
    reset()
    setSelectedCard(null)
    setSearchQuery('')
    setSearchEnabled(false)
    setDuplicates([])
    setPendingSubmitData(null)
    onClose()
  }

  const onSubmit = async (data: AddInventoryForm) => {
    if (!selectedCard) return

    try {
      const existingItems = await checkDuplicates.mutateAsync(selectedCard.id)

      if (existingItems.length > 0) {
        setDuplicates(existingItems)
        setPendingSubmitData(data)
        setShowDuplicateWarning(true)
        return
      }

      await performAdd(data)
    } catch (error) {
      console.error('Failed to add inventory item:', error)
    }
  }

  const handleDuplicateContinue = async () => {
    setShowDuplicateWarning(false)
    if (pendingSubmitData) {
      try {
        await performAdd(pendingSubmitData)
      } catch (error) {
        console.error('Failed to add inventory item:', error)
      }
    }
  }

  const handleCardSelect = (card: UnifiedCard) => {
    setSelectedCard(card)
    if (card.marketPrice) {
      reset({
        location: LOCATIONS[0],
        condition: 'NM',
        quantity: 1,
        acquisitionCost: card.marketPrice,
      })
    }
  }

  const handleGameTypeChange = (newGameType: GameType) => {
    setGameType(newGameType)
    setSearchQuery('')
    setSearchEnabled(false)
    setSelectedCard(null)
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent">Add Card to Inventory</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedCard ? (
            <div className="p-6 space-y-6">
              <div className="flex gap-2 mb-4">
                {GAME_TYPES.map((gt) => (
                  <button
                    key={gt.value}
                    type="button"
                    onClick={() => handleGameTypeChange(gt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      gameType === gt.value
                        ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-md'
                        : 'bg-accent/10 text-muted-foreground hover:bg-accent/20'
                    }`}
                  >
                    {gt.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  {searchEnabled && searchQuery.length > 0 ? 'Search Results' : `Recent ${gameType === 'pokemon' ? 'Pokemon' : 'One Piece'} Cards`}
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search cards or sealed products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSearchClick}
                    disabled={searchQuery.length === 0}
                    className="rounded-xl bg-gradient-to-r from-vision-blue to-vision-cyan hover:shadow-lg hover:shadow-vision-blue/20 transition-all"
                  >
                    Search
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Press Enter or click Search to find cards and sealed products</p>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vision-blue border-r-transparent"></div>
                </div>
              )}

              {!isLoading && displayCards && displayCards.data.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayCards.data.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardSelect(card)}
                      className="text-left rounded-2xl border-none bg-gradient-to-br from-background to-accent/5 hover:shadow-md transition-all p-4 group"
                    >
                      <div className="aspect-[3/4] bg-accent/10 rounded-xl mb-3 relative overflow-hidden">
                        <Image
                          src={card.imageSmall}
                          alt={card.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform"
                          sizes="200px"
                        />
                        {card.productType === 'sealed' && (
                          <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">
                            Sealed
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-sm line-clamp-1">{card.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{card.setName}</p>
                      {card.marketPrice && (
                        <p className="text-sm font-bold text-vision-cyan">
                          ~{formatCurrency(card.marketPrice, 'USD')}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!isLoading && searchEnabled && searchQuery.length > 0 && displayCards?.data.length === 0 && (
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
                    src={selectedCard.imageSmall}
                    alt={selectedCard.name}
                    fill
                    className="object-contain p-2"
                    sizes="144px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-xl">{selectedCard.name}</h3>
                    {selectedCard.productType === 'sealed' && (
                      <Badge className="bg-amber-500 text-white text-xs">Sealed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{selectedCard.setName}</p>
                  {selectedCard.marketPrice && (
                    <Badge variant="info" className="mb-3 rounded-lg">
                      Market Price: ~{formatCurrency(selectedCard.marketPrice, 'USD')}
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all appearance-none cursor-pointer"
                  >
                    {LOCATIONS.map((location) => (
                      <option key={location} value={location} className="bg-vision-navy text-white">
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
                    Condition <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('condition')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="NM" className="bg-vision-navy text-white">Near Mint (NM)</option>
                    <option value="LP" className="bg-vision-navy text-white">Lightly Played (LP)</option>
                    <option value="MP" className="bg-vision-navy text-white">Moderately Played (MP)</option>
                    <option value="HP" className="bg-vision-navy text-white">Heavily Played (HP)</option>
                    <option value="DMG" className="bg-vision-navy text-white">Damaged (DMG)</option>
                  </select>
                  {errors.condition && (
                    <p className="text-sm text-destructive">{errors.condition.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Quantity <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pl-8 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all"
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 resize-none transition-all"
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
                  className="flex-1 bg-gradient-to-r from-vision-blue to-vision-cyan hover:shadow-lg hover:shadow-vision-blue/20 transition-all rounded-xl"
                  disabled={addItem.isPending}
                >
                  {addItem.isPending ? 'Adding...' : 'Add to Inventory'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <DuplicateWarningModal
        open={showDuplicateWarning}
        onClose={() => {
          setShowDuplicateWarning(false)
          setPendingSubmitData(null)
        }}
        onContinue={handleDuplicateContinue}
        duplicates={duplicates}
        cardName={selectedCard?.name || ''}
      />
    </div>
  )
}
