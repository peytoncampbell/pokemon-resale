// TCGPlayer Sealed Products Scraper
// Scrapes sealed product pricing from TCGPlayer search results

import type {
  GameType,
  SealedProduct,
  SealedSearchOptions,
  SealedType,
  TCGSearchResponse,
} from './types'
import { detectSealedType } from './types'
import { generateCacheKey, tcgCache } from './cache'

// TCGPlayer URLs for sealed products
const TCGPLAYER_SEARCH_URLS: Record<GameType, string> = {
  pokemon:
    'https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&ProductTypeName=Sealed+Products',
  onepiece:
    'https://www.tcgplayer.com/search/one-piece-card-game/product?productLineName=one-piece-card-game&ProductTypeName=Sealed+Products',
}

// Sealed type filter mappings for TCGPlayer
const SEALED_TYPE_FILTERS: Record<SealedType, string[]> = {
  'booster-box': ['Booster Box'],
  etb: ['Elite Trainer Box'],
  bundle: ['Bundle'],
  tin: ['Tin'],
  collection: ['Collection', 'Premium Collection'],
  blister: ['Blister', '3-Pack'],
  case: ['Case'],
  other: [],
}

// Scraped product from TCGPlayer
interface ScrapedProduct {
  name: string
  tcgplayerId: string
  imageUrl: string
  marketPrice: number | null
  lowPrice: number | null
  setName: string | null
}

/**
 * Parse TCGPlayer HTML search results
 * This is designed to be run server-side with a headless browser
 */
export function parseSearchResults(html: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []

  // TCGPlayer uses a data-testid pattern for search results
  // Each product card contains the relevant data
  // This regex-based approach works without a DOM parser

  // Match product cards - TCGPlayer uses search-result__product class
  const productRegex = /<div[^>]*class="[^"]*search-result[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi
  const productMatches = Array.from(html.matchAll(productRegex))

  for (const match of productMatches) {
    const cardHtml = match[1]

    // Extract product ID from link
    const idMatch = cardHtml.match(/href="\/product\/(\d+)/i)
    const tcgplayerId = idMatch?.[1] || ''

    // Extract name
    const nameMatch = cardHtml.match(
      /class="[^"]*product-card__title[^"]*"[^>]*>([^<]+)/i
    ) || cardHtml.match(/data-testid="product-card__title"[^>]*>([^<]+)/i)
    const name = nameMatch?.[1]?.trim() || ''

    // Extract image
    const imgMatch = cardHtml.match(/src="([^"]+tcgplayer-cdn[^"]+)"/i)
    const imageUrl = imgMatch?.[1] || ''

    // Extract market price
    const marketMatch = cardHtml.match(
      /market[^<]*<[^>]*>\$?([\d,]+\.?\d*)/i
    ) || cardHtml.match(/class="[^"]*price[^"]*"[^>]*>\$?([\d,]+\.?\d*)/i)
    const marketPrice = marketMatch
      ? parseFloat(marketMatch[1].replace(',', ''))
      : null

    // Extract low price
    const lowMatch = cardHtml.match(/low[^<]*<[^>]*>\$?([\d,]+\.?\d*)/i)
    const lowPrice = lowMatch
      ? parseFloat(lowMatch[1].replace(',', ''))
      : null

    // Extract set name
    const setMatch = cardHtml.match(
      /class="[^"]*product-card__set[^"]*"[^>]*>([^<]+)/i
    )
    const setName = setMatch?.[1]?.trim() || null

    if (tcgplayerId && name) {
      products.push({
        name,
        tcgplayerId,
        imageUrl,
        marketPrice,
        lowPrice,
        setName,
      })
    }
  }

  return products
}

/**
 * Alternative: Parse JSON data from TCGPlayer's Next.js hydration
 * TCGPlayer embeds search results as JSON in script tags
 */
export function parseJsonData(html: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []

  // Look for __NEXT_DATA__ script tag
  const nextDataMatch = html.match(
    /<script id="__NEXT_DATA__"[^>]*>({[\s\S]*?})<\/script>/i
  )

  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1])
      const results =
        data?.props?.pageProps?.searchResults?.results ||
        data?.props?.pageProps?.results ||
        []

      for (const item of results) {
        if (item.productId && item.productName) {
          products.push({
            name: item.productName || item.name,
            tcgplayerId: String(item.productId),
            imageUrl:
              item.imageUrl ||
              `https://tcgplayer-cdn.tcgplayer.com/product/${item.productId}_200w.jpg`,
            marketPrice: item.marketPrice ?? item.price ?? null,
            lowPrice: item.lowestPrice ?? item.lowPrice ?? null,
            setName: item.setName || item.groupName || null,
          })
        }
      }
    } catch {
      // JSON parse failed, fall back to HTML parsing
    }
  }

  return products
}

