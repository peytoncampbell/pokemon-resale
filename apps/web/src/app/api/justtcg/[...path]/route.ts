import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyApiAuth } from '@/lib/api-auth'

const JUSTTCG_API_BASE = 'https://api.justtcg.com/v1'
const API_KEY = process.env.JUSTTCG_API_KEY

// Whitelist of allowed API endpoints
const ALLOWED_ENDPOINTS = ['cards', 'sets', 'games']

// Cache durations based on endpoint type
const CACHE_DURATIONS = {
  cards: 10 * 60 * 1000,    // 10 minutes for card searches
  sets: 60 * 60 * 1000,     // 1 hour for sets (rarely change)
  default: 5 * 60 * 1000,   // 5 minutes default
}

// In-memory cache for ultra-fast repeated requests (same server instance)
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>()

function getMemoryCache(key: string): unknown | null {
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key)
    return null
  }
  return entry.data
}

function setMemoryCache(key: string, data: unknown, ttlMs: number): void {
  // Limit cache size
  if (memoryCache.size > 1000) {
    const entries = Array.from(memoryCache.entries())
    entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    for (let i = 0; i < 200; i++) {
      memoryCache.delete(entries[i][0])
    }
  }
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

// Fetch with retry and 429 backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options)

    if (response.status !== 429 || attempt === maxRetries) {
      return response
    }

    // Read Retry-After header (seconds) or use exponential backoff
    const retryAfter = response.headers.get('Retry-After')
    const waitMs = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : Math.min(1000 * 2 ** attempt, 8000)

    console.warn(`JustTCG 429 rate limited, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`)
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  // Unreachable, but TypeScript needs it
  throw new Error('Retry logic failed')
}

// Supabase client for persistent cache
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Get from Supabase cache
async function getDbCache(key: string): Promise<unknown | null> {
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
    return data.data
  } catch {
    return null
  }
}

// Set in Supabase cache
async function setDbCache(
  key: string,
  data: unknown,
  ttlMs: number,
  endpoint: string,
  searchParamsStr: string
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return

  const expiresAt = new Date(Date.now() + ttlMs)

  // Determine product type from endpoint
  const productType = endpoint.includes('sealed') ? 'sealed' : 'card'

  // Extract game type from search params
  const urlParams = new URLSearchParams(searchParamsStr)
  const gameParam = urlParams.get('game')
  const gameType = gameParam === 'one-piece-card-game' ? 'onepiece' : 'pokemon'

  try {
    await supabase.from('tcg_cache').upsert({
      id: key,
      product_type: productType,
      game_type: gameType,
      data,
      source: 'justtcg',
      expires_at: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Authentication check
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Validate API key is configured
  if (!API_KEY) {
    console.error('JUSTTCG_API_KEY is not configured')
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }

  const { path } = await params
  const pathString = path.filter(Boolean).join('/')

  // Validate endpoint is allowed (prevent SSRF)
  const baseEndpoint = pathString.split('/')[0]
  if (!ALLOWED_ENDPOINTS.includes(baseEndpoint)) {
    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    )
  }

  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${JUSTTCG_API_BASE}/${pathString}${searchParams ? `?${searchParams}` : ''}`
  const cacheKey = `justtcg:${pathString}:${searchParams}`

  // Determine cache TTL based on endpoint
  const ttl = pathString.includes('sets')
    ? CACHE_DURATIONS.sets
    : pathString.includes('cards')
      ? CACHE_DURATIONS.cards
      : CACHE_DURATIONS.default

  // 1. Check memory cache first (fastest)
  const memCached = getMemoryCache(cacheKey)
  if (memCached) {
    console.log('JustTCG proxy - memory cache hit')
    return NextResponse.json(memCached)
  }

  // 2. Check Supabase cache (persistent across restarts/instances)
  const dbCached = await getDbCache(cacheKey)
  if (dbCached) {
    console.log('JustTCG proxy - database cache hit')
    // Populate memory cache for future requests
    setMemoryCache(cacheKey, dbCached, ttl)
    return NextResponse.json(dbCached)
  }

  // 3. Fetch from JustTCG API
  console.log('JustTCG proxy - fetching from API:', url)

  try {
    const response = await fetchWithRetry(url, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('JustTCG API error:', data)
      const headers: HeadersInit = {}
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        if (retryAfter) headers['Retry-After'] = retryAfter
      }
      return NextResponse.json(data, { status: response.status, headers })
    }

    // Cache successful responses in both layers
    setMemoryCache(cacheKey, data, ttl)
    // Don't await DB cache write - do it async
    setDbCache(cacheKey, data, ttl, pathString, searchParams).catch(console.error)

    console.log('JustTCG proxy - success, cached to memory + database')
    return NextResponse.json(data)
  } catch (error) {
    console.error('JustTCG proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch card data' },
      { status: 500 }
    )
  }
}
