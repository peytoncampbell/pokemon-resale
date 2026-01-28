import type { GameType, ProductType, UnifiedCard, UnifiedSearchResponse } from './card-types'
import { justTCGApi, JUSTTCG_GAMES, type JustTCGCard } from './justtcg-api'

function fromJustTCG(card: JustTCGCard, gameType: GameType): UnifiedCard {
  const productType: ProductType = justTCGApi.isSealed(card) ? 'sealed' : 'card'
  return {
    id: card.id,
    gameType,
    productType,
    name: card.name,
    setName: card.set_name,
    imageSmall: justTCGApi.getImageUrl(card),
    rarity: card.rarity,
    marketPrice: justTCGApi.getMarketPrice(card),
  }
}

export const cardApi = {
  async searchCards(query: string, gameType: GameType): Promise<UnifiedSearchResponse> {
    const gameId = JUSTTCG_GAMES[gameType]
    const cards = await justTCGApi.searchCards(query, gameId)
    return {
      data: cards.map(card => fromJustTCG(card, gameType)),
      totalCount: cards.length,
    }
  },

  async getRecentCards(gameType: GameType): Promise<UnifiedSearchResponse> {
    const gameId = JUSTTCG_GAMES[gameType]
    const cards = await justTCGApi.getRecentCards(gameId)
    return {
      data: cards.map(card => fromJustTCG(card, gameType)),
      totalCount: cards.length,
    }
  },

  async getCard(id: string, gameType: GameType): Promise<UnifiedCard> {
    const card = await justTCGApi.getCard(id)
    if (!card) throw new Error(`Card not found: ${id}`)
    return fromJustTCG(card, gameType)
  },
}
