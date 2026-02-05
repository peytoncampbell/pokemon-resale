// JustTCG API - unified API for multiple TCGs
// Docs: https://api.justtcg.com
// Uses server-side proxy to keep API key secure

import { supabase } from '@/lib/supabase'

const JUSTTCG_API_BASE = '/api/justtcg'

// Game IDs used by JustTCG
export const JUSTTCG_GAMES = {
  pokemon: 'pokemon',
  onepiece: 'one-piece-card-game',
} as const

export interface JustTCGVariant {
  id: string
  condition: string
  printing: string
  language: string
  price: number
  lastUpdated: number
  priceChange7d?: number | null
  avgPrice?: number | null
}

export interface JustTCGCard {
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
  // Sealed product fields
  category?: string
  type?: string
}

export interface JustTCGSet {
  id: string
  name: string
  game_id: string
  game: string
  cards_count: number
  release_date: string
}

export interface JustTCGResponse<T> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  error?: string
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

async function fetchJustTCG<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value)
    })
  }

  const queryString = searchParams.toString()
  const url = `${JUSTTCG_API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`

  const authHeaders = await getAuthHeaders()
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...authHeaders,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `JustTCG API error: ${response.status}`)
  }

  return response.json()
}

export const justTCGApi = {
  async searchCards(query: string, gameId: string, limit = 20): Promise<JustTCGCard[]> {
    const response = await fetchJustTCG<JustTCGResponse<JustTCGCard[]>>('/cards', {
      q: query,
      game: gameId,
      limit: String(limit),
      condition: 'NM', // Only get Near Mint prices
      include_price_history: 'false', // Reduce payload
    })
    return response.data || []
  },

  async getCard(cardId: string): Promise<JustTCGCard | null> {
    const response = await fetchJustTCG<JustTCGResponse<JustTCGCard[]>>('/cards', {
      id: cardId,
      condition: 'NM',
      include_price_history: 'false',
    })
    return response.data?.[0] || null
  },

  async getCardsBySet(gameId: string, setId: string, limit = 30): Promise<JustTCGCard[]> {
    const response = await fetchJustTCG<JustTCGResponse<JustTCGCard[]>>('/cards', {
      game: gameId,
      set: setId,
      limit: String(limit),
      condition: 'NM',
      include_price_history: 'false',
    })
    return response.data || []
  },

  async getSets(gameId: string): Promise<JustTCGSet[]> {
    const response = await fetchJustTCG<JustTCGResponse<JustTCGSet[]>>('/sets', {
      game: gameId,
      orderBy: 'release_date',
      order: 'desc',
    })
    return response.data || []
  },

  async getRecentCards(gameId: string, limit = 30): Promise<JustTCGCard[]> {
    // Get the most recent set, then fetch cards from it
    const sets = await justTCGApi.getSets(gameId)
    if (sets.length === 0) return []

    const latestSet = sets[0] // Already sorted by release_date desc
    return justTCGApi.getCardsBySet(gameId, latestSet.id, limit)
  },

  // Get the Near Mint price from variants
  getMarketPrice(card: JustTCGCard): number | null {
    const nmVariant = card.variants.find(v =>
      v.condition === 'Near Mint' && v.printing === 'Normal'
    ) || card.variants.find(v =>
      v.condition === 'Near Mint'
    ) || card.variants[0]

    return nmVariant?.price ?? null
  },

  // Get image URL - JustTCG doesn't provide images directly,
  // so we'll construct URLs based on tcgplayerId or use placeholders
  getImageUrl(card: JustTCGCard): string {
    // TCGPlayer image URL pattern
    if (card.tcgplayerId) {
      return `https://tcgplayer-cdn.tcgplayer.com/product/${card.tcgplayerId}_200w.jpg`
    }
    // Fallback placeholder
    return '/card-placeholder.png'
  },

  // Determine if a product is sealed (booster box, ETB, etc.) or a card
  isSealed(card: JustTCGCard): boolean {
    const sealedKeywords = [
      'booster box', 'etb', 'elite trainer box', 'collection box',
      'tin', 'bundle', 'blister', 'pack', 'case', 'display',
      'premium collection', 'ultra premium', 'special collection'
    ]
    const nameLower = card.name.toLowerCase()
    const categoryLower = (card.category || '').toLowerCase()
    const typeLower = (card.type || '').toLowerCase()

    // Check if category or type indicates sealed product
    if (categoryLower.includes('sealed') || typeLower.includes('sealed')) {
      return true
    }

    // Check name for sealed product keywords
    return sealedKeywords.some(keyword => nameLower.includes(keyword))
  },
}
