// eBay Graded Cards Scraper
// Scrapes sold listings for graded card pricing data
// Uses cheerio for robust HTML parsing instead of fragile regex

import * as cheerio from 'cheerio'
import type {
  GameType,
  GradedCard,
  GradedSale,
  GradedSearchOptions,
  GradingCompany,
  TCGSearchResponse,
} from './types'
import { parseGradingInfo } from './types'
import { generateCacheKey, tcgCache } from './cache'

// eBay search URL builder for sold listings
function buildEbaySearchUrl(options: GradedSearchOptions): string {
  const parts: string[] = []

  // Build search query
  if (options.cardName) {
    parts.push(options.cardName)
  }
  if (options.setName) {
    parts.push(options.setName)
  }
  if (options.gradingCompany) {
    parts.push(options.gradingCompany)
  }
  if (options.grade) {
    parts.push(String(options.grade))
  }

  // Add game context if not obvious from card name
  if (options.gameType === 'pokemon' && !options.cardName?.toLowerCase().includes('pokemon')) {
    parts.push('pokemon')
  }
  if (options.gameType === 'onepiece') {
    parts.push('one piece card game')
  }

  const query = parts.join(' ')
  const url = new URL('https://www.ebay.com/sch/i.html')
  url.searchParams.set('_nkw', query)
  url.searchParams.set('LH_Complete', '1') // Completed listings
  url.searchParams.set('LH_Sold', '1') // Sold only
  url.searchParams.set('_sop', '13') // Sort by end date (most recent)

  return url.toString()
}

// Scraped sale from eBay
interface ScrapedSale {
  title: string
  price: number
  date: Date
  imageUrl?: string
}

/**
 * Parse eBay sold listings HTML using cheerio
 * More robust than regex-based parsing
 */
export function parseSoldListings(html: string): ScrapedSale[] {
  const sales: ScrapedSale[] = []
  const $ = cheerio.load(html)

  // eBay uses s-item class for search result items
  $('li.s-item').each((_, element) => {
    const $item = $(element)

    // Skip promotional items
    if ($item.find('.s-item__ad').length > 0) return

    // Extract title - try multiple selectors
    let title = $item.find('.s-item__title span').first().text().trim()
    if (!title) {
      title = $item.find('.s-item__title').first().text().trim()
    }
    if (!title) {
      title = $item.attr('aria-label') || ''
    }

    // Skip if no title or if it's a header row
    if (!title || title === 'Shop on eBay') return

    // Extract price - try multiple selectors
    let priceText = $item.find('.s-item__price').first().text().trim()
    if (!priceText) {
      priceText = $item.find('.POSITIVE').first().text().trim()
    }

    // Parse price - remove currency symbol and commas
    const priceMatch = priceText.match(/[\d,]+\.?\d*/)
    const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : null

    // Extract sold date
    let soldDate = new Date()
    const soldText = $item.find('.s-item__ended-date, .s-item__endedDate').text()
    const dateMatch = soldText.match(/Sold\s+(\w+\s+\d+,?\s*\d*)/i)
    if (dateMatch) {
      const parsed = new Date(dateMatch[1])
      if (!isNaN(parsed.getTime())) {
        soldDate = parsed
      }
    }

    // Extract image URL
    const imageUrl =
      $item.find('img[src*="ebayimg"]').attr('src') ||
      $item.find('.s-item__image-img').attr('src') ||
      undefined

    if (title && price && price > 0) {
      sales.push({
        title,
        price,
        date: soldDate,
        imageUrl,
      })
    }
  })

  return sales
}

/**
 * Alternative: Parse eBay JSON data from __PRELOADED_STATE__
 */
export function parseJsonData(html: string): ScrapedSale[] {
  const sales: ScrapedSale[] = []

  // eBay sometimes includes structured data
  const stateMatch = html.match(
    /window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?});?\s*<\/script>/i
  )

  if (stateMatch) {
    try {
      const data = JSON.parse(stateMatch[1])
      const items = data?.srp?.items || data?.items || []

      for (const item of items) {
        if (item.price?.value && item.title) {
          const soldDate = item.endedDate
            ? new Date(item.endedDate)
            : new Date()

          sales.push({
            title: item.title,
            price: parseFloat(item.price.value),
            date: soldDate,
            imageUrl: item.image?.url,
          })
        }
      }
    } catch {
      // JSON parse failed
    }
  }

  return sales
}

/**
 * Filter and process sales for a specific grade
 */
