// Unified TCG Data Service
// Exports all TCG data functions and types

// Internal imports first (for use in this module)
import type { GameType, ProductType, TCGProduct, TCGSearchResponse } from './types'
import type { TCGPlayerCard } from './tcgplayer-scraper'
import { cardsApi } from './cards'
import { sealedApi } from './sealed'

// Types
export type {
  GameType,
  ProductType,
  DataSource,
  SealedType,
  GradingCompany,
  Condition,
  TCGProduct,
  CardProduct,
  CardVariant,
  SealedProduct,
  GradedCard,
  GradedSale,
  TCGSearchOptions,
  SealedSearchOptions,
  GradedSearchOptions,
  TCGSearchResponse,
  TCGCacheEntry,
  TCGError,
} from './types'

// Type guards and utilities
export {
  isCardProduct,
  isSealedProduct,
  isGradedCard,
  detectSealedType,
  parseGradingInfo,
} from './types'

// Cards API (TCGPlayer scraper)
export { cardsApi } from './cards'

// Sealed Products API (TCGPlayer scraper)
export { sealedApi, buildSearchUrl as buildSealedSearchUrl } from './sealed'

// Graded Cards API (eBay scraper)
export { gradedApi, buildEbaySearchUrl } from './graded'

// TCGPlayer Scraper (Playwright-based)
export {
  scrapeTCGPlayer,
  scrapeSet,
  searchCards as searchTCGPlayerCards,
  buildTCGPlayerUrl,
  TCGPLAYER_GAMES,
  type TCGPlayerCard,
  type TCGPlayerSearchOptions,
} from './tcgplayer-scraper'

// Caching
export {
  tcgCache,
  memCache,
  dbCache,
  generateCacheKey,
  CACHE_DURATIONS,
} from './cache'

// Client-side wrapper for TCGPlayer scraper API
export const tcgplayerApi = {
  /**
   * Search cards via TCGPlayer scraper
   */
  async search(gameType: GameType, query: string): Promise<TCGPlayerCard[]> {
    const params = new URLSearchParams({ game: gameType, q: query })
    const response = await fetch(`/api/tcg/scrape?${params}`)
    if (!response.ok) throw new Error('Failed to scrape TCGPlayer')
    const result = await response.json()
    return result.data
  },

  /**
   * Get cards from a specific set
   */
  async getSet(gameType: GameType, setName: string): Promise<TCGPlayerCard[]> {
    const params = new URLSearchParams({ game: gameType, set: setName })
    const response = await fetch(`/api/tcg/scrape?${params}`)
    if (!response.ok) throw new Error('Failed to scrape TCGPlayer')
    const result = await response.json()
    return result.data
  },
}

// Unified search options
export interface UnifiedSearchOptions {
  query: string
  gameType: GameType
  productTypes?: ProductType[]
  limit?: number
}

/**
 * Search across multiple product types
 */
export async function unifiedSearch(
  options: UnifiedSearchOptions
): Promise<TCGSearchResponse<TCGProduct>> {
  const productTypes = options.productTypes || ['card', 'sealed']
  const results: TCGProduct[] = []

  // Search cards if requested
  if (productTypes.includes('card')) {
    try {
      const cardResults = await cardsApi.search(options.query, options.gameType, {
        limit: options.limit,
      })
      results.push(...cardResults.data)
    } catch (error) {
      console.error('Card search error:', error)
    }
  }

  // Search sealed if requested
  if (productTypes.includes('sealed')) {
    try {
      const sealedResults = await sealedApi.search({
        query: options.query,
        gameType: options.gameType,
        productType: 'sealed',
        limit: options.limit,
      })
      results.push(...sealedResults.data)
    } catch (error) {
      console.error('Sealed search error:', error)
    }
  }

  return {
    data: results,
    meta: {
      total: results.length,
      limit: options.limit || 20,
      offset: 0,
      hasMore: false,
    },
    cached: false,
  }
}
