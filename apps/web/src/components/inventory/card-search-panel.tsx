'use client'

import { useState, useCallback } from 'react'
import { List } from 'react-window'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, CreditCard, Package } from 'lucide-react'
import { useSearchCards, useRecentCards, useSearchSealed, useRecentSealed } from '@/hooks/use-inventory'
import type { GameType, UnifiedCard } from '@/lib/card-types'
import Image from 'next/image'
import { useCurrency } from '@/hooks/use-currency'

const GAME_TYPES: { value: GameType; label: string }[] = [
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'onepiece', label: 'One Piece' },
]

type ProductTab = 'cards' | 'sealed'

const PRODUCT_TABS: { value: ProductTab; label: string; icon: typeof CreditCard }[] = [
  { value: 'cards', label: 'Cards', icon: CreditCard },
  { value: 'sealed', label: 'Sealed', icon: Package },
]

interface CardSearchPanelProps {
  onCardSelect: (card: UnifiedCard) => void
}

export function CardSearchPanel({ onCardSelect }: CardSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [gameType, setGameType] = useState<GameType>('pokemon')
  const [productTab, setProductTab] = useState<ProductTab>('cards')
  const { formatConverted } = useCurrency()

  // Cards queries
  const { data: recentCards, isLoading: isLoadingRecentCards, error: recentCardsError } = useRecentCards(gameType)
  const { data: searchCardsResults, isLoading: isSearchingCards, error: searchCardsError } = useSearchCards(
    searchQuery,
    gameType,
    searchEnabled && productTab === 'cards'
  )

  // Sealed queries
  const { data: recentSealed, isLoading: isLoadingRecentSealed, error: recentSealedError } = useRecentSealed(gameType)
  const { data: searchSealedResults, isLoading: isSearchingSealed, error: searchSealedError } = useSearchSealed(
    searchQuery,
    gameType,
    searchEnabled && productTab === 'sealed'
  )

  // Determine which data to display based on product tab
  const displayCards =
    productTab === 'cards'
      ? searchEnabled && searchQuery.length > 0
        ? searchCardsResults
        : recentCards
      : searchEnabled && searchQuery.length > 0
        ? searchSealedResults
        : recentSealed

  const isLoading =
    productTab === 'cards'
      ? searchEnabled && searchQuery.length > 0
        ? isSearchingCards
        : isLoadingRecentCards
      : searchEnabled && searchQuery.length > 0
        ? isSearchingSealed
        : isLoadingRecentSealed

  const fetchError =
    productTab === 'cards'
      ? searchEnabled && searchQuery.length > 0
        ? searchCardsError
        : recentCardsError
      : searchEnabled && searchQuery.length > 0
        ? searchSealedError
        : recentSealedError

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && searchQuery.length > 0) {
        e.preventDefault()
        setSearchEnabled(true)
      }
    },
    [searchQuery.length]
  )

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setSearchEnabled(false)
  }, [])

  const handleSearchClick = useCallback(() => {
    if (searchQuery.length > 0) {
      setSearchEnabled(true)
    }
  }, [searchQuery.length])

  const handleGameTypeChange = useCallback((newGameType: GameType) => {
    setGameType(newGameType)
    setSearchQuery('')
    setSearchEnabled(false)
  }, [])

  const handleProductTabChange = useCallback((newTab: ProductTab) => {
    setProductTab(newTab)
    setSearchQuery('')
    setSearchEnabled(false)
  }, [])

  return (
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

      {/* Search Input */}
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
              placeholder={
                productTab === 'cards'
                  ? 'Search cards...'
                  : 'Search sealed products (booster box, ETB, etc.)...'
              }
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vision-blue border-r-transparent"></div>
          <p className="text-xs text-muted-foreground">Searching TCGPlayer...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && fetchError && (
        <div className="text-center py-8 px-4">
          <p className="text-sm text-red-400 font-medium">Failed to load cards</p>
          <p className="text-xs text-muted-foreground mt-1">
            {fetchError instanceof Error && fetchError.message.includes('timeout')
              ? 'TCGPlayer is taking too long to respond. Try again in a moment.'
              : 'Something went wrong. Please try again.'}
          </p>
        </div>
      )}

      {/* Results Table */}
      {!isLoading && displayCards && displayCards.data.length > 0 && (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[50px_1fr_1fr_100px] gap-3 px-4 py-2 bg-accent/10 text-xs font-semibold text-muted-foreground border-b border-white/10">
            <div>Image</div>
            <div>Name</div>
            <div>Set</div>
            <div className="text-right">Price</div>
          </div>
          {displayCards.data.length >= 20 ? (
            // Use virtualization for large lists
            <List
              defaultHeight={400}
              rowCount={displayCards.data.length}
              rowHeight={72}
              rowProps={{ cards: displayCards.data, onCardSelect, formatConverted }}
              rowComponent={({ index, style, cards, onCardSelect, formatConverted }) => {
                const card = cards[index]
                return (
                  <button
                    key={card.id}
                    onClick={() => onCardSelect(card)}
                    style={style}
                    className="w-full grid grid-cols-[50px_1fr_1fr_100px] gap-3 px-4 py-2 text-left hover:bg-accent/10 transition-colors border-b border-white/5 items-center"
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
                          {formatConverted(card.marketPrice)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </button>
                )
              }}
            />
          ) : (
            // Render normally for small lists
            <div className="max-h-[400px] overflow-y-auto">
              {displayCards.data.map((card: UnifiedCard) => (
                <button
                  key={card.id}
                  onClick={() => onCardSelect(card)}
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
                        {formatConverted(card.marketPrice)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && searchEnabled && searchQuery.length > 0 && displayCards?.data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No {productTab === 'cards' ? 'cards' : 'sealed products'} found. Try a different search.
          </p>
        </div>
      )}
    </div>
  )
}
