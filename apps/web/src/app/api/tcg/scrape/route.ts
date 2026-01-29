import { NextRequest, NextResponse } from 'next/server'
import type { GameType } from '@/lib/tcg/types'
import {
  scrapeTCGPlayer,
  buildTCGPlayerUrl,
  type TCGPlayerCard,
  type TCGPlayerSearchOptions,
} from '@/lib/tcg/tcgplayer-scraper'
import { generateCacheKey, tcgCache } from '@/lib/tcg/cache'

export const maxDuration = 60 // Allow up to 60 seconds for scraping
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const gameType = (searchParams.get('game') || 'pokemon') as GameType
  const query = searchParams.get('q') || undefined
  const setName = searchParams.get('set') || undefined
  const productType = (searchParams.get('type') || 'Cards') as 'Cards' | 'Sealed Products'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const noCache = searchParams.get('nocache') === 'true'
  const debug = searchParams.get('debug') === 'true'

  // Validate game type
  if (gameType !== 'pokemon' && gameType !== 'onepiece') {
    return NextResponse.json(
      { error: 'Invalid game type. Must be "pokemon" or "onepiece"' },
      { status: 400 }
    )
  }

  // Must have either query or setName
  if (!query && !setName) {
    return NextResponse.json(
      { error: 'Must provide either "q" (search query) or "set" (set name)' },
      { status: 400 }
    )
  }

  try {
    // Check cache first
    // Use 'card' or 'sealed' as base type for cache key
    const baseProductType = productType === 'Cards' ? 'card' : 'sealed'
    const cacheKey = generateCacheKey(
      baseProductType,
      gameType,
      `tcgplayer:${query || ''}:${setName || ''}:${page}`
    )

    if (!noCache) {
      const cached = await tcgCache.get<TCGPlayerCard[]>(cacheKey)
      if (cached) {
        return NextResponse.json({
          data: cached.data,
          meta: {
            total: cached.data.length,
            page,
            source: 'tcgplayer',
          },
          cached: true,
          cacheExpires: cached.expiresAt,
          url: buildTCGPlayerUrl({ gameType, query, setName, page, productType }),
        })
      }
    }

    // Scrape TCGPlayer
    const options: TCGPlayerSearchOptions & { debug?: boolean } = {
      gameType,
      query,
      setName,
      page,
      productType,
      debug,
    }

    const cards = await scrapeTCGPlayer(options)

    // Cache results for 1 hour
    if (cards.length > 0) {
      await tcgCache.set(cacheKey, cards, {
        productType: productType === 'Cards' ? 'card' : 'sealed',
        gameType,
        source: 'tcgplayer',
      })
    }

    return NextResponse.json({
      data: cards,
      meta: {
        total: cards.length,
        page,
        source: 'tcgplayer',
      },
      cached: false,
      url: buildTCGPlayerUrl(options),
    })

  } catch (error) {
    console.error('TCGPlayer scrape API error:', error)

    // Return helpful error with the URL that was attempted
    const attemptedUrl = buildTCGPlayerUrl({ gameType, query, setName, page, productType })

    return NextResponse.json(
      {
        error: 'Failed to scrape TCGPlayer',
        details: error instanceof Error ? error.message : 'Unknown error',
        attemptedUrl,
        hint: 'Make sure Chrome/Chromium is installed for local development',
      },
      { status: 500 }
    )
  }
}
