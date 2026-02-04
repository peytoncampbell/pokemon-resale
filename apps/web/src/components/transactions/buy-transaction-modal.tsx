'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search, Plus, Minus, Trash2 } from 'lucide-react'
import { useSearchCards, useRecentCards } from '@/hooks/use-inventory'
import { useCreateTransaction, TransactionItemData } from '@/hooks/use-transactions'
import type { GameType, UnifiedCard } from '@/lib/card-types'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { useCurrency } from '@/hooks/use-currency'

const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'] as const
const LOCATIONS = ['BIN-01', 'BIN-02', 'BIN-03', 'BIN-04', 'BIN-05', 'BIN-06', 'BIN-07', 'BIN-08', 'BIN-09', 'BIN-10']
const COUNTERPARTY_TYPES = [
  { value: 'STORE', label: 'Store' },
  { value: 'PERSON', label: 'Person' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'OTHER', label: 'Other' },
] as const

const GAME_TYPES: { value: GameType; label: string }[] = [
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'onepiece', label: 'One Piece' },
]

const buyTransactionSchema = z.object({
  counterparty_name: z.string().min(1, 'Counterparty name is required'),
  counterparty_type: z.enum(['STORE', 'PERSON', 'ONLINE', 'OTHER']),
  platform: z.string().optional(),
  transaction_date: z.string().optional(),
  notes: z.string().optional(),
})

type BuyTransactionForm = z.infer<typeof buyTransactionSchema>

interface SelectedItem {
  card: UnifiedCard
  quantity: number
  unit_value: number
  condition: typeof CONDITIONS[number]
  location: string
}

interface BuyTransactionModalProps {
  open: boolean
  onClose: () => void
}

