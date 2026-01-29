// Cards API - Uses TCGPlayer Playwright scraper for card data
// Scrapes directly from TCGPlayer via /api/tcg/scrape

import type {
  CardProduct,
  CardVariant,
  GameType,
  TCGSearchResponse,
} from './types'

const SCRAPER_API_BASE = '/api/tcg/scrape'

// TCGPlayer card response from scraper
interface TCGPlayerCard {
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
  data: TCGPlayerCard[]
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

// Transform scraped TCGPlayer card to unified CardProduct
function transformScrapedCard(card: TCGPlayerCard, gameType: GameType): CardProduct {
  // Create a single NM variant from the scraped price
  const variants: CardVariant[] = []
  if (card.marketPrice !== null) {
    variants.push({
      id: `${card.productId}_NM_Normal`,
      condition: 'NM',
      printing: 'Normal',
      price: card.marketPrice,
      priceChange7d: null,
      priceChange30d: null,
    })
  }

  return {
    id: card.productId,
    name: card.name,
    gameType,
    productType: 'card',
    setName: card.setName,
    imageUrl: card.imageUrl || '/card-placeholder.png',
    prices: {
      market: card.marketPrice,
      low: card.lowPrice,
      high: null,
    },
    source: 'tcgplayer',
    lastUpdated: new Date(),
    rarity: card.rarity || undefined,
    number: card.number || undefined,
    tcgplayerId: card.productId,
    variants,
  }
}

// Fetch from scraper API
async function fetchScraper(
  gameType: GameType,
  params: { q?: string; set?: string; page?: number; type?: 'Cards' | 'Sealed Products' }
): Promise<ScraperResponse> {
  const searchParams = new URLSearchParams()
  searchParams.set('game', gameType)

  if (params.q) searchParams.set('q', params.q)
  if (params.set) searchParams.set('set', params.set)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.type) searchParams.set('type', params.type)

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

// Cards API
export const cardsApi = {
  /**
   * Search for cards by query using TCGPlayer scraper
   */
  async search(
    query: string,
    gameType: GameType,
    options?: { limit?: number; offset?: number }
  ): Promise<TCGSearchResponse<CardProduct>> {
    const page = options?.offset ? Math.floor(options.offset / 20) + 1 : 1

    const response = await fetchScraper(gameType, {
      q: query,
      page,
      type: 'Cards',
    })

    const cards = (response.data || []).map((card) => transformScrapedCard(card, gameType))

    // Apply limit if specified (scraper returns all results from page)
    const limitedCards = options?.limit ? cards.slice(0, options.limit) : cards

    return {
      data: limitedCards,
      meta: {
        total: response.meta?.total ?? cards.length,
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
        hasMore: cards.length >= 20, // TCGPlayer typically shows ~24 per page
      },
      cached: response.cached,
    }
  },

  /**
   * Get a single card by ID (searches by product ID)
   */
  async getById(cardId: string, gameType: GameType): Promise<CardProduct | null> {
    // Search for the card by its product ID
    const response = await fetchScraper(gameType, {
      q: cardId,
      type: 'Cards',
    })

    const card = response.data?.find((c) => c.productId === cardId)
    if (!card) return null

    return transformScrapedCard(card, gameType)
  },

  /**
   * Get cards from a specific set
   */
  async getBySet(
    setName: string,
    gameType: GameType,
    options?: { limit?: number }
  ): Promise<TCGSearchResponse<CardProduct>> {
    const response = await fetchScraper(gameType, {
      set: setName,
      type: 'Cards',
    })

    const cards = (response.data || []).map((card) => transformScrapedCard(card, gameType))
    const limitedCards = options?.limit ? cards.slice(0, options.limit) : cards

    return {
      data: limitedCards,
      meta: {
        total: response.meta?.total ?? cards.length,
        limit: options?.limit ?? 30,
        offset: 0,
        hasMore: cards.length >= 20,
      },
      cached: response.cached,
    }
  },

  /**
   * Get cards from the most recent set
   * Note: This searches for recent popular cards since scraper doesn't have set listing
   */
  async getRecent(
    gameType: GameType,
    options?: { limit?: number }
  ): Promise<TCGSearchResponse<CardProduct>> {
    // Search for recent/popular cards
    const searchTerm = gameType === 'pokemon' ? 'ex' : 'leader'

    const response = await fetchScraper(gameType, {
      q: searchTerm,
      type: 'Cards',
    })

    const cards = (response.data || []).map((card) => transformScrapedCard(card, gameType))
    const limitedCards = options?.limit ? cards.slice(0, options.limit) : cards

    return {
      data: limitedCards,
      meta: {
        total: response.meta?.total ?? cards.length,
        limit: options?.limit ?? 30,
        offset: 0,
        hasMore: cards.length >= 20,
      },
      cached: response.cached,
    }
  },

  /**
   * Get card with full price history
   * Note: Scraper doesn't provide history, returns current price only
   */
  async getWithPriceHistory(
    cardId: string,
    gameType: GameType,
    _duration: '7d' | '30d' | '90d' | '180d' = '30d'
  ): Promise<CardProduct | null> {
    // Scraper doesn't support price history, just return current card data
    return this.getById(cardId, gameType)
  },
}