export function filterSalesForGrade(
  sales: ScrapedSale[],
  gradingCompany: GradingCompany,
  grade: number
): GradedSale[] {
  return sales
    .filter((sale) => {
      const { company, grade: parsedGrade } = parseGradingInfo(sale.title)
      return (
        company === gradingCompany &&
        parsedGrade !== null &&
        Math.abs(parsedGrade - grade) < 0.1 // Allow for floating point comparison
      )
    })
    .map((sale) => ({
      price: sale.price,
      date: sale.date,
      source: 'ebay' as const,
      listingTitle: sale.title,
    }))
}

/**
 * Calculate statistics from sales
 */
export function calculateStats(sales: GradedSale[]): {
  average: number | null
  median: number | null
  count: number
} {
  if (sales.length === 0) {
    return { average: null, median: null, count: 0 }
  }

  const prices = sales.map((s) => s.price).sort((a, b) => a - b)
  const sum = prices.reduce((acc, p) => acc + p, 0)
  const average = sum / prices.length

  const mid = Math.floor(prices.length / 2)
  const median =
    prices.length % 2 === 0
      ? (prices[mid - 1] + prices[mid]) / 2
      : prices[mid]

  return {
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    count: prices.length,
  }
}

/**
 * Transform scraped sales to GradedCard result
 */
export function toGradedCard(
  sales: ScrapedSale[],
  options: GradedSearchOptions
): GradedCard {
  const gradingCompany = options.gradingCompany || 'PSA'
  const grade = options.grade || 10

  // Filter for the specific grade
  const filteredSales = filterSalesForGrade(sales, gradingCompany, grade)
  const stats = calculateStats(filteredSales)

  // Get image from first sale that has one
  const saleWithImage = sales.find((s) => s.imageUrl)

  return {
    id: `graded-${options.gameType}-${options.cardName}-${gradingCompany}-${grade}`
      .toLowerCase()
      .replace(/\s+/g, '-'),
    name: `${options.cardName} ${gradingCompany} ${grade}`,
    gameType: options.gameType || 'pokemon',
    productType: 'graded',
    setName: options.setName || 'Unknown Set',
    imageUrl: saleWithImage?.imageUrl || '/card-placeholder.png',
    prices: {
      market: stats.median,
      low: filteredSales.length > 0 ? Math.min(...filteredSales.map((s) => s.price)) : null,
      high: filteredSales.length > 0 ? Math.max(...filteredSales.map((s) => s.price)) : null,
    },
    source: 'ebay',
    lastUpdated: new Date(),
    gradingCompany,
    grade,
    cardName: options.cardName,
    cardSet: options.setName || '',
    cardNumber: options.cardNumber,
    recentSales: filteredSales.slice(0, 10), // Last 10 sales
    averagePrice: stats.average,
    medianPrice: stats.median,
    salesCount: stats.count,
  }
}

/**
 * Build the eBay search URL for export to API route
 */
export { buildEbaySearchUrl }

// Graded cards API (client-side interface)
export const gradedApi = {
  /**
   * Search for graded card prices via API route
   */
  async search(options: GradedSearchOptions): Promise<GradedCard> {
    const gameType = options.gameType || 'pokemon'
    const gradingCompany = options.gradingCompany || 'PSA'
    const grade = options.grade || 10

    const cacheKey = generateCacheKey(
      'graded',
      gameType,
      `${options.cardName}:${options.setName || 'any'}:${gradingCompany}:${grade}`
    )

    // Check cache first
    const cached = await tcgCache.get<GradedCard>(cacheKey)
    if (cached) {
      return cached.data
    }

    // Fetch from API route
    const params = new URLSearchParams()
    params.set('cardName', options.cardName)
    params.set('game', gameType)
    if (options.setName) params.set('set', options.setName)
    if (options.cardNumber) params.set('number', options.cardNumber)
    params.set('company', gradingCompany)
    params.set('grade', String(grade))

    const response = await fetch(`/api/tcg/graded?${params}`)
    if (!response.ok) {
      throw new Error(`Graded API error: ${response.status}`)
    }

    const result = await response.json()
    return result.data
  },

  /**
   * Get multiple grades for the same card
   */
  async getMultipleGrades(
    cardName: string,
    gameType: GameType,
    options?: { setName?: string; grades?: number[]; company?: GradingCompany }
  ): Promise<GradedCard[]> {
    const grades = options?.grades || [10, 9, 8]
    const company = options?.company || 'PSA'

    const results = await Promise.all(
      grades.map((grade) =>
        this.search({
          cardName,
          gameType,
          setName: options?.setName,
          gradingCompany: company,
          grade,
        })
      )
    )

    return results
  },
}

// Export utilities for API route
export type { ScrapedSale }
