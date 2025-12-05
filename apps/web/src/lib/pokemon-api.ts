const POKEMON_API_BASE = 'https://api.pokemontcg.io/v2'

export interface PokemonCard {
  id: string
  name: string
  supertype: string
  subtypes: string[]
  hp?: string
  types?: string[]
  rarity?: string
  set: {
    id: string
    name: string
    series: string
    images: {
      symbol: string
      logo: string
    }
  }
  number: string
  images: {
    small: string
    large: string
  }
  tcgplayer?: {
    url: string
    updatedAt: string
    prices: {
      holofoil?: {
        low: number
        mid: number
        high: number
        market: number
      }
      reverseHolofoil?: {
        low: number
        mid: number
        high: number
        market: number
      }
      normal?: {
        low: number
        mid: number
        high: number
        market: number
      }
      '1stEditionHolofoil'?: {
        low: number
        mid: number
        high: number
        market: number
      }
    }
  }
  cardmarket?: {
    prices: {
      averageSellPrice: number
      lowPrice: number
      trendPrice: number
    }
  }
}

export interface SearchCardsResponse {
  data: PokemonCard[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

export const pokemonApi = {
  async getRecentCards(page = 1, pageSize = 30): Promise<SearchCardsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy: '-set.releaseDate',
    })

    const response = await fetch(`${POKEMON_API_BASE}/cards?${params}`)

    if (!response.ok) {
      throw new Error('Failed to fetch cards')
    }

    return response.json()
  },

  async searchCards(query: string, page = 1, pageSize = 30): Promise<SearchCardsResponse> {
    const params = new URLSearchParams({
      q: `name:${query}*`,
      page: String(page),
      pageSize: String(pageSize),
      orderBy: '-set.releaseDate',
    })

    const response = await fetch(`${POKEMON_API_BASE}/cards?${params}`)

    if (!response.ok) {
      throw new Error('Failed to search cards')
    }

    return response.json()
  },

  async getCard(id: string): Promise<PokemonCard> {
    const response = await fetch(`${POKEMON_API_BASE}/cards/${id}`)

    if (!response.ok) {
      throw new Error('Failed to get card')
    }

    const data = await response.json()
    return data.data
  },

  async getSets() {
    const response = await fetch(`${POKEMON_API_BASE}/sets`)

    if (!response.ok) {
      throw new Error('Failed to get sets')
    }

    return response.json()
  },

  getMarketPrice(card: PokemonCard): number | null {
    if (!card.tcgplayer?.prices) return null

    const prices = card.tcgplayer.prices

    // Try to get the most relevant price
    if (prices.holofoil?.market) return prices.holofoil.market
    if (prices.reverseHolofoil?.market) return prices.reverseHolofoil.market
    if (prices.normal?.market) return prices.normal.market
    if (prices['1stEditionHolofoil']?.market) return prices['1stEditionHolofoil'].market

    return null
  },

  getPriceRange(card: PokemonCard): { low: number; high: number } | null {
    if (!card.tcgplayer?.prices) return null

    const prices = card.tcgplayer.prices
    let low = Infinity
    let high = -Infinity

    Object.values(prices).forEach((priceType) => {
      if (priceType?.low && priceType.low < low) low = priceType.low
      if (priceType?.high && priceType.high > high) high = priceType.high
    })

    if (low === Infinity || high === -Infinity) return null

    return { low, high }
  },
}
