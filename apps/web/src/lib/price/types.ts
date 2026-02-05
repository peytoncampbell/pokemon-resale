// Price Data Types
// Types for price snapshots and freshness tracking

import type { GameType } from '@/lib/tcg/types'

export type FreshnessStatus = 'fresh' | 'stale' | 'very_stale'

export interface PriceSnapshot {
  id: string
  card_id: string
  card_name: string
  product_type: 'card' | 'sealed'
  game_type: GameType
  market_price: number | null
  low_price: number | null
  source: 'tcgplayer' | 'ebay'
  condition: string
  raw_data?: Record<string, unknown>
  recorded_at: string
  created_at: string
}

export interface PriceWithFreshness {
  card_id: string
  card_name: string
  product_type: 'card' | 'sealed'
  game_type: GameType
  market_price: number | null
  low_price: number | null
  source: 'tcgplayer' | 'ebay'
  condition: string
  recorded_at: string
  hours_old: number
  freshness: FreshnessStatus
}

export interface PriceHistoryPoint {
  recorded_at: string
  market_price: number
  source: 'tcgplayer' | 'ebay'
}
