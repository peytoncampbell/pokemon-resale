export type GameType = 'pokemon' | 'onepiece'
export type ProductType = 'card' | 'sealed'

export interface UnifiedCard {
  id: string
  gameType: GameType
  productType: ProductType
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
