'use client'

import { Button } from '@/components/ui/button'
import { X, DollarSign, MapPin, Calendar, Tag, Package, TrendingUp, TrendingDown } from 'lucide-react'
import { StatusBadge } from '@/components/inventory/status-badge'
import { Badge } from '@/components/ui/badge'
import { usePriceHistory } from '@/hooks/use-price-history'
import { usePriceRefresh } from '@/hooks/use-price-history'
import { useCurrency } from '@/hooks/use-currency'
import type { InventoryItem } from '@/lib/supabase'
import type { InventoryStatus } from '@/lib/pnl/types'
import Image from 'next/image'

interface ItemDetailModalProps {
  item: InventoryItem | null
  isOpen: boolean
  onClose: () => void
  marketPrice: number | null
  onSellClick: (item: InventoryItem) => void
}

export function ItemDetailModal({ item, isOpen, onClose, marketPrice, onSellClick }: ItemDetailModalProps) {
  const { formatConverted } = useCurrency()
  const { refreshPrice, isRefreshing } = usePriceRefresh()

  const { data: priceData } = usePriceHistory(item?.card_id, item?.condition || 'NM', '30d')

  if (!isOpen || !item) return null

  const totalCost = item.acquisition_cost * item.quantity
  const totalMarketValue = marketPrice ? marketPrice * item.quantity : null
  const unrealizedGain = totalMarketValue !== null ? totalMarketValue - totalCost : null
  const gainPercentage = unrealizedGain !== null && totalCost > 0 ? (unrealizedGain / totalCost) * 100 : null

  const handleRefresh = () => {
    refreshPrice({
      cardId: item.card_id,
      cardName: item.card_name,
      gameType: item.game_type as 'pokemon' | 'onepiece',
    })
  }

  const createdDate = new Date(item.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-detail"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <Package className="h-6 w-6 text-vision-cyan flex-shrink-0" />
            <h2
              id="modal-title-detail"
              className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent truncate"
            >
              {item.card_name}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent/50 flex-shrink-0" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top section: Image + Key Info */}
          <div className="flex gap-6">
            {/* Card Image */}
            <div className="w-48 flex-shrink-0">
              {item.card_image ? (
                <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-white/5">
                  <Image
                    src={item.card_image}
                    alt={item.card_name}
                    fill
                    className="object-contain p-2"
                    sizes="192px"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-xl bg-white/5 flex items-center justify-center">
                  <p className="text-sm text-white/40">No image</p>
                </div>
              )}
            </div>

            {/* Key Details */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-white/60">{item.set_name || 'Unknown Set'}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StatusBadge status={item.status as InventoryStatus} />
                  <Badge variant="outline">{item.condition || 'NM'}</Badge>
                  <Badge variant="outline" className="capitalize">{item.game_type}</Badge>
                  <Badge variant="outline" className="capitalize">{item.product_type}</Badge>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-xs text-white/60 font-medium">Cost Basis</p>
                  <p className="text-lg font-bold text-white">{formatConverted(totalCost)}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-white/40">{formatConverted(item.acquisition_cost)} each × {item.quantity}</p>
                  )}
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-xs text-white/60 font-medium">Market Value</p>
                  {totalMarketValue !== null ? (
                    <>
                      <p className="text-lg font-bold text-vision-cyan">{formatConverted(totalMarketValue)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-white/40">{formatConverted(marketPrice!)} each</p>
                      )}
                    </>
                  ) : (
                    <p className="text-lg font-bold text-white/40">N/A</p>
                  )}
                </div>
              </div>

              {/* P&L */}
              {unrealizedGain !== null && (
                <div className={`rounded-xl p-3 border ${unrealizedGain >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center gap-2">
                    {unrealizedGain >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <p className="text-xs text-white/60 font-medium">Unrealized P&L</p>
                  </div>
                  <p className={`text-xl font-bold ${unrealizedGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {unrealizedGain >= 0 ? '+' : ''}{formatConverted(unrealizedGain)}
                    {gainPercentage !== null && (
                      <span className="text-sm font-medium ml-2">
                        ({gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(1)}%)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-white/60">Location</p>
                <p className="text-white font-medium">{item.location || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Tag className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-white/60">Quantity</p>
                <p className="text-white font-medium">{item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-white/60">Added</p>
                <p className="text-white font-medium">{createdDate}</p>
              </div>
            </div>
            {priceData?.freshness && (
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="h-4 w-4 text-white/40" />
                <div>
                  <p className="text-white/60">Price Freshness</p>
                  <p className={`font-medium capitalize ${
                    priceData.freshness === 'fresh' ? 'text-green-400' :
                    priceData.freshness === 'stale' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {priceData.freshness}
                    {priceData.hoursOld !== undefined && (
                      <span className="text-white/40 text-xs ml-1">({Math.round(priceData.hoursOld)}h ago)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Price Trend (if data available) */}
          {priceData && priceData.currentPrice !== null && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Price Trends</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Current</p>
                  <p className="text-white font-bold">{formatConverted(priceData.currentPrice)}</p>
                </div>
                {priceData.priceChange7d !== null && (
                  <div>
                    <p className="text-white/60">7d Change</p>
                    <p className={`font-bold ${priceData.priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {priceData.priceChange7d >= 0 ? '+' : ''}{formatConverted(priceData.priceChange7d)}
                    </p>
                  </div>
                )}
                {priceData.priceChange30d !== null && (
                  <div>
                    <p className="text-white/60">30d Change</p>
                    <p className={`font-bold ${priceData.priceChange30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {priceData.priceChange30d >= 0 ? '+' : ''}{formatConverted(priceData.priceChange30d)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Notes</h4>
              <p className="text-sm text-white/70">{item.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 px-6 py-4 flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex-1">
            {isRefreshing ? 'Refreshing...' : 'Refresh Price'}
          </Button>
          {(item.status === 'IN_STOCK' || item.status === 'LISTED') && (
            <Button
              variant="default"
              onClick={() => {
                onClose()
                onSellClick(item)
              }}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Sell Item
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
