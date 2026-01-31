'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreatePriceAlert } from '@/hooks/use-price-alerts'
import { useSearchCards } from '@/hooks/use-inventory'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import { X, Search, TrendingUp, TrendingDown, Percent, Bell, Mail, Loader2 } from 'lucide-react'
import type { Condition } from '@/types/filters'
import type { AlertType } from '@/types/price-intelligence'
import type { UnifiedCard } from '@/lib/card-types'

interface PriceAlertFormModalProps {
  open: boolean
  onClose: () => void
  preselectedCard?: {
    cardId: string
    cardName: string
    cardImage?: string
    setName?: string
    marketPrice?: number
  }
}

const CONDITIONS: Condition[] = ['NM', 'LP', 'MP', 'HP', 'DMG']

export function PriceAlertFormModal({ open, onClose, preselectedCard }: PriceAlertFormModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState<{
    cardId: string
    cardName: string
    cardImage?: string
    setName?: string
    marketPrice?: number
  } | null>(preselectedCard || null)
  const [condition, setCondition] = useState<Condition>('NM')
  const [alertType, setAlertType] = useState<AlertType>('below')
  const [targetPrice, setTargetPrice] = useState('')
  const [thresholdPercent, setThresholdPercent] = useState('')
  const [notifyInApp, setNotifyInApp] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState(false)

  const { data: searchResults, isLoading: isSearching } = useSearchCards(searchQuery, 'pokemon', searchQuery.length >= 2)
  const createAlert = useCreatePriceAlert()
  const { formatPrice } = useCurrency()

  const handleSelectCard = (card: UnifiedCard) => {
    setSelectedCard({
      cardId: card.id,
      cardName: card.name,
      cardImage: card.imageSmall,
      setName: card.setName,
      marketPrice: card.marketPrice ?? undefined,
    })
    setSearchQuery('')
    if (card.marketPrice) {
      setTargetPrice(card.marketPrice.toFixed(2))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCard) return

    await createAlert.mutateAsync({
      cardId: selectedCard.cardId,
      cardName: selectedCard.cardName,
      cardImage: selectedCard.cardImage,
      setName: selectedCard.setName,
      condition,
      alertType,
      targetPrice: alertType !== 'change_percent' ? parseFloat(targetPrice) : null,
      thresholdPercent: alertType === 'change_percent' ? parseFloat(thresholdPercent) : null,
      notifyInApp,
      notifyEmail,
    })

    onClose()
    resetForm()
  }

  const resetForm = () => {
    setSelectedCard(null)
    setSearchQuery('')
    setCondition('NM')
    setAlertType('below')
    setTargetPrice('')
    setThresholdPercent('')
    setNotifyInApp(true)
    setNotifyEmail(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg">Create Price Alert</CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white/60" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Card Search */}
            {!selectedCard ? (
              <div className="space-y-2">
                <Label>Search Card</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search for a card..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>

                {/* Search Results */}
                {isSearching && (
                  <div className="flex items-center gap-2 p-4 text-white/50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                )}
                {searchResults?.data && searchResults.data.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-60 overflow-y-auto rounded-lg border border-white/10">
                    {searchResults.data.slice(0, 10).map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectCard(card)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 transition-colors text-left"
                      >
                        {card.imageSmall && (
                          <div className="relative w-10 h-14 flex-shrink-0">
                            <Image
                              src={card.imageSmall}
                              alt={card.name}
                              fill
                              className="object-cover rounded"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{card.name}</p>
                          <p className="text-xs text-white/50">{card.setName}</p>
                        </div>
                        {card.marketPrice && (
                          <span className="text-sm text-emerald-400">
                            {formatPrice(card.marketPrice)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Selected Card</Label>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  {selectedCard.cardImage && (
                    <div className="relative w-12 h-16 flex-shrink-0">
                      <Image
                        src={selectedCard.cardImage}
                        alt={selectedCard.cardName}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{selectedCard.cardName}</p>
                    <p className="text-sm text-white/50">{selectedCard.setName}</p>
                    {selectedCard.marketPrice && (
                      <p className="text-sm text-emerald-400">
                        Current: {formatPrice(selectedCard.marketPrice)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCard(null)}
                    className="p-1.5 rounded-lg hover:bg-white/10"
                  >
                    <X className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              </div>
            )}

            {/* Condition */}
            <div className="space-y-2">
              <Label>Condition</Label>
              <div className="flex gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      condition === c
                        ? 'bg-vision-blue border-vision-blue text-white'
                        : 'border-white/10 text-white/70 hover:border-white/20'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Type */}
            <div className="space-y-2">
              <Label>Alert when price:</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAlertType('above')}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors',
                    alertType === 'above'
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : 'border-white/10 text-white/70 hover:border-white/20'
                  )}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Goes Above</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType('below')}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors',
                    alertType === 'below'
                      ? 'bg-red-500/20 border-red-500/30 text-red-400'
                      : 'border-white/10 text-white/70 hover:border-white/20'
                  )}
                >
                  <TrendingDown className="h-5 w-5" />
                  <span className="text-xs">Drops Below</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType('change_percent')}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors',
                    alertType === 'change_percent'
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : 'border-white/10 text-white/70 hover:border-white/20'
                  )}
                >
                  <Percent className="h-5 w-5" />
                  <span className="text-xs">Changes By</span>
                </button>
              </div>
            </div>

            {/* Target Value */}
            {alertType !== 'change_percent' ? (
              <div className="space-y-2">
                <Label>Target Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Threshold Percentage</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    placeholder="10"
                    value={thresholdPercent}
                    onChange={(e) => setThresholdPercent(e.target.value)}
                    className="pr-8"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">%</span>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            <div className="space-y-3">
              <Label>Notify me via:</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={notifyInApp}
                    onCheckedChange={(checked) => setNotifyInApp(checked as boolean)}
                  />
                  <Bell className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/80">In-app notification</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={notifyEmail}
                    onCheckedChange={(checked) => setNotifyEmail(checked as boolean)}
                  />
                  <Mail className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/80">Email notification</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedCard || createAlert.isPending}
                className="flex-1"
              >
                {createAlert.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create Alert'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
