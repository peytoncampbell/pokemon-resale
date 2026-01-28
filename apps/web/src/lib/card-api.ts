import type { GameType, UnifiedCard, UnifiedSearchResponse } from './card-types'
import { pokemonApi, type PokemonCard } from './pokemon-api'
import { justTCGApi, JUSTTCG_GAMES, type JustTCGCard } from './justtcg-api'

function fromPokemon(card: PokemonCard): UnifiedCard {
  return {
    id: card.id,
    gameType: 'pokemon',
    name: card.name,
    setName: card.set.name,
    imageSmall: card.images.small,
    imageLarge: card.images.large,
    rarity: card.rarity,
    marketPrice: pokemonApi.getMarketPrice(card),
  }
}

function fromJustTCG(card: JustTCGCard, gameType: GameType): UnifiedCard {
  return {
    id: card.id,
    gameType,
    name: card.name,
    setName: card.set_name,
    imageSmall: justTCGApi.getImageUrl(card),
    rarity: card.rarity,
    marketPrice: justTCGApi.getMarketPrice(card),
  }
}

export const cardApi = {
  async searchCards(query: string, gameType: GameType): Promise<UnifiedSearchResponse> {
    if (gameType === 'pokemon') {
      const response = await pokemonApi.searchCards(query)
      return {
        data: response.data.map(fromPokemon),
        totalCount: response.totalCount,
      }
    }

    // Use JustTCG for One Piece
    const gameId = JUSTTCG_GAMES[gameType]
    const cards = await justTCGApi.searchCards(query, gameId)
    return {
      data: cards.map(card => fromJustTCG(card, gameType)),
      totalCount: cards.length,
    }
  },

  async getRecentCards(gameType: GameType): Promise<UnifiedSearchResponse> {
    if (gameType === 'pokemon') {
      const response = await pokemonApi.getRecentCards()
      return {
        data: response.data.map(fromPokemon),
        totalCount: response.totalCount,
      }
    }

    // Use JustTCG for One Piece
    const gameId = JUSTTCG_GAMES[gameType]
    const cards = await justTCGApi.getRecentCards(gameId)
    return {
      data: cards.map(card => fromJustTCG(card, gameType)),
      totalCount: cards.length,
    }
  },

  async getCard(id: string, gameType: GameType): Promise<UnifiedCard> {
    if (gameType === 'pokemon') {
      const card = await pokemonApi.getCard(id)
      return fromPokemon(card)
    }

    // Use JustTCG for One Piece
    const card = await justTCGApi.getCard(id)
    if (!card) throw new Error(`One Piece card not found: ${id}`)
    return fromJustTCG(card, gameType)
  },
}
