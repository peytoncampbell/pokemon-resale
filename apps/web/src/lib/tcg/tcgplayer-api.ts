// TCGPlayer Search API Client (no browser needed)
// Uses TCGPlayer's internal search + product details APIs

import type { GameType } from './types'
import { fetchWithTimeout, TIMEOUTS } from '../fetch-with-timeout'

const SEARCH_API = 'https://mp-search-api.tcgplayer.com/v1'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const GAME_NAMES: Record<GameType, string> = {
  pokemon: 'pokemon',
  onepiece: 'one-piece-card-game',
}

export interface TCGPlayerProduct {
  productId: number
  productName: string
  setName: string
  marketPrice: number | null
  lowestPriceWithShipping: number | null
  rarityName: string | null
  imageCount: number
  productUrlName: string
  productLineUrlName: string
  setCode: string
  sealed: boolean
  customAttributes?: {
    number?: string
    description?: string
    [key: string]: unknown
  }
}

export interface TCGPlayerSearchResult {
  products: TCGPlayerProduct[]
  totalResults: number
}

/**
 * Search TCGPlayer for products using their internal search API
 */
export async function searchTCGPlayer(
  query: string,
  gameType: GameType,
  productType: 'Cards' | 'Sealed Products' = 'Cards',
  limit = 24
): Promise<TCGPlayerSearchResult> {
  const body = {
    algorithm: 'sales_synonym_v2',
    from: 0,
    size: limit,
    filters: {
      term: {
        productLineName: [GAME_NAMES[gameType]],
        productTypeName: [productType],
      },
      range: {},
      match: {},
    },
    listingSearch: {
      filters: {
        term: { sellerStatus: 'Live', channelId: 0 },
        range: { quantity: { gte: 1 } },
        exclude: { channelExclusion: 0 },
      },
      context: { cart: {} },
    },
    context: { cart: {}, shippingCountry: 'US' },
    settings: { useFuzzySearch: true },
    sort: {},
  }

  const response = await fetchWithTimeout(
    `${SEARCH_API}/search/request?q=${encodeURIComponent(query)}&isList=false`,
    {
      timeoutMs: TIMEOUTS.DEFAULT,
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    throw new Error(`TCGPlayer search failed: ${response.status}`)
  }

  const data = await response.json()
  const searchResults = data.results?.[0]?.results || []
  const totalResults = data.results?.[0]?.totalResults || 0

  // Get product IDs from search results
  const productIds: number[] = searchResults
    .map((r: { productId: number }) => Math.round(r.productId))
    .filter((id: number, i: number, arr: number[]) => arr.indexOf(id) === i) // dedupe

  if (productIds.length === 0) {
    return { products: [], totalResults: 0 }
  }

  // Fetch product details in parallel (includes market price, set name, etc.)
  const products = await fetchProductDetails(productIds)

  return { products, totalResults }
}

/**
 * Fetch product details for multiple product IDs
 */
async function fetchProductDetails(productIds: number[]): Promise<TCGPlayerProduct[]> {
  const results = await Promise.allSettled(
    productIds.map(async (id) => {
      const response = await fetchWithTimeout(`${SEARCH_API}/product/${id}/details`, {
        timeoutMs: TIMEOUTS.DEFAULT,
        headers: HEADERS,
      })
      if (!response.ok) return null
      const data = await response.json()
      return {
        productId: Math.round(data.productId),
        productName: data.productName,
        setName: data.setName || '',
        marketPrice: data.marketPrice ?? null,
        lowestPriceWithShipping: data.lowestPriceWithShipping ?? null,
        rarityName: data.rarityName ?? null,
        imageCount: data.imageCount ?? 0,
        productUrlName: data.productUrlName || '',
        productLineUrlName: data.productLineUrlName || '',
        setCode: data.setCode || '',
        sealed: data.sealed ?? false,
        customAttributes: data.customAttributes,
      } as TCGPlayerProduct
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<TCGPlayerProduct | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((p): p is TCGPlayerProduct => p !== null)
}

/**
 * Get TCGPlayer image URL from product ID
 */
export function getTCGPlayerImageUrl(productId: number): string {
  return `https://tcgplayer-cdn.tcgplayer.com/product/${productId}_200w.jpg`
}

/**
 * Get TCGPlayer product page URL
 */
export function getTCGPlayerProductUrl(product: TCGPlayerProduct): string {
  return `https://www.tcgplayer.com/product/${product.productId}/${product.productUrlName}`
}
