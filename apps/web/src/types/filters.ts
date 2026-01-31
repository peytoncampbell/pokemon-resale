export type InventoryStatus = 'IN_STOCK' | 'LISTED' | 'SOLD'
export type Condition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
export type GameType = 'pokemon' | 'onepiece'
export type ProductType = 'card' | 'sealed'

export interface InventoryFilters {
  status: InventoryStatus | 'ALL'
  condition: Condition | 'ALL'
  location: string | null
  gameType: GameType | 'ALL'
  productType: ProductType | 'ALL'
  priceMin: number | null
  priceMax: number | null
  dateFrom: Date | null
  dateTo: Date | null
  search: string
  sortBy: 'created_at' | 'card_name' | 'acquisition_cost' | 'condition'
  sortOrder: 'asc' | 'desc'
}

export const DEFAULT_FILTERS: InventoryFilters = {
  status: 'ALL',
  condition: 'ALL',
  location: null,
  gameType: 'ALL',
  productType: 'ALL',
  priceMin: null,
  priceMax: null,
  dateFrom: null,
  dateTo: null,
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
}

export const CONDITION_OPTIONS = [
  { value: 'ALL', label: 'All Conditions' },
  { value: 'NM', label: 'Near Mint', color: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'LP', label: 'Lightly Played', color: 'bg-green-500/20 text-green-400' },
  { value: 'MP', label: 'Moderately Played', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'HP', label: 'Heavily Played', color: 'bg-orange-500/20 text-orange-400' },
  { value: 'DMG', label: 'Damaged', color: 'bg-red-500/20 text-red-400' },
] as const

export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'IN_STOCK', label: 'In Stock', color: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'LISTED', label: 'Listed', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'SOLD', label: 'Sold', color: 'bg-gray-500/20 text-gray-400' },
] as const

export const GAME_OPTIONS = [
  { value: 'ALL', label: 'All Games' },
  { value: 'pokemon', label: 'Pokemon' },
  { value: 'onepiece', label: 'One Piece' },
] as const

export const PRODUCT_OPTIONS = [
  { value: 'ALL', label: 'All Types' },
  { value: 'card', label: 'Cards' },
  { value: 'sealed', label: 'Sealed' },
] as const

export const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First', sortBy: 'created_at', sortOrder: 'desc' },
  { value: 'created_at:asc', label: 'Oldest First', sortBy: 'created_at', sortOrder: 'asc' },
  { value: 'card_name:asc', label: 'Name A-Z', sortBy: 'card_name', sortOrder: 'asc' },
  { value: 'card_name:desc', label: 'Name Z-A', sortBy: 'card_name', sortOrder: 'desc' },
  { value: 'acquisition_cost:asc', label: 'Price: Low to High', sortBy: 'acquisition_cost', sortOrder: 'asc' },
  { value: 'acquisition_cost:desc', label: 'Price: High to Low', sortBy: 'acquisition_cost', sortOrder: 'desc' },
] as const
