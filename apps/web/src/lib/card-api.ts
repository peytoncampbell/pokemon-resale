import type { GameType, ProductType, UnifiedCard, UnifiedSearchResponse } from './card-types'
import { fetchWithTimeout, TIMEOUTS } from './fetch-with-timeout'

// TCGPlayer prices are in USD — stored as-is
// Currency conversion handled by CurrencyProvider at display time

// Use the TCGPlayer scraper API (Playwright-based)
const SCRAPER_API = '/api/tcg/scrape'

interface ScrapedCard {
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
  data: ScrapedCard[]
  meta: { total: number; page: number; source: string }
  cached: boolean
  url: string
  error?: string
}

async function fetchScraper(params: Record<string, string>): Promise<ScraperResponse> {
  const searchParams = new URLSearchParams(params)
  const url = `${SCRAPER_API}?${searchParams.toString()}`

  // Get auth headers from supabase
  const { supabase } = await import('@/lib/supabase')
  const { data: { session } } = await supabase.auth.getSession()
  const headers: HeadersInit = { Accept: 'application/json' }
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`
  }

  const response = await fetchWithTimeout(url, { headers, timeoutMs: TIMEOUTS.DEFAULT })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Scraper API error: ${response.status}`)
  }
  return response.json()
}

function fromScrapedCard(card: ScrapedCard, gameType: GameType, productType: ProductType = 'card'): UnifiedCard {
  return {
    id: card.productId,
    gameType,
    productType,
    name: card.name,
    setName: card.setName,
    imageSmall: card.imageUrl || '/card-placeholder.png',
    rarity: card.rarity || undefined,
    marketPrice: card.marketPrice,  // USD from TCGPlayer — converted at display time
  }
}

export const cardApi = {
  async searchCards(query: string, gameType: GameType): Promise<UnifiedSearchResponse> {
    const response = await fetchScraper({
      game: gameType,
      q: query,
      type: 'Cards',
    })
    return {
      data: (response.data || []).map(card => fromScrapedCard(card, gameType, 'card')),
      totalCount: response.meta?.total ?? response.data?.length ?? 0,
    }
  },

  async getRecentCards(gameType: GameType): Promise<UnifiedSearchResponse> {
    // Scraper doesn't have a "recent" endpoint — search for popular cards
    const searchTerm = gameType === 'pokemon' ? 'ex' : 'leader'
    const response = await fetchScraper({
      game: gameType,
      q: searchTerm,
      type: 'Cards',
    })
    return {
      data: (response.data || []).map(card => fromScrapedCard(card, gameType, 'card')),
      totalCount: response.meta?.total ?? response.data?.length ?? 0,
    }
  },

  async searchSealed(query: string, gameType: GameType): Promise<UnifiedSearchResponse> {
    const response = await fetchScraper({
      game: gameType,
      q: query,
      type: 'Sealed Products',
    })
    return {
      data: (response.data || []).map(card => fromScrapedCard(card, gameType, 'sealed')),
      totalCount: response.meta?.total ?? response.data?.length ?? 0,
    }
  },

  async getRecentSealed(gameType: GameType): Promise<UnifiedSearchResponse> {
    const searchTerm = gameType === 'pokemon' ? 'booster box' : 'booster box'
    const response = await fetchScraper({
      game: gameType,
      q: searchTerm,
      type: 'Sealed Products',
    })
    return {
      data: (response.data || []).map(card => fromScrapedCard(card, gameType, 'sealed')),
      totalCount: response.meta?.total ?? response.data?.length ?? 0,
    }
  },

  async getCard(id: string, gameType: GameType): Promise<UnifiedCard> {
    const response = await fetchScraper({
      game: gameType,
      q: id,
      type: 'Cards',
    })
    const card = response.data?.find(c => c.productId === id) || response.data?.[0]
    if (!card) throw new Error(`Card not found: ${id}`)
    return fromScrapedCard(card, gameType)
  },
}