export function BuyTransactionModal({ open, onClose }: BuyTransactionModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [gameType, setGameType] = useState<GameType>('pokemon')
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [step, setStep] = useState<'search' | 'details'>('search')

  const { data: recentCards, isLoading: isLoadingRecent } = useRecentCards(gameType)
  const { data: searchResults, isLoading: isSearching } = useSearchCards(searchQuery, gameType)
  const createTransaction = useCreateTransaction()
  const { currency } = useCurrency()

  const displayCards = searchQuery.length > 2 ? searchResults : recentCards
  const isLoading = searchQuery.length > 2 ? isSearching : isLoadingRecent

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuyTransactionForm>({
    resolver: zodResolver(buyTransactionSchema),
    defaultValues: {
      counterparty_type: 'STORE',
      transaction_date: new Date().toISOString().split('T')[0],
    },
  })

  const totalCost = selectedItems.reduce((sum, item) => sum + item.unit_value * item.quantity, 0)

  const handleAddCard = (card: UnifiedCard) => {
    const existing = selectedItems.find((i) => i.card.id === card.id)
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.card.id === card.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          card,
          quantity: 1,
          unit_value: card.marketPrice || 0,
          condition: 'NM',
          location: LOCATIONS[0],
        },
      ])
    }
  }

  const handleUpdateItem = (cardId: string, updates: Partial<SelectedItem>) => {
    setSelectedItems(
      selectedItems.map((i) =>
        i.card.id === cardId ? { ...i, ...updates } : i
      )
    )
  }

  const handleRemoveItem = (cardId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.card.id !== cardId))
  }

  const onSubmit = async (data: BuyTransactionForm) => {
    if (selectedItems.length === 0) return

    const items: TransactionItemData[] = selectedItems.map((item) => ({
      direction: 'IN' as const,
      card_id: item.card.id,
      card_name: item.card.name,
      card_image: item.card.imageSmall,
      set_name: item.card.setName,
      game_type: item.card.gameType,
      condition: item.condition,
      quantity: item.quantity,
      unit_value: item.unit_value,
      location: item.location,
    }))

    await createTransaction.mutateAsync({
      type: 'BUY',
      counterparty_name: data.counterparty_name,
      counterparty_type: data.counterparty_type,
      platform: data.platform || undefined,
      transaction_date: data.transaction_date,
      cash_out: totalCost,
      notes: data.notes,
      items,
    })

    handleClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setSelectedItems([])
    setStep('search')
    reset()
    onClose()
  }

  const handleGameTypeChange = (newGameType: GameType) => {
    setGameType(newGameType)
    setSearchQuery('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={handleClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title-buy" className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border-none">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 id="modal-title-buy" className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent">
            Record Buy Transaction
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-accent/50" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'search' ? (
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
                  {searchQuery.length > 2 ? 'Search Results' : 'Recent Cards'}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by card name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vision-blue border-r-transparent" />
                </div>
              )}

              {!isLoading && displayCards && displayCards.data.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayCards.data.map((card) => {
                    const isSelected = selectedItems.some((i) => i.card.id === card.id)
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleAddCard(card)}
                        className={`text-left rounded-2xl border-none bg-gradient-to-br from-background to-accent/5 hover:shadow-md transition-all p-4 group ${
                          isSelected ? 'ring-2 ring-vision-cyan' : ''
                        }`}
                      >
                        <div className="aspect-[3/4] bg-accent/10 rounded-xl mb-3 relative overflow-hidden">
                          <Image
                            src={card.imageSmall}
                            alt={card.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform"
                            sizes="200px"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-vision-cyan text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {selectedItems.find((i) => i.card.id === card.id)?.quantity}
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm line-clamp-1">{card.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{card.setName}</p>
                        {card.marketPrice && (
                          <p className="text-sm font-bold text-vision-cyan">
                            {formatCurrency(card.marketPrice, currency)}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 border-t border-white/10 -mx-6 px-6 -mb-6 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">
                        {selectedItems.length} card{selectedItems.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-lg font-bold text-vision-cyan">
                        Total: {formatCurrency(totalCost, currency)}
                      </p>
                    </div>
                    <Button onClick={() => setStep('details')}>
                      Continue to Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Selected Cards</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.card.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-12 h-16 rounded-lg bg-white/5 flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={item.card.imageSmall}
                          alt={item.card.name}
                          fill
                          className="object-contain"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.card.name}</p>
                        <p className="text-sm text-white/60 truncate">{item.card.setName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateItem(item.card.id, { quantity: Math.max(1, item.quantity - 1) })}
                          aria-label={`Decrease quantity of ${item.card.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateItem(item.card.id, { quantity: item.quantity + 1 })}
                          aria-label={`Increase quantity of ${item.card.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_value}
                          onChange={(e) => handleUpdateItem(item.card.id, { unit_value: Number(e.target.value) })}
                          className="w-full rounded-lg border border-input bg-background px-2 py-1 text-sm text-right"
                        />
                      </div>
                      <select
                        value={item.condition}
                        onChange={(e) => handleUpdateItem(item.card.id, { condition: e.target.value as typeof CONDITIONS[number] })}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white cursor-pointer"
                      >
                        {CONDITIONS.map((c) => (
                          <option key={c} value={c} className="bg-vision-navy text-white">{c}</option>
                        ))}
                      </select>
                      <select
                        value={item.location}
                        onChange={(e) => handleUpdateItem(item.card.id, { location: e.target.value })}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white cursor-pointer"
                      >
                        {LOCATIONS.map((loc) => (
                          <option key={loc} value={loc} className="bg-vision-navy text-white">{loc}</option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleRemoveItem(item.card.id)}
                        aria-label={`Remove ${item.card.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <p className="text-lg font-bold text-vision-cyan">
                    Total: {formatCurrency(totalCost, currency)}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Bought From <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register('counterparty_name')}
                    placeholder="Store name or person"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/20 transition-all"
                  />
                  {errors.counterparty_name && (
                    <p className="text-sm text-destructive">{errors.counterparty_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Type</label>
                  <select
                    {...register('counterparty_type')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 transition-all appearance-none cursor-pointer"
                  >
                    {COUNTERPARTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-vision-navy text-white">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Platform (optional)</label>
                  <input
                    {...register('platform')}
                    placeholder="eBay, TCGPlayer, etc."
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    {...register('transaction_date')}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Notes (optional)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/20 resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('search')} className="flex-1 rounded-xl">
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-vision-blue to-vision-cyan hover:shadow-lg hover:shadow-vision-blue/20 transition-all rounded-xl"
                  disabled={createTransaction.isPending}
                >
                  {createTransaction.isPending ? 'Recording...' : 'Record Buy'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
