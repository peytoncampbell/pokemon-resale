'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search, Trash2, Check } from 'lucide-react'
import { useInventoryItems, InventoryItem } from '@/hooks/use-inventory'
import { useCreateTransaction, TransactionItemData } from '@/hooks/use-transactions'
import Image from 'next/image'
import { useCurrency } from '@/hooks/use-currency'

const COUNTERPARTY_TYPES = [
  { value: 'STORE', label: 'Store' },
  { value: 'PERSON', label: 'Person' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'OTHER', label: 'Other' },
] as const

const PLATFORM_PRESETS = [
  { value: 'eBay', label: 'eBay', feeRate: 0.1325 },
  { value: 'TCGPlayer', label: 'TCGPlayer', feeRate: 0.1025 },
  { value: 'Facebook', label: 'Facebook', feeRate: 0 },
  { value: 'Local', label: 'Local', feeRate: 0 },
  { value: 'Other', label: 'Other', feeRate: null },
] as const

const sellTransactionSchema = z.object({
  counterparty_name: z.string().min(1, 'Buyer name is required'),
  counterparty_type: z.enum(['STORE', 'PERSON', 'ONLINE', 'OTHER']),
  platform: z.string().optional(),
  sale_price: z.number().min(0, 'Sale price must be positive'),
  fees: z.number().min(0).optional(),
  shipping_cost: z.number().min(0).optional(),
  transaction_date: z.string().optional(),
  notes: z.string().optional(),
})

type SellTransactionForm = z.infer<typeof sellTransactionSchema>

interface SelectedInventoryItem {
  item: InventoryItem
  sale_value: number
}

interface SellTransactionModalProps {
  open: boolean
  onClose: () => void
}

