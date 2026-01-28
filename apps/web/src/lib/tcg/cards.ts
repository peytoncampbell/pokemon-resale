// Cards API - Wrapper around JustTCG for unified card data
// Uses the existing JustTCG proxy at /api/justtcg

import type {
  CardProduct,
  CardVariant,
  Condition,
  GameType,
  TCGSearchResponse,
} from './types'

const JUSTTCG_API_BASE = '/api/justtcg'

// Game IDs used by JustTCG
export const JUSTTCG_GAME_IDS: Record<GameType, string> = {
  pokemon: 'pokemon',
  onepiece: 'one-piece-card-game',
}

// JustTCG API response types
interface JustTCGVariant {
  id: string
  condition: string
  printing: string
  language: string
  price: number
  lastUpdated: number
  priceChange7d?: number | null
  priceChange30d?: number | null
  avgPrice?: number | null
  minPrice?: number | null
  maxPrice?: number | null
}

interface JustTCGCard {
  id: string
  name: string
  game: string
  set: string
  set_name: string
  number: string
  tcgplayerId?: string
  rarity: string
  details?: string | null
  variants: JustTCGVariant[]
  category?: string
  type?: string
}

interface JustTCGResponse<T> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  error?: string
}

// Map JustTCG condition names to our condition codes
function mapCondition(condition: string): Condition {
  const conditionMap: Record<string, Condition> = {
    'Near Mint': 'NM',
    'Lightly Played': 'LP',
    'Moderately Played': 'MP',
    'Heavily Played': 'HP',
    'Damaged': 'DMG',
  }
  return conditionMap[condition] || 'NM'
}

// Transform JustTCG variant to unified CardVariant
function transformVariant(variant: JustTCGVariant): CardVariant {
  return {
    id: variant.id,
    condition: mapCondition(variant.condition),
    printing: variant.printing || 'Normal',
    price: variant.price,
    priceChange7d: variant.priceChange7d,
    priceChange30d: variant.priceChange30d,
  }
}

// Transform JustTCG card to unified CardProduct
function transformCard(card: JustTCGCard, gameType: GameType): CardProduct {
  // Get the Near Mint Normal price as market price
  const nmVariant = card.variants.find(
    (v) => v.condition === 'Near Mint' && v.printing === 'Normal'
  ) || card.variants.find((v) => v.condition === 'Near Mint') || card.variants[0]

  // Get min/max from all variants
  const prices = card.variants.filter((v) => v.price > 0).map((v) => v.price)
  const lowPrice = prices.length > 0 ? Math.min(...prices) : null
  const highPrice = prices.length > 0 ? Math.max(...prices) : null

  return {
    id: card.id,
    name: card.name,
    gameType,
    productType: 'card',
    setName: card.set_name,
    imageUrl: card.tcgplayerId
      ? `https://tcgplayer-cdn.tcgplayer.com/product/${card.tcgplayerId}_200w.jpg`
      : '/card-placeholder.png',
    prices: {
      market: nmVariant?.price ?? null,
      low: lowPrice,
      high: highPrice,
    },
    source: 'justtcg',
    lastUpdated: nmVariant?.lastUpdated
      ? new Date(nmVariant.lastUpdated * 1000)
      : new Date(),
    rarity: card.rarity,
    number: card.number,
    tcgplayerId: card.tcgplayerId,
    variants: card.variants.map(transformVariant),
  }
}

// Fetch helper
async function fetchJustTCG<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<JustTCGResponse<T>> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value)
    })
  }

  const queryString = searchParams.toString()
  const url = `${JUSTTCG_API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `JustTCG API error: ${response.status}`)
  }

  return response.json()
}

// Cards API
export const cardsApi = {
  /**
   * Search for cards by query
   */
  async search(
    query: string,
    gameType: GameType,
    options?: { limit?: number; offset?: number }
  ): Promise<TCGSearchResponse<CardProduct>> {
    const response = await fetchJustTCG<JustTCGCard[]>('/cards', {
      q: query,
      game: JUSTTCG_GAME_IDS[gameType],
      limit: String(options?.limit ?? 20),
      condition: 'NM',
      include_price_history: 'false',
    })

    const cards = (response.data || []).map((card) => transformCard(card, gameType))

    return {
      data: cards,
      meta: {
        total: response.meta?.total ?? cards.length,
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
        hasMore: response.meta?.hasMore ?? false,
      },
      cached: false,
    }
  },

  /**
   * Get a single card by ID
   */
  async getById(cardId: string, gameType: GameType): Promise<CardProduct | null> {
    const response = await fetchJustTCG<JustTCGCard[]>('/cards', {
      id: cardId,
      condition: 'NM',
      include_price_history: 'false',
    })

    const card = response.data?.[0]
    if (!card) return null

    return transformCard(card, gameType)
  },

  /**
   * Get cards from a specific set
   */
  async getBySet(
    setId: string,
    gameType: GameType,
    options?: { limit?: number }
  ): Promise<TCGSearchResponse<CardProduct>> {
    const response = await fetchJustTCG<JustTCGCard[]>('/cards', {
      game: JUSTTCG_GAME_IDS[gameType],
      set: setId,
      limit: String(options?.limit ?? 30),
      condition: 'NM',
      include_price_history: 'false',
    })

    const cards = (response.data || []).map((card) => transformCard(card, gameType))

    return {
      data: cards,
      meta: {
        total: response.meta?.total ?? cards.length,
        limit: options?.limit ?? 30,
        offset: 0,
        hasMore: response.meta?.hasMore ?? false,
      },
      cached: false,
    }
  },

  /**
   * Get cards from the most recent set
   */
  async getRecent(
    gameType: GameType,
    options?: { limit?: number }
  ): Promise<TCGSearchResponse<CardProduct>> {
    // First get the most recent set
    const setsResponse = await fetchJustTCG<Array<{ id: string; name: string }>>('/sets', {
      game: JUSTTCG_GAME_IDS[gameType],
      orderBy: 'release_date',
      order: 'desc',
    })

    const latestSet = setsResponse.data?.[0]
    if (!latestSet) {
      return {
        data: [],
        meta: { total: 0, limit: options?.limit ?? 30, offset: 0, hasMore: false },
        cached: false,
      }
    }

    return this.getBySet(latestSet.id, gameType, options)
  },

  /**
   * Get card with full price history
   */
  async getWithPriceHistory(
    cardId: string,
    gameType: GameType,
    duration: '7d' | '30d' | '90d' | '180d' = '30d'
  ): Promise<CardProduct | null> {
    const response = await fetchJustTCG<JustTCGCard[]>('/cards', {
      id: cardId,
      include_price_history: 'true',
      priceHistoryDuration: duration,
    })

    const card = response.data?.[0]
    if (!card) return null

    return transformCard(card, gameType)
  },
}
