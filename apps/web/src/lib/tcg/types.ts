// Unified TCG Data Types
// Supports Pokemon, One Piece, and potentially other TCGs

export type GameType = 'pokemon' | 'onepiece'
export type ProductType = 'card' | 'sealed' | 'graded'
export type DataSource = 'justtcg' | 'tcgplayer' | 'ebay'

export type SealedType =
  | 'booster-box'
  | 'etb'
  | 'bundle'
  | 'tin'
  | 'collection'
  | 'blister'
  | 'case'
  | 'other'

export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'SGC'

export type Condition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'

// Base product interface
export interface TCGProduct {
  id: string
  name: string
  gameType: GameType
  productType: ProductType
  setName: string
  imageUrl: string
  prices: {
    market: number | null
    low: number | null
    high: number | null
  }
  source: DataSource
  lastUpdated: Date
}

// Card-specific product (extends base)
export interface CardProduct extends TCGProduct {
  productType: 'card'
  rarity?: string
  number?: string
  tcgplayerId?: string
  variants?: CardVariant[]
}

export interface CardVariant {
  id: string
  condition: Condition
  printing: 'Normal' | 'Holofoil' | 'Reverse Holofoil' | string
  price: number | null
  priceChange7d?: number | null
  priceChange30d?: number | null
}

// Sealed product (extends base)
export interface SealedProduct extends TCGProduct {
  productType: 'sealed'
  sealedType: SealedType
  tcgplayerId?: string
  msrp?: number | null
  releaseDate?: string | null
}

// Graded card (extends base)
export interface GradedCard extends TCGProduct {
  productType: 'graded'
  gradingCompany: GradingCompany
  grade: number
  subgrades?: {
    centering?: number
    corners?: number
    edges?: number
    surface?: number
  }
  cardName: string
  cardSet: string
  cardNumber?: string
  recentSales: GradedSale[]
  averagePrice: number | null
  medianPrice: number | null
  salesCount: number
}

export interface GradedSale {
  price: number
  date: Date
  source: 'ebay'
  listingTitle?: string
}

// Search/filter options
export interface TCGSearchOptions {
  query?: string
  gameType?: GameType
  productType?: ProductType
  setName?: string
  limit?: number
  offset?: number
}

export interface SealedSearchOptions extends TCGSearchOptions {
  productType: 'sealed'
  sealedType?: SealedType
}

export interface GradedSearchOptions {
  cardName: string
  setName?: string
  cardNumber?: string
  gradingCompany?: GradingCompany
  grade?: number
  gameType?: GameType
  limit?: number
}

// API response types
export interface TCGSearchResponse<T extends TCGProduct> {
  data: T[]
  meta: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  cached: boolean
  cacheExpires?: Date
}

// Cache entry type
export interface TCGCacheEntry {
  id: string
  productType: ProductType
  gameType: GameType
  data: unknown
  source: DataSource
  createdAt: Date
  expiresAt: Date
}

// Error types
export interface TCGError {
  code: string
  message: string
  source?: DataSource
  retryable: boolean
}

// Utility type guards
export function isCardProduct(product: TCGProduct): product is CardProduct {
  return product.productType === 'card'
}

export function isSealedProduct(product: TCGProduct): product is SealedProduct {
  return product.productType === 'sealed'
}

export function isGradedCard(product: TCGProduct): product is GradedCard {
  return product.productType === 'graded'
}

// Helper to detect sealed type from product name
export function detectSealedType(name: string): SealedType {
  const nameLower = name.toLowerCase()

  if (nameLower.includes('booster box') || nameLower.includes('booster case')) {
    return 'booster-box'
  }
  if (nameLower.includes('elite trainer box') || nameLower.includes('etb')) {
    return 'etb'
  }
  if (nameLower.includes('bundle')) {
    return 'bundle'
  }
  if (nameLower.includes('tin')) {
    return 'tin'
  }
  if (nameLower.includes('blister') || nameLower.includes('3-pack')) {
    return 'blister'
  }
  if (nameLower.includes('case') && !nameLower.includes('showcase')) {
    return 'case'
  }
  if (nameLower.includes('collection') || nameLower.includes('premium')) {
    return 'collection'
  }

  return 'other'
}

// Helper to parse grading info from listing title
export function parseGradingInfo(title: string): { company: GradingCompany | null; grade: number | null } {
  const titleUpper = title.toUpperCase()

  let company: GradingCompany | null = null
  if (titleUpper.includes('PSA')) company = 'PSA'
  else if (titleUpper.includes('BGS') || titleUpper.includes('BECKETT')) company = 'BGS'
  else if (titleUpper.includes('CGC')) company = 'CGC'
  else if (titleUpper.includes('SGC')) company = 'SGC'

  // Match patterns like "PSA 10", "BGS 9.5", "CGC 10"
  const gradeMatch = title.match(/(?:PSA|BGS|CGC|SGC)\s*(\d+(?:\.\d+)?)/i)
  const grade = gradeMatch ? parseFloat(gradeMatch[1]) : null

  return { company, grade }
}
