// TCG Data Caching Layer
// Uses Supabase for persistent caching of scraped data

import { createClient } from '@supabase/supabase-js'
import type { DataSource, GameType, ProductType } from './types'

// Cache durations in milliseconds
export const CACHE_DURATIONS = {
  cards: 5 * 60 * 1000, // 5 minutes - API is fast
  sealed: 60 * 60 * 1000, // 1 hour - scraping is slow
  graded: 6 * 60 * 60 * 1000, // 6 hours - eBay data changes slowly
} as const

// Cache key generation
export function generateCacheKey(
  productType: ProductType,
  gameType: GameType,
  identifier: string
): string {
  return `${productType}:${gameType}:${identifier}`.toLowerCase().replace(/\s+/g, '-')
}

// In-memory cache for quick access
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>()

// Memory cache operations
export const memCache = {
  get<T>(key: string): T | null {
    const entry = memoryCache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key)
      return null
    }
    return entry.data as T
  },

  set(key: string, data: unknown, ttlMs: number): void {
    memoryCache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    })
  },

  delete(key: string): void {
    memoryCache.delete(key)
  },

  clear(): void {
    memoryCache.clear()
  },
}

// Supabase cache table type
interface TCGCacheRow {
  id: string
  product_type: string
  game_type: string
  data: unknown
  source: string
  created_at: string
  expires_at: string
}

// Create a separate Supabase client for server-side cache operations
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase credentials not available for cache')
    return null
  }

  return createClient(url, key)
}

// Database cache operations
export const dbCache = {
  /**
   * Get cached data from Supabase
   */
  async get<T>(key: string): Promise<{ data: T; expiresAt: Date } | null> {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('tcg_cache')
        .select('data, expires_at')
        .eq('id', key)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error || !data) return null

      return {
        data: data.data as T,
        expiresAt: new Date(data.expires_at),
      }
    } catch {
      return null
    }
  },

  /**
   * Set cached data in Supabase
   */
  async set(
    key: string,
    data: unknown,
    options: {
      productType: ProductType
      gameType: GameType
      source: DataSource
      ttlMs: number
    }
  ): Promise<void> {
    const supabase = getSupabaseClient()
    if (!supabase) return

    const expiresAt = new Date(Date.now() + options.ttlMs)

    try {
      await supabase.from('tcg_cache').upsert({
        id: key,
        product_type: options.productType,
        game_type: options.gameType,
        data,
        source: options.source,
        expires_at: expiresAt.toISOString(),
      })
    } catch (error) {
      console.error('Cache write error:', error)
    }
  },

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<void> {
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      await supabase.from('tcg_cache').delete().eq('id', key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  },

  /**
   * Clean up expired cache entries
   */
  async cleanup(): Promise<number> {
    const supabase = getSupabaseClient()
    if (!supabase) return 0

    try {
      const { data } = await supabase
        .from('tcg_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id')

      return data?.length ?? 0
    } catch (error) {
      console.error('Cache cleanup error:', error)
      return 0
    }
  },
}

// Combined cache with memory + database layers
export const tcgCache = {
  /**
   * Get data from cache (memory first, then database)
   */
  async get<T>(key: string): Promise<{ data: T; cached: boolean; expiresAt?: Date } | null> {
    // Check memory cache first
    const memData = memCache.get<T>(key)
    if (memData) {
      return { data: memData, cached: true }
    }

    // Check database cache
    const dbData = await dbCache.get<T>(key)
    if (dbData) {
      // Populate memory cache
      const ttl = dbData.expiresAt.getTime() - Date.now()
      if (ttl > 0) {
        memCache.set(key, dbData.data, ttl)
      }
      return { data: dbData.data, cached: true, expiresAt: dbData.expiresAt }
    }

    return null
  },

  /**
   * Set data in both memory and database cache
   */
  async set(
    key: string,
    data: unknown,
    options: {
      productType: ProductType
      gameType: GameType
      source: DataSource
    }
  ): Promise<void> {
    const durationKey = options.productType === 'card' ? 'cards' : options.productType
    const ttlMs = CACHE_DURATIONS[durationKey]

    // Set in memory cache
    memCache.set(key, data, ttlMs)

    // Set in database cache (async, don't await)
    dbCache.set(key, data, { ...options, ttlMs }).catch(console.error)
  },

  /**
   * Invalidate cache entry
   */
  async invalidate(key: string): Promise<void> {
    memCache.delete(key)
    await dbCache.delete(key)
  },

  /**
   * Create a cached wrapper for an async function
   */
  wrap<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
    options: {
      keyFn: (...args: TArgs) => string
      productType: ProductType
      gameType: GameType
      source: DataSource
    }
  ): (...args: TArgs) => Promise<{ data: TResult; cached: boolean; expiresAt?: Date }> {
    return async (...args: TArgs) => {
      const key = options.keyFn(...args)

      // Check cache
      const cached = await tcgCache.get<TResult>(key)
      if (cached) {
        return cached
      }

      // Fetch fresh data
      const data = await fn(...args)

      // Cache the result
      await tcgCache.set(key, data, {
        productType: options.productType,
        gameType: options.gameType,
        source: options.source,
      })

      return { data, cached: false }
    }
  },
}
