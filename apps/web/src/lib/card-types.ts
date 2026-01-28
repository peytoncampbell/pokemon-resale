export type GameType = 'pokemon' | 'onepiece'

export interface UnifiedCard {
  id: string
  gameType: GameType
  name: string
  setName: string
  imageSmall: string
  imageLarge?: string
  rarity?: string
  marketPrice: number | null
}

export interface UnifiedSearchResponse {
  data: UnifiedCard[]
  totalCount: number
}
