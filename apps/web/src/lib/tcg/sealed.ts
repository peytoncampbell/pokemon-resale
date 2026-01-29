// Sealed Products API - Uses TCGPlayer Playwright scraper
// Scrapes directly from TCGPlayer via /api/tcg/scrape with type=Sealed Products

import type {
  GameType,
  SealedProduct,
  SealedSearchOptions,
  TCGSearchResponse,
} from './types'
import { detectSealedType } from './types'

const SCRAPER_API_BASE = '/api/tcg/scrape'

// TCGPlayer card response from scraper (same structure for sealed)
interface TCGPlayerProduct {
  productId: string
  name: string
  setName: string
  number: string | null
  rarity: string | null
  imageUrl: string
  marketPrice: number | null
  lowPrice: number | null
  productUrl: string
}

interface ScraperResponse {
  data: TCGPlayerProduct[]
  meta: {
    total: number
    page: number
    source: string
  }
  cached: boolean
  cacheExpires?: string
  url: string
  error?: string
}

// Transform scraped TCGPlayer product to SealedProduct
function transformScrapedProduct(product: TCGPlayerProduct, gameType: GameType): SealedProduct {
  return {
    id: `tcgplayer-sealed-${product.productId}`,
    name: product.name,
    gameType,
    productType: 'sealed',
    setName: product.setName || 'Unknown Set',
    imageUrl: product.imageUrl || `https://tcgplayer-cdn.tcgplayer.com/product/${product.productId}_200w.jpg`,
    prices: {
      market: product.marketPrice,
      low: product.lowPrice,
      high: null,
    },
    source: 'tcgplayer',
    lastUpdated: new Date(),
    sealedType: detectSealedType(product.name),
    tcgplayerId: product.productId,
  }
}

// Fetch from scraper API
async function fetchScraper(
  gameType: GameType,
  params: { q?: string; set?: string; page?: number }
): Promise<ScraperResponse> {
  const searchParams = new URLSearchParams()
  searchParams.set('game', gameType)
  searchParams.set('type', 'Sealed Products')

  if (params.q) searchParams.set('q', params.q)
  if (params.set) searchParams.set('set', params.set)
  if (params.page) searchParams.set('page', String(params.page))

  const url = `${SCRAPER_API_BASE}?${searchParams.toString()}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Scraper API error: ${response.status}`)
  }

  return response.json()
}

// Build TCGPlayer search URL (for reference/debugging)
export function buildSearchUrl(
  gameType: GameType,
  options?: { search?: string; setName?: string }
): string {
  const games: Record<GameType, string> = {
    pokemon: 'pokemon',
    onepiece: 'one-piece-card-game',
  }
  const game = games[gameType]
  const base = `https://www.tcgplayer.com/search/${game}/product`
  const url = new URL(base)

  url.searchParams.set('productLineName', game)
  url.searchParams.set('view', 'grid')
  url.searchParams.set('ProductTypeName', 'Sealed Products')

  if (options?.search) {
    url.searchParams.set('q', options.search)
  }

  if (options?.setName) {
    url.searchParams.set('setName', options.setName)
  }

  return url.toString()
}

// Sealed products API
export const sealedApi = {
  /**
   * Search sealed products using TCGPlayer scraper
   */
  async search(options: SealedSearchOptions): Promise<TCGSearchResponse<SealedProduct>> {
    const gameType = options.gameType || 'pokemon'
    const page = options.offset ? Math.floor(options.offset / 20) + 1 : 1

    const response = await fetchScraper(gameType, {
      q: options.query,
      page,
    })

    const products = (response.data || []).map((p) => transformScrapedProduct(p, gameType))
    const limitedProducts = options.limit ? products.slice(0, options.limit) : products

    return {
      data: limitedProducts,
      meta: {
        total: response.meta?.total ?? products.length,
        limit: options.limit || 20,
        offset: options.offset || 0,
        hasMore: products.length >= 20,
      },
      cached: response.cached,
    }
  },

  /**
   * Get a specific sealed product by ID
   */
  async getById(id: string, gameType: GameType): Promise<SealedProduct | null> {
    const tcgplayerId = id.replace('tcgplayer-sealed-', '')

    const response = await fetchScraper(gameType, {
      q: tcgplayerId,
    })

    const product = response.data?.find((p) => p.productId === tcgplayerId)
    if (!product) return null

    return transformScrapedProduct(product, gameType)
  },

  /**
   * Get recent/popular sealed products
   */
  async getRecent(
    gameType: GameType,
    options?: { limit?: number }
  ): Promise<TCGSearchResponse<SealedProduct>> {
    // Search for common sealed product terms
    const searchTerm = 'booster box'

    const response = await fetchScraper(gameType, {
      q: searchTerm,
    })

    const products = (response.data || []).map((p) => transformScrapedProduct(p, gameType))
    const limitedProducts = options?.limit ? products.slice(0, options.limit) : products

    return {
      data: limitedProducts,
      meta: {
        total: response.meta?.total ?? products.length,
        limit: options?.limit || 20,
        offset: 0,
        hasMore: products.length >= 20,
      },
      cached: response.cached,
    }
  },
}
