// Unified TCG Data Service
// Exports all TCG data functions and types

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

// Cards API (JustTCG)
export { cardsApi, JUSTTCG_GAME_IDS } from './cards'

// Sealed Products API (TCGPlayer scraper)
export { sealedApi, buildSearchUrl as buildSealedSearchUrl } from './sealed'

// Graded Cards API (eBay scraper)
export { gradedApi, buildEbaySearchUrl } from './graded'

// Caching
export {
  tcgCache,
  memCache,
  dbCache,
  generateCacheKey,
  CACHE_DURATIONS,
} from './cache'

// Unified search across all product types
import type { GameType, ProductType, TCGProduct, TCGSearchResponse } from './types'
import { cardsApi } from './cards'
import { sealedApi } from './sealed'

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
