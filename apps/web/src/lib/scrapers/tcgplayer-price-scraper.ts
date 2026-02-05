// TCGPlayer Price Scraper
// Fetches current market prices for individual cards using existing TCGPlayer scraper

import type { GameType } from '@/lib/tcg/types'
import { scrapeTCGPlayer } from '@/lib/tcg/tcgplayer-scraper'
import { savePriceSnapshot } from '@/lib/price/staleness'
import { retryWithBackoff } from './scraper-utils'

export interface TCGPlayerPriceOptions {
  cardId?: string
  cardName: string
  gameType: GameType
  setName?: string
  productType?: 'card' | 'sealed'
}

export interface TCGPlayerPriceResult {
  card_id: string
  market_price: number | null
  low_price: number | null
  source: 'tcgplayer'
}

/**
 * Find best matching card from search results
 * Prioritizes exact name match, falls back to closest match
 */
function findBestMatch(cards: any[], cardName: string): any | null {
  if (cards.length === 0) return null

  const normalizedSearch = cardName.toLowerCase().trim()

  // Try exact match first
  const exactMatch = cards.find(
    (card) => card.name.toLowerCase().trim() === normalizedSearch
  )
  if (exactMatch) return exactMatch

  // Try substring match
  const substringMatch = cards.find((card) =>
    card.name.toLowerCase().includes(normalizedSearch)
  )
  if (substringMatch) return substringMatch

  // Return first result as fallback
  return cards[0]
}

/**
 * Scrape TCGPlayer for a single card's price and save as snapshot
 * Wraps existing scrapeTCGPlayer function to extract and store prices
 */
export async function scrapeTCGPlayerPrice(
  options: TCGPlayerPriceOptions
): Promise<TCGPlayerPriceResult> {
  const { cardId, cardName, gameType, setName, productType = 'card' } = options

  // Use retry logic for resilience
  const result = await retryWithBackoff(
    async () => {
      // Call existing TCGPlayer scraper with card name as query
      const cards = await scrapeTCGPlayer({
        query: cardName,
        gameType,
        setName,
        productType: productType === 'card' ? 'Cards' : 'Sealed Products',
      })

      // Find best matching card
      const bestMatch = findBestMatch(cards, cardName)

      if (!bestMatch) {
        throw new Error(`No TCGPlayer results found for card: ${cardName}`)
      }

      // Extract prices
      const marketPrice = bestMatch.marketPrice
      const lowPrice = bestMatch.lowPrice

      // Use caller's cardId if provided (matches inventory), fall back to TCGPlayer's productId
      const snapshotCardId = cardId || bestMatch.productId

      // Save price snapshot
      const savedSuccessfully = await savePriceSnapshot({
        card_id: snapshotCardId,
        card_name: bestMatch.name,
        product_type: productType,
        game_type: gameType,
        market_price: marketPrice,
        low_price: lowPrice,
        source: 'tcgplayer',
        condition: 'NM', // TCGPlayer prices are typically Near Mint
        raw_data: {
          productUrl: bestMatch.productUrl,
          setName: bestMatch.setName,
          number: bestMatch.number,
          rarity: bestMatch.rarity,
          imageUrl: bestMatch.imageUrl,
        },
        recorded_at: new Date().toISOString(),
      })

      if (!savedSuccessfully) {
        console.warn(
          `Failed to save price snapshot for ${cardName} (${bestMatch.productId})`
        )
      }

      return {
        card_id: snapshotCardId,
        market_price: marketPrice,
        low_price: lowPrice,
        source: 'tcgplayer' as const,
      }
    },
    {
      maxRetries: 3,
      baseDelay: 2000,
      maxDelay: 10000,
    }
  )

  return result
}
