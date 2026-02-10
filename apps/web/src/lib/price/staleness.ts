// Price Staleness Detection
// Queries latest_prices view to determine data freshness

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import type { PriceSnapshot, PriceWithFreshness, PriceHistoryPoint } from './types'

// Staleness threshold in hours (48 hours = fresh, 7 days = stale, beyond = very_stale)
export const STALENESS_THRESHOLD_HOURS = 48

/**
 * Get Supabase client for price operations (server-side only)
 * Always uses service role key to bypass RLS — all callers are API routes
 * that already verify authentication via verifyApiAuth()
 */
function getSupabaseClient(authHeader?: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const key = serviceKey || anonKey

  if (!url || !key) {
    console.warn('Supabase credentials not available for price operations')
    return null
  }

  // If we have service role key, use it directly (bypasses RLS)
  if (serviceKey) {
    return createClient(url, serviceKey)
  }

  // Otherwise use anon key with auth header (requires RLS policy for authenticated)
  if (authHeader) {
    return createClient(url, key, {
      global: { headers: { Authorization: authHeader } }
    })
  }

  return createClient(url, key)
}

/**
 * Get the latest price for a specific card with freshness status
 * Queries the latest_prices view which automatically calculates freshness
 */
export async function getCardPriceWithFreshness(
  cardId: string
): Promise<PriceWithFreshness | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('latest_prices')
      .select('*')
      .eq('card_id', cardId)
      .single()

    if (error || !data) return null

    return data as PriceWithFreshness
  } catch (error) {
    console.error('Error fetching card price with freshness:', error)
    return null
  }
}

/**
 * Get all stale cards (prices that need refreshing)
 * Returns cards ordered by staleness (most stale first)
 */
export async function getStaleCards(limit = 50): Promise<PriceWithFreshness[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('latest_prices')
      .select('*')
      .neq('freshness', 'fresh')
      .order('hours_old', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data as PriceWithFreshness[]
  } catch (error) {
    console.error('Error fetching stale cards:', error)
    return []
  }
}

/**
 * Get price history for a card over the last N days
 * Returns time-series data for charting and trend analysis
 */
export async function getCardPriceHistory(
  cardId: string,
  days: number
): Promise<PriceHistoryPoint[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { data, error } = await supabase
      .from('price_snapshots')
      .select('recorded_at, market_price, source')
      .eq('card_id', cardId)
      .gte('recorded_at', cutoffDate.toISOString())
      .order('recorded_at', { ascending: true })

    if (error || !data) return []

    return data.map((row) => ({
      recorded_at: row.recorded_at,
      market_price: row.market_price ?? 0,
      source: row.source as 'tcgplayer' | 'ebay',
    }))
  } catch (error) {
    console.error('Error fetching card price history:', error)
    return []
  }
}

/**
 * Save a new price snapshot
 * Uses upsert to handle duplicates gracefully (deduplication constraint)
 * Requires service role key - only for server-side use
 */
export async function savePriceSnapshot(
  snapshot: Omit<PriceSnapshot, 'id' | 'created_at'>
): Promise<boolean> {
  // Try to get auth header from the current request context
  let authHeader: string | null = null
  try {
    const headerStore = await headers()
    authHeader = headerStore.get('Authorization')
  } catch {
    // Not in a request context
  }
  const supabase = getSupabaseClient(authHeader)
  if (!supabase) {
    console.error('Supabase client not available for saving price snapshots')
    return false
  }

  try {
    const { error } = await supabase.from('price_snapshots').insert({
      card_id: snapshot.card_id,
      card_name: snapshot.card_name,
      product_type: snapshot.product_type,
      game_type: snapshot.game_type,
      market_price: snapshot.market_price,
      low_price: snapshot.low_price,
      source: snapshot.source,
      condition: snapshot.condition,
      raw_data: snapshot.raw_data,
      recorded_at: snapshot.recorded_at,
    })

    if (error) {
      // Duplicate for same card/source/condition/day is expected — not an error
      if (error.code === '23505') {
        return true
      }
      console.error('Error saving price snapshot:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving price snapshot:', error)
    return false
  }
}
