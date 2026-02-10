'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search, Plus, Minus, Trash2, Check, ArrowDown, ArrowUp } from 'lucide-react'
import { useInventoryItems, InventoryItem, useSearchCards, useRecentCards } from '@/hooks/use-inventory'
import { useCreateTransaction, TransactionItemData } from '@/hooks/use-transactions'
import type { GameType, UnifiedCard } from '@/lib/card-types'
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

const tradeTransactionSchema = z.object({
  counterparty_name: z.string().min(1, 'Trade partner name is required'),
  counterparty_type: z.enum(['STORE', 'PERSON', 'ONLINE', 'OTHER']),
  cash_out: z.number().min(0).optional(),
  cash_in: z.number().min(0).optional(),
  transaction_date: z.string().optional(),
  notes: z.string().optional(),
})

type TradeTransactionForm = z.infer<typeof tradeTransactionSchema>

interface SelectedOutItem {
  item: InventoryItem
  trade_value: number
}

interface SelectedInItem {
  card: UnifiedCard
  quantity: number
  unit_value: number
  condition: typeof CONDITIONS[number]
  location: string
}

interface TradeTransactionModalProps {
  open: boolean
  onClose: () => void
}

export function TradeTransactionModal({ open, onClose }: TradeTransactionModalProps) {
  const [step, setStep] = useState<'give' | 'receive' | 'details'>('give')
  const [searchQuery, setSearchQuery] = useState('')
  const [inventorySearchQuery, setInventorySearchQuery] = useState('')
  const [gameType, setGameType] = useState<GameType>('pokemon')
  const [outItems, setOutItems] = useState<SelectedOutItem[]>([])
  const [inItems, setInItems] = useState<SelectedInItem[]>([])

  const { data: paginatedData, isLoading: isLoadingInventory } = useInventoryItems('IN_STOCK')
  const inventoryItems = paginatedData?.items
  const { data: recentCards, isLoading: isLoadingRecent } = useRecentCards(gameType)
  const { data: searchResults, isLoading: isSearching } = useSearchCards(searchQuery, gameType)
  const createTransaction = useCreateTransaction()
  const { formatConverted } = useCurrency()

  const filteredInventory = inventoryItems?.filter((item) =>
    inventorySearchQuery ? item.card_name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) : true
  )

  const displayCards = searchQuery.length > 2 ? searchResults : recentCards
  const isLoadingCards = searchQuery.length > 2 ? isSearching : isLoadingRecent

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TradeTransactionForm>({
    resolver: zodResolver(tradeTransactionSchema),
    defaultValues: {
      counterparty_type: 'PERSON',
      transaction_date: new Date().toISOString().split('T')[0],
      cash_out: 0,
      cash_in: 0,
    },
  })

  const totalOutValue = outItems.reduce((sum, oi) => sum + oi.trade_value, 0)
  const totalInValue = inItems.reduce((sum, ii) => sum + ii.unit_value * ii.quantity, 0)
  const cashOut = watch('cash_out') || 0
  const cashIn = watch('cash_in') || 0

  const handleSelectOutItem = (item: InventoryItem) => {
    const existing = outItems.find((oi) => oi.item.id === item.id)
    if (existing) {
      setOutItems(outItems.filter((oi) => oi.item.id !== item.id))
    } else {
      setOutItems([
        ...outItems,
        {
          item,
          trade_value: item.acquisition_cost * item.quantity,
        },
      ])
    }
  }

  const handleAddInItem = (card: UnifiedCard) => {
    const existing = inItems.find((ii) => ii.card.id === card.id)
    if (existing) {
      setInItems(
        inItems.map((ii) =>
          ii.card.id === card.id ? { ...ii, quantity: ii.quantity + 1 } : ii
        )
      )
    } else {
      setInItems([
        ...inItems,
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

  const handleUpdateInItem = (cardId: string, updates: Partial<SelectedInItem>) => {
    setInItems(
      inItems.map((ii) =>
        ii.card.id === cardId ? { ...ii, ...updates } : ii
      )
    )
  }

  const handleRemoveInItem = (cardId: string) => {
    setInItems(inItems.filter((ii) => ii.card.id !== cardId))
  }

  const handleRemoveOutItem = (itemId: string) => {
    setOutItems(outItems.filter((oi) => oi.item.id !== itemId))
  }

  const onSubmit = async (data: TradeTransactionForm) => {
    if (outItems.length === 0 && inItems.length === 0) return

    const items: TransactionItemData[] = [
      ...outItems.map((oi): TransactionItemData => ({
        direction: 'OUT',
        card_id: oi.item.card_id,
        card_name: oi.item.card_name,
        card_image: oi.item.card_image,
        set_name: oi.item.set_name,
        game_type: oi.item.game_type,
        condition: oi.item.condition,
        inventory_id: oi.item.id,
        quantity: oi.item.quantity,
        unit_value: oi.trade_value / oi.item.quantity,
        location: oi.item.location,
      })),
      ...inItems.map((ii): TransactionItemData => ({
        direction: 'IN',
        card_id: ii.card.id,
        card_name: ii.card.name,
        card_image: ii.card.imageSmall,
        set_name: ii.card.setName,
        game_type: ii.card.gameType,
        condition: ii.condition,
        quantity: ii.quantity,
        unit_value: ii.unit_value,
        location: ii.location,
      })),
    ]

    await createTransaction.mutateAsync({
      type: 'TRADE',
      counterparty_name: data.counterparty_name,
      counterparty_type: data.counterparty_type,
      transaction_date: data.transaction_date,
      cash_out: data.cash_out || 0,
      cash_in: data.cash_in || 0,
      notes: data.notes,
      items,
    })

    handleClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setInventorySearchQuery('')
    setOutItems([])
    setInItems([])
    setStep('give')
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
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title-trade" className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border-none">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 id="modal-title-trade" className="text-2xl font-bold bg-gradient-to-r from-vision-purple to-vision-pink bg-clip-text text-transparent">
            Record Trade Transaction
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-accent/50" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 py-3 border-b border-white/10">
          <button
            onClick={() => setStep('give')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              step === 'give'
                ? 'bg-red-500/20 text-red-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            1. Give
          </button>
          <span className="text-white/20">/</span>
          <button
            onClick={() => outItems.length > 0 && setStep('receive')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              step === 'receive'
                ? 'bg-green-500/20 text-green-400'
                : outItems.length > 0
                ? 'text-white/40 hover:text-white/60'
                : 'text-white/20 cursor-not-allowed'
            }`}
          >
            2. Receive
          </button>
          <span className="text-white/20">/</span>
          <button
            onClick={() => (outItems.length > 0 || inItems.length > 0) && setStep('details')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              step === 'details'
                ? 'bg-vision-purple/20 text-vision-purple'
                : outItems.length > 0 || inItems.length > 0
                ? 'text-white/40 hover:text-white/60'
                : 'text-white/20 cursor-not-allowed'
            }`}
          >
            3. Details
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'give' && (
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-red-400" />
                  Select Items to Give Away
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search your inventory..."
                    value={inventorySearchQuery}
                    onChange={(e) => setInventorySearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {isLoadingInventory && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vision-purple border-r-transparent" />
                </div>
              )}

              {!isLoadingInventory && filteredInventory && filteredInventory.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredInventory.map((item) => {
                    const isSelected = outItems.some((oi) => oi.item.id === item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectOutItem(item)}
                        className={`text-left rounded-2xl border-none bg-gradient-to-br from-background to-accent/5 hover:shadow-md transition-all p-4 group ${
                          isSelected ? 'ring-2 ring-red-400' : ''
                        }`}
                      >
                        <div className="aspect-[3/4] bg-accent/10 rounded-xl mb-3 relative overflow-hidden">
                          {item.card_image ? (
                            <Image
                              src={item.card_image}
                              alt={item.card_name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform"
                              sizes="200px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/40">
                              No image
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm line-clamp-1">{item.card_name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{item.set_name}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.condition}</Badge>
                          <p className="text-sm font-bold text-white/60">
                            {formatConverted(item.acquisition_cost)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {outItems.length > 0 && (
                <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 border-t border-white/10 -mx-6 px-6 -mb-6 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">
                        {outItems.length} item{outItems.length !== 1 ? 's' : ''} to give
                      </p>
                      <p className="text-lg font-bold text-red-400">
                        Value: {formatConverted(totalOutValue)}
                      </p>
                    </div>
                    <Button onClick={() => setStep('receive')} className="bg-vision-purple hover:bg-vision-purple/80">
                      Continue to Receive
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'receive' && (
            <div className="p-6 space-y-6">
              <div className="flex gap-2 mb-4">
                {GAME_TYPES.map((gt) => (
                  <button
                    key={gt.value}
                    type="button"
                    onClick={() => handleGameTypeChange(gt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      gameType === gt.value
                        ? 'bg-gradient-to-r from-vision-purple to-vision-pink text-white shadow-md'
                        : 'bg-accent/10 text-muted-foreground hover:bg-accent/20'
                    }`}
                  >
                    {gt.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-green-400" />
                  Search Cards to Receive
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by card name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {isLoadingCards && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vision-purple border-r-transparent" />
                </div>
              )}

              {!isLoadingCards && displayCards && displayCards.data.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayCards.data.map((card) => {
                    const isSelected = inItems.some((ii) => ii.card.id === card.id)
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleAddInItem(card)}
                        className={`text-left rounded-2xl border-none bg-gradient-to-br from-background to-accent/5 hover:shadow-md transition-all p-4 group ${
                          isSelected ? 'ring-2 ring-green-400' : ''
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
                            <div className="absolute top-2 right-2 bg-green-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {inItems.find((ii) => ii.card.id === card.id)?.quantity}
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm line-clamp-1">{card.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{card.setName}</p>
                        {card.marketPrice && (
                          <p className="text-sm font-bold text-green-400">
                            {formatConverted(card.marketPrice)}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 border-t border-white/10 -mx-6 px-6 -mb-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-white/40">Giving</p>
                        <p className="text-sm font-bold text-red-400">{formatConverted(totalOutValue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Receiving</p>
                        <p className="text-sm font-bold text-green-400">{formatConverted(totalInValue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('give')}>
                      Back
                    </Button>
                    <Button onClick={() => setStep('details')} className="bg-vision-purple hover:bg-vision-purple/80">
                      Continue to Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Items summary */}
              <div className="grid gap-4 sm:grid-cols-2">
                {outItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Giving ({outItems.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {outItems.map((oi) => (
                        <div key={oi.item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-sm">
                          <span className="truncate flex-1">{oi.item.card_name}</span>
                          <span className="text-white/60">{formatConverted(oi.trade_value)}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-400"
                            onClick={() => handleRemoveOutItem(oi.item.id)}
                            aria-label={`Remove ${oi.item.card_name} from give list`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Receiving ({inItems.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {inItems.map((ii) => (
                        <div key={ii.card.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-sm">
                          <span className="truncate flex-1">{ii.card.name}</span>
                          <input
                            type="number"
                            step="0.01"
                            value={ii.unit_value}
                            onChange={(e) => handleUpdateInItem(ii.card.id, { unit_value: Number(e.target.value) })}
                            className="w-16 rounded border border-input bg-background px-1 py-0.5 text-xs text-right"
                          />
                          <select
                            value={ii.condition}
                            onChange={(e) => handleUpdateInItem(ii.card.id, { condition: e.target.value as typeof CONDITIONS[number] })}
                            className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-xs text-white cursor-pointer"
                          >
                            {CONDITIONS.map((c) => (
                              <option key={c} value={c} className="bg-vision-navy text-white">{c}</option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-400"
                            onClick={() => handleRemoveInItem(ii.card.id)}
                            aria-label={`Remove ${ii.card.name} from receive list`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Trade Partner <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register('counterparty_name')}
                    placeholder="Who you traded with"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 transition-all"
                  />
                  {errors.counterparty_name && (
                    <p className="text-sm text-destructive">{errors.counterparty_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Type</label>
                  <select
                    {...register('counterparty_type')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/50 transition-all appearance-none cursor-pointer"
                  >
                    {COUNTERPARTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-vision-navy text-white">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Cash You Paid (optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('cash_out', { valueAsNumber: true })}
                      className="w-full rounded-xl border border-input bg-background pl-8 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Cash You Received (optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('cash_in', { valueAsNumber: true })}
                      className="w-full rounded-xl border border-input bg-background pl-8 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    {...register('transaction_date')}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Notes (optional)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  placeholder="Any additional notes about the trade..."
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-purple/20 resize-none transition-all"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Items Given Value:</span>
                  <span className="text-red-400">-{formatConverted(totalOutValue)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Items Received Value:</span>
                  <span className="text-green-400">+{formatConverted(totalInValue)}</span>
                </div>
                {cashOut > 0 && (
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Cash Paid:</span>
                    <span className="text-red-400">-{formatConverted(cashOut)}</span>
                  </div>
                )}
                {cashIn > 0 && (
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Cash Received:</span>
                    <span className="text-green-400">+{formatConverted(cashIn)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 mt-2">
                  <span>Net Value:</span>
                  <span className={(totalInValue + cashIn - totalOutValue - cashOut) >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {(totalInValue + cashIn - totalOutValue - cashOut) >= 0 ? '+' : ''}
                    {formatConverted(totalInValue + cashIn - totalOutValue - cashOut)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('receive')} className="flex-1 rounded-xl">
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-vision-purple to-vision-pink hover:shadow-lg hover:shadow-vision-purple/20 transition-all rounded-xl"
                  disabled={createTransaction.isPending}
                >
                  {createTransaction.isPending ? 'Recording...' : 'Record Trade'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
