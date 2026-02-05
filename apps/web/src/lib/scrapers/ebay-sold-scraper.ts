// eBay Sold Listings Scraper for Raw Cards
// Scrapes sold listings for raw (ungraded) cards as fallback pricing source

import * as cheerio from 'cheerio'
import type { GameType } from '@/lib/tcg/types'
import { parseSoldListings, type ScrapedSale } from '@/lib/tcg/graded'
import { savePriceSnapshot } from '@/lib/price/staleness'
import { retryWithBackoff, humanDelay } from './scraper-utils'

export interface EbaySoldPriceOptions {
  cardName: string
  gameType: GameType
  setName?: string
}

export interface EbaySoldPriceResult {
  card_id: string
  market_price: number | null
  low_price: number | null
  source: 'ebay'
}

// User-Agent rotation for anti-detection
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
]

/**
 * Build eBay search URL for sold raw card listings
 */
function buildEbayRawCardUrl(options: EbaySoldPriceOptions): string {
  const parts: string[] = []

  // Add card name
  parts.push(options.cardName)

  // Add set name if provided
  if (options.setName) {
    parts.push(options.setName)
  }

  // Add game context
  if (options.gameType === 'pokemon') {
    parts.push('pokemon')
  } else if (options.gameType === 'onepiece') {
    parts.push('one piece card game')
  }

  // Exclude graded cards from search
  parts.push('-PSA -BGS -CGC -SGC -graded')

  const query = parts.join(' ')
  const url = new URL('https://www.ebay.com/sch/i.html')
  url.searchParams.set('_nkw', query)
  url.searchParams.set('LH_Complete', '1') // Completed listings
  url.searchParams.set('LH_Sold', '1') // Sold only
  url.searchParams.set('_sop', '13') // Sort by end date (most recent)

  return url.toString()
}

/**
 * Filter out outlier sales (lots, bulk deals, etc.)
 */
function filterOutliers(sales: ScrapedSale[]): ScrapedSale[] {
  return sales.filter((sale) => {
    const titleLower = sale.title.toLowerCase()

    // Exclude lots and bulk deals
    if (
      titleLower.includes('lot of') ||
      titleLower.includes('bulk') ||
      titleLower.includes('x2') ||
      titleLower.includes('x3') ||
      titleLower.includes('x4') ||
      titleLower.includes('playset')
    ) {
      return false
    }

    // Exclude outlier prices
    if (sale.price < 0.5 || sale.price > 10000) {
      return false
    }

    return true
  })
}

/**
 * Calculate trimmed mean (remove top/bottom 10%)
 */
function calculateTrimmedMean(prices: number[]): number | null {
  if (prices.length === 0) return null
  if (prices.length < 3) {
    // Not enough data for trimming, use regular mean
    return prices.reduce((sum, p) => sum + p, 0) / prices.length
  }

  const sorted = [...prices].sort((a, b) => a - b)
  const trimCount = Math.floor(sorted.length * 0.1)

  // Remove top and bottom 10%
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount)

  const sum = trimmed.reduce((acc, p) => acc + p, 0)
  return sum / trimmed.length
}

/**
 * Scrape eBay sold listings for raw card pricing
 * Uses plain fetch + Cheerio (no Playwright needed)
 */
export async function scrapeEbaySoldPrice(
  options: EbaySoldPriceOptions
): Promise<EbaySoldPriceResult> {
  const { cardName, gameType, setName } = options

  // Apply human delay before request
  await humanDelay(500, 1500)

  // Use retry logic for resilience
  const result = await retryWithBackoff(
    async () => {
      const url = buildEbayRawCardUrl(options)

      // Rotate User-Agent
      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]

      // Fetch with anti-detection headers
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          DNT: '1',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        },
      })

      if (!response.ok) {
        throw new Error(`eBay request failed: ${response.status}`)
      }

      const html = await response.text()

      // Parse sold listings using existing graded.ts parser
      const sales = parseSoldListings(html)

      if (sales.length === 0) {
        throw new Error(`No eBay sold listings found for: ${cardName}`)
      }

      // Filter outliers
      const filteredSales = filterOutliers(sales)

      if (filteredSales.length === 0) {
        throw new Error(`No valid eBay sales after filtering outliers: ${cardName}`)
      }

      // Extract prices
      const prices = filteredSales.map((s) => s.price)

      // Calculate trimmed mean as market price
      const marketPrice = calculateTrimmedMean(prices)

      // Lowest non-outlier sale as low price
      const lowPrice = Math.min(...prices)

      // Construct card_id (eBay has no stable product ID)
      const normalizedName = cardName.toLowerCase().replace(/\s+/g, '-')
      const cardId = `ebay-${gameType}-${normalizedName}`

      // Save price snapshot
      const savedSuccessfully = await savePriceSnapshot({
        card_id: cardId,
        card_name: cardName,
        product_type: 'card',
        game_type: gameType,
        market_price: marketPrice,
        low_price: lowPrice,
        source: 'ebay',
        condition: 'NM',
        raw_data: {
          searchUrl: url,
          salesCount: filteredSales.length,
          setName,
        },
        recorded_at: new Date().toISOString(),
      })

      if (!savedSuccessfully) {
        console.warn(`Failed to save eBay price snapshot for ${cardName}`)
      }

      return {
        card_id: cardId,
        market_price: marketPrice,
        low_price: lowPrice,
        source: 'ebay' as const,
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
