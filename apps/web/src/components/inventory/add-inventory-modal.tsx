'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search, CreditCard, Package } from 'lucide-react'
import { useAddInventoryItem, useSearchCards, useRecentCards, useSearchSealed, useRecentSealed } from '@/hooks/use-inventory'
import { useCheckDuplicates } from '@/hooks/use-bulk-operations'
import type { GameType, ProductType, UnifiedCard } from '@/lib/card-types'
import { formatCurrency } from '@/lib/utils'
import { DuplicateWarningModal } from './duplicate-warning-modal'
import type { InventoryItem } from '@/lib/supabase'
import Image from 'next/image'
import { useCurrency } from '@/hooks/use-currency'

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

type ProductTab = 'cards' | 'sealed'

const PRODUCT_TABS: { value: ProductTab; label: string; icon: typeof CreditCard }[] = [
  { value: 'cards', label: 'Cards', icon: CreditCard },
  { value: 'sealed', label: 'Sealed', icon: Package },
]

export function AddInventoryModal({ open, onClose }: AddInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [gameType, setGameType] = useState<GameType>('pokemon')
  const [productTab, setProductTab] = useState<ProductTab>('cards')
  const [selectedCard, setSelectedCard] = useState<UnifiedCard | null>(null)
  const [duplicates, setDuplicates] = useState<InventoryItem[]>([])
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [pendingSubmitData, setPendingSubmitData] = useState<AddInventoryForm | null>(null)
  const { currency } = useCurrency()

  // Cards queries
  const { data: recentCards, isLoading: isLoadingRecentCards } = useRecentCards(gameType)
  const { data: searchCardsResults, isLoading: isSearchingCards } = useSearchCards(searchQuery, gameType, searchEnabled && productTab === 'cards')

  // Sealed queries
  const { data: recentSealed, isLoading: isLoadingRecentSealed } = useRecentSealed(gameType)
  const { data: searchSealedResults, isLoading: isSearchingSealed } = useSearchSealed(searchQuery, gameType, searchEnabled && productTab === 'sealed')

  const addItem = useAddInventoryItem()
  const checkDuplicates = useCheckDuplicates()

  // Determine which data to display based on product tab
  const displayCards = productTab === 'cards'
    ? (searchEnabled && searchQuery.length > 0 ? searchCardsResults : recentCards)
    : (searchEnabled && searchQuery.length > 0 ? searchSealedResults : recentSealed)

  const isLoading = productTab === 'cards'
    ? (searchEnabled && searchQuery.length > 0 ? isSearchingCards : isLoadingRecentCards)
    : (searchEnabled && searchQuery.length > 0 ? isSearchingSealed : isLoadingRecentSealed)

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

  const handleProductTabChange = (newTab: ProductTab) => {
    setProductTab(newTab)
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
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border-none">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent">
            Add {productTab === 'cards' ? 'Card' : 'Sealed Product'} to Inventory
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedCard ? (
            <div className="p-6 space-y-6">
              {/* Product Type Tabs */}
              <div className="flex gap-1 p-1 bg-accent/10 rounded-xl w-fit">
                {PRODUCT_TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleProductTabChange(tab.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        productTab === tab.value
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Game Type Buttons */}
              <div className="flex gap-2">
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
                  {searchEnabled && searchQuery.length > 0
                    ? 'Search Results'
                    : `Recent ${gameType === 'pokemon' ? 'Pokemon' : 'One Piece'} ${productTab === 'cards' ? 'Cards' : 'Sealed Products'}`}
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={productTab === 'cards' ? 'Search cards...' : 'Search sealed products (booster box, ETB, etc.)...'}
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
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter or click Search to find {productTab === 'cards' ? 'cards' : 'sealed products'}
                </p>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vision-blue border-r-transparent"></div>
                </div>
              )}

              {!isLoading && displayCards && displayCards.data.length > 0 && (
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[50px_1fr_1fr_100px] gap-3 px-4 py-2 bg-accent/10 text-xs font-semibold text-muted-foreground border-b border-white/10">
                    <div>Image</div>
                    <div>Name</div>
                    <div>Set</div>
                    <div className="text-right">Price</div>
                  </div>
                  {/* Table Rows */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {displayCards.data.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardSelect(card)}
                        className="w-full grid grid-cols-[50px_1fr_1fr_100px] gap-3 px-4 py-2 text-left hover:bg-accent/10 transition-colors border-b border-white/5 last:border-b-0 items-center"
                      >
                        <div className="w-10 h-14 bg-accent/10 rounded relative overflow-hidden flex-shrink-0">
                          <Image
                            src={card.imageSmall}
                            alt={card.name}
                            fill
                            className="object-contain"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{card.name}</span>
                            {card.productType === 'sealed' && (
                              <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 flex-shrink-0">
                                Sealed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground truncate">{card.setName}</div>
                        <div className="text-right">
                          {card.marketPrice ? (
                            <span className="text-sm font-bold text-vision-cyan">
                              {formatCurrency(card.marketPrice, currency)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && searchEnabled && searchQuery.length > 0 && displayCards?.data.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No {productTab === 'cards' ? 'cards' : 'sealed products'} found. Try a different search.
                  </p>
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
                      Market Price: {formatCurrency(selectedCard.marketPrice, currency)}
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCard(null)}
                    className="rounded-xl"
                  >
                    Choose Different {selectedCard.productType === 'sealed' ? 'Product' : 'Card'}
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