export function SellTransactionModal({ open, onClose }: SellTransactionModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<SelectedInventoryItem[]>([])
  const [step, setStep] = useState<'select' | 'details'>('select')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('eBay')
  const [feeManualOverride, setFeeManualOverride] = useState(false)

  const { data: paginatedData, isLoading } = useInventoryItems('IN_STOCK')
  const inventoryItems = paginatedData?.items
  const createTransaction = useCreateTransaction()
  const { formatConverted } = useCurrency()

  const filteredItems = inventoryItems?.filter((item) =>
    searchQuery ? item.card_name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SellTransactionForm>({
    resolver: zodResolver(sellTransactionSchema),
    defaultValues: {
      counterparty_type: 'PERSON',
      transaction_date: new Date().toISOString().split('T')[0],
      fees: 0,
      shipping_cost: 0,
    },
  })

  const totalAcquisitionCost = selectedItems.reduce(
    (sum, si) => sum + si.item.acquisition_cost * si.item.quantity,
    0
  )
  const salePrice = watch('sale_price') || 0
  const fees = watch('fees') || 0
  const shippingCost = watch('shipping_cost') || 0
  const netProfit = salePrice - fees - shippingCost - totalAcquisitionCost

  // Auto-calculate fees when platform or sale price changes (unless manually overridden)
  useEffect(() => {
    if (feeManualOverride) return
    const preset = PLATFORM_PRESETS.find((p) => p.value === selectedPlatform)
    if (preset && preset.feeRate !== null) {
      const calculatedFees = Math.round(salePrice * preset.feeRate * 100) / 100
      setValue('fees', calculatedFees)
    }
  }, [salePrice, selectedPlatform, feeManualOverride, setValue])

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform)
    setFeeManualOverride(false)
    setValue('platform', platform === 'Other' ? '' : platform)
  }

  const handleSelectItem = (item: InventoryItem) => {
    const existing = selectedItems.find((si) => si.item.id === item.id)
    if (existing) {
      setSelectedItems(selectedItems.filter((si) => si.item.id !== item.id))
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          item,
          sale_value: item.acquisition_cost * 1.3, // Default to 30% markup
        },
      ])
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((si) => si.item.id !== itemId))
  }

  const onSubmit = async (data: SellTransactionForm) => {
    if (selectedItems.length === 0) return

    const items: TransactionItemData[] = selectedItems.map((si) => ({
      direction: 'OUT' as const,
      card_id: si.item.card_id,
      card_name: si.item.card_name,
      card_image: si.item.card_image,
      set_name: si.item.set_name,
      game_type: si.item.game_type,
      condition: si.item.condition,
      inventory_id: si.item.id,
      quantity: si.item.quantity,
      unit_value: si.sale_value / si.item.quantity,
      location: si.item.location,
    }))

    await createTransaction.mutateAsync({
      type: 'SELL',
      counterparty_name: data.counterparty_name,
      counterparty_type: data.counterparty_type,
      platform: data.platform || selectedPlatform,
      transaction_date: data.transaction_date,
      cash_in: data.sale_price,
      fees: data.fees || 0,
      shipping_cost: data.shipping_cost || 0,
      notes: data.notes,
      items,
    })

    handleClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setSelectedItems([])
    setStep('select')
    setSelectedPlatform('eBay')
    setFeeManualOverride(false)
    reset()
    onClose()
  }

  const handleContinue = () => {
    // Set a reasonable default sale price based on selected items
    const suggestedPrice = selectedItems.reduce(
      (sum, si) => sum + si.item.acquisition_cost * si.item.quantity * 1.3,
      0
    )
    setValue('sale_price', Math.round(suggestedPrice * 100) / 100)
    setStep('details')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={handleClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-sell"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border-none"
      >
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 id="modal-title-sell" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Record Sale Transaction
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-accent/50" aria-label="Close sell transaction modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'select' ? (
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  Select Inventory Items to Sell
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search your inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-400 border-r-transparent" />
                </div>
              )}

              {!isLoading && filteredItems && filteredItems.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.some((si) => si.item.id === item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className={`text-left rounded-2xl border-none bg-gradient-to-br from-background to-accent/5 hover:shadow-md transition-all p-4 group ${
                          isSelected ? 'ring-2 ring-green-400' : ''
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
                            <div className="absolute top-2 right-2 bg-green-400 text-white rounded-full w-6 h-6 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm line-clamp-1">{item.card_name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{item.set_name}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.condition}</Badge>
                          <p className="text-sm font-bold text-green-400">
                            {formatConverted(item.acquisition_cost)}
                          </p>
                        </div>
                        {item.quantity > 1 && (
                          <p className="text-xs text-white/60 mt-1">Qty: {item.quantity}</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {!isLoading && (!filteredItems || filteredItems.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No items found matching your search' : 'No items in stock to sell'}
                  </p>
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 border-t border-white/10 -mx-6 px-6 -mb-6 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">
                        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-lg font-bold text-white/60">
                        Cost: {formatConverted(totalAcquisitionCost)}
                      </p>
                    </div>
                    <Button onClick={handleContinue} className="bg-green-500 hover:bg-green-600">
                      Continue to Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Items Being Sold</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedItems.map((si) => (
                    <div key={si.item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="w-12 h-16 rounded-lg bg-white/5 flex-shrink-0 relative overflow-hidden">
                        {si.item.card_image ? (
                          <Image
                            src={si.item.card_image}
                            alt={si.item.card_name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{si.item.card_name}</p>
                        <p className="text-sm text-white/60">
                          {si.item.condition} | Qty: {si.item.quantity} | Cost: {formatConverted(si.item.acquisition_cost)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleRemoveItem(si.item.id)}
                        aria-label={`Remove ${si.item.card_name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Sold To <span className="text-destructive">*</span>
                  </label>
                  <input
                    {...register('counterparty_name')}
                    placeholder="Buyer name"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all"
                  />
                  {errors.counterparty_name && (
                    <p className="text-sm text-destructive">{errors.counterparty_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Type</label>
                  <select
                    {...register('counterparty_type')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 transition-all appearance-none cursor-pointer"
                  >
                    {COUNTERPARTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-vision-navy text-white">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 transition-all appearance-none cursor-pointer"
                >
                  {PLATFORM_PRESETS.map((p) => (
                    <option key={p.value} value={p.value} className="bg-vision-navy text-white">
                      {p.label}{p.feeRate !== null ? ` (${(p.feeRate * 100).toFixed(2)}%)` : ''}
                    </option>
                  ))}
                </select>
                {selectedPlatform === 'Other' && (
                  <input
                    {...register('platform')}
                    placeholder="Enter platform name"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all mt-2"
                  />
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Sale Price <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('sale_price', { valueAsNumber: true })}
                      className="w-full rounded-xl border border-input bg-background pl-8 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all"
                    />
                  </div>
                  {errors.sale_price && (
                    <p className="text-sm text-destructive">{errors.sale_price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Fees
                    {!feeManualOverride && selectedPlatform !== 'Other' && (
                      <span className="text-xs text-white/40 ml-1">(auto)</span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('fees', { valueAsNumber: true })}
                      onChange={(e) => {
                        setFeeManualOverride(true)
                        setValue('fees', Number(e.target.value))
                      }}
                      className="w-full rounded-xl border border-input bg-background pl-8 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Shipping</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('shipping_cost', { valueAsNumber: true })}
                      className="w-full rounded-xl border border-input bg-background pl-8 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    {...register('transaction_date')}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Notes (optional)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/20 resize-none transition-all"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Acquisition Cost:</span>
                  <span>{formatConverted(totalAcquisitionCost)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Sale Price:</span>
                  <span>{formatConverted(salePrice)}</span>
                </div>
                {fees > 0 && (
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Fees:</span>
                    <span>-{formatConverted(fees)}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Shipping:</span>
                    <span>-{formatConverted(shippingCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 mt-2">
                  <span>Net Profit:</span>
                  <span className={netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {netProfit >= 0 ? '+' : ''}{formatConverted(netProfit)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('select')} className="flex-1 rounded-xl">
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/20 transition-all rounded-xl"
                  disabled={createTransaction.isPending}
                >
                  {createTransaction.isPending ? 'Recording...' : 'Record Sale'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
