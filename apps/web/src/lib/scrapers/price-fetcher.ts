// Multi-Source Price Fetcher
// Orchestrates TCGPlayer -> eBay fallback chain for price scraping

import type { GameType } from '@/lib/tcg/types'
import { scrapeTCGPlayerPrice, type TCGPlayerPriceOptions } from './tcgplayer-price-scraper'
import { scrapeEbaySoldPrice, type EbaySoldPriceOptions } from './ebay-sold-scraper'
import { humanDelay } from './scraper-utils'

export interface FetchPriceOptions {
  cardId: string
  cardName: string
  gameType: GameType
  setName?: string
  productType?: 'card' | 'sealed'
}

export interface PriceResult {
  card_id: string
  market_price: number | null
  low_price: number | null
  source: 'tcgplayer' | 'ebay'
}

export interface BatchPriceOptions {
  batchSize?: number
  delayBetweenMs?: number
}

export interface BatchPriceResult {
  succeeded: number
  failed: number
  results: Array<{
    cardId: string
    status: 'fulfilled' | 'rejected'
    price?: number
    error?: string
  }>
}

/**
 * Fetch price with multi-source fallback
 * Tries TCGPlayer first, falls back to eBay on failure
 */
export async function fetchPriceWithFallback(
  options: FetchPriceOptions
): Promise<PriceResult> {
  const { cardId, cardName, gameType, setName, productType = 'card' } = options

  // Try TCGPlayer first
  try {
    console.log(`Attempting TCGPlayer scrape for: ${cardName}`)
    const tcgResult = await scrapeTCGPlayerPrice({
      cardName,
      gameType,
      setName,
      productType,
    })
    console.log(`TCGPlayer succeeded for: ${cardName}`)
    return tcgResult
  } catch (tcgError) {
    console.warn(
      `TCGPlayer failed for ${cardName}:`,
      tcgError instanceof Error ? tcgError.message : tcgError
    )

    // Fall back to eBay
    try {
      console.log(`Attempting eBay fallback for: ${cardName}`)
      const ebayResult = await scrapeEbaySoldPrice({
        cardName,
        gameType,
        setName,
      })
      console.log(`eBay succeeded for: ${cardName}`)
      return ebayResult
    } catch (ebayError) {
      console.error(
        `eBay fallback failed for ${cardName}:`,
        ebayError instanceof Error ? ebayError.message : ebayError
      )

      // Both sources failed
      throw new Error(
        `All price sources failed for ${cardName}. TCGPlayer: ${
          tcgError instanceof Error ? tcgError.message : tcgError
        }, eBay: ${ebayError instanceof Error ? ebayError.message : ebayError}`
      )
    }
  }
}

/**
 * Fetch prices for multiple cards in batches
 * Respects Vercel timeout by checking elapsed time
 */
export async function fetchBatchPrices(
  cards: Array<{
    cardId: string
    cardName: string
    gameType: GameType
    setName?: string
  }>,
  options?: BatchPriceOptions
): Promise<BatchPriceResult> {
  const { batchSize = 5, delayBetweenMs = 2000 } = options || {}

  const startTime = Date.now()
  const TIMEOUT_THRESHOLD_MS = 50000 // Stop at 50 seconds to avoid Vercel timeout

  let succeeded = 0
  let failed = 0
  const results: Array<{
    cardId: string
    status: 'fulfilled' | 'rejected'
    price?: number
    error?: string
  }> = []

  // Process in batches
  for (let i = 0; i < cards.length; i += batchSize) {
    // Check if we're approaching timeout
    const elapsed = Date.now() - startTime
    if (elapsed > TIMEOUT_THRESHOLD_MS) {
      console.warn(
        `Batch processing stopping early due to timeout threshold (${elapsed}ms elapsed)`
      )
      // Mark remaining cards as failed
      for (let j = i; j < cards.length; j++) {
        results.push({
          cardId: cards[j].cardId,
          status: 'rejected',
          error: 'Batch processing timeout',
        })
        failed++
      }
      break
    }

    const batch = cards.slice(i, i + batchSize)
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} cards)`
    )

    // Process batch with Promise.allSettled (one failure doesn't abort others)
    const batchResults = await Promise.allSettled(
      batch.map((card) =>
        fetchPriceWithFallback({
          cardId: card.cardId,
          cardName: card.cardName,
          gameType: card.gameType,
          setName: card.setName,
        })
      )
    )

    // Collect results
    batchResults.forEach((result, index) => {
      const card = batch[index]
      if (result.status === 'fulfilled') {
        results.push({
          cardId: card.cardId,
          status: 'fulfilled',
          price: result.value.market_price ?? undefined,
        })
        succeeded++
      } else {
        results.push({
          cardId: card.cardId,
          status: 'rejected',
          error: result.reason?.message || 'Unknown error',
        })
        failed++
      }
    })

    // Delay between batches (if not the last batch)
    if (i + batchSize < cards.length) {
      await humanDelay(delayBetweenMs, delayBetweenMs + 1000)
    }
  }

  return {
    succeeded,
    failed,
    results,
  }
}