/**
 * Transform scraped product to unified SealedProduct
 */
function toSealedProduct(
  scraped: ScrapedProduct,
  gameType: GameType
): SealedProduct {
  return {
    id: `tcgplayer-sealed-${scraped.tcgplayerId}`,
    name: scraped.name,
    gameType,
    productType: 'sealed',
    setName: scraped.setName || 'Unknown Set',
    imageUrl:
      scraped.imageUrl ||
      `https://tcgplayer-cdn.tcgplayer.com/product/${scraped.tcgplayerId}_200w.jpg`,
    prices: {
      market: scraped.marketPrice,
      low: scraped.lowPrice,
      high: null, // TCGPlayer doesn't always show high price
    },
    source: 'tcgplayer',
    lastUpdated: new Date(),
    sealedType: detectSealedType(scraped.name),
    tcgplayerId: scraped.tcgplayerId,
  }
}

/**
 * Fetch sealed products from TCGPlayer
 * This function is designed to be called from an API route with puppeteer
 */
export async function fetchSealedProducts(
  gameType: GameType,
  options?: { search?: string; sealedType?: SealedType; limit?: number }
): Promise<ScrapedProduct[]> {
  // This is a placeholder that should be called from the API route
  // The actual scraping happens in the API route with puppeteer
  throw new Error(
    'fetchSealedProducts must be called via /api/tcg/sealed route'
  )
}

/**
 * Build TCGPlayer search URL with filters
 */
export function buildSearchUrl(
  gameType: GameType,
  options?: { search?: string; sealedType?: SealedType }
): string {
  const baseUrl = TCGPLAYER_SEARCH_URLS[gameType]
  const url = new URL(baseUrl)

  if (options?.search) {
    url.searchParams.set('q', options.search)
  }

  // Add sealed type filter if specified
  if (options?.sealedType && options.sealedType !== 'other') {
    const filterValues = SEALED_TYPE_FILTERS[options.sealedType]
    if (filterValues.length > 0) {
      // TCGPlayer uses SetName filter for some categories
      url.searchParams.set('view', 'grid')
    }
  }

  return url.toString()
}

// Sealed products API (client-side interface)
export const sealedApi = {
  /**
   * Search sealed products via API route
   */
  async search(options: SealedSearchOptions): Promise<TCGSearchResponse<SealedProduct>> {
    const gameType = options.gameType || 'pokemon'
    const cacheKey = generateCacheKey(
      'sealed',
      gameType,
      `search:${options.query || 'all'}:${options.sealedType || 'all'}`
    )

    // Check cache first
    const cached = await tcgCache.get<SealedProduct[]>(cacheKey)
    if (cached) {
      const data = cached.data
      return {
        data: data.slice(options.offset || 0, (options.offset || 0) + (options.limit || 20)),
        meta: {
          total: data.length,
          limit: options.limit || 20,
          offset: options.offset || 0,
          hasMore: data.length > (options.offset || 0) + (options.limit || 20),
        },
        cached: true,
        cacheExpires: cached.expiresAt,
      }
    }

    // Fetch from API route
    const params = new URLSearchParams()
    params.set('game', gameType)
    if (options.query) params.set('search', options.query)
    if (options.sealedType) params.set('type', options.sealedType)
    if (options.limit) params.set('limit', String(options.limit))

    const response = await fetch(`/api/tcg/sealed?${params}`)
    if (!response.ok) {
      throw new Error(`Sealed API error: ${response.status}`)
    }

    const result = await response.json()
    return result
  },

  /**
   * Get a specific sealed product by ID
   */
  async getById(id: string, gameType: GameType): Promise<SealedProduct | null> {
    const tcgplayerId = id.replace('tcgplayer-sealed-', '')
    const cacheKey = generateCacheKey('sealed', gameType, `id:${tcgplayerId}`)

    const cached = await tcgCache.get<SealedProduct>(cacheKey)
    if (cached) {
      return cached.data
    }

    const response = await fetch(`/api/tcg/sealed?game=${gameType}&id=${tcgplayerId}`)
    if (!response.ok) {
      return null
    }

    const result = await response.json()
    return result.data?.[0] || null
  },
}

// Export utilities for API route
export { toSealedProduct }
export type { ScrapedProduct }
