import { NextRequest, NextResponse } from 'next/server'
import type { GameType } from '@/lib/tcg/types'
import {
  scrapeTCGPlayer,
  buildTCGPlayerUrl,
  type TCGPlayerCard,
  type TCGPlayerSearchOptions,
} from '@/lib/tcg/tcgplayer-scraper'
import { generateCacheKey, tcgCache } from '@/lib/tcg/cache'
import { verifyApiAuth } from '@/lib/api-auth'

export const maxDuration = 60 // Allow up to 60 seconds for scraping
export const dynamic = 'force-dynamic'

// Maximum page to prevent abuse
const MAX_PAGE = 100

export async function GET(request: NextRequest) {
  // Authentication check
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const gameType = (searchParams.get('game') || 'pokemon') as GameType
  const query = searchParams.get('q') || undefined
  const setName = searchParams.get('set') || undefined
  const productType = (searchParams.get('type') || 'Cards') as 'Cards' | 'Sealed Products'
  const rawPage = parseInt(searchParams.get('page') || '1', 10)
  const page = Math.min(Math.max(1, rawPage), MAX_PAGE) // Bound between 1 and MAX_PAGE
  const noCache = searchParams.get('nocache') === 'true'
  const debug = searchParams.get('debug') === 'true'

  // Validate product type
  if (productType !== 'Cards' && productType !== 'Sealed Products') {
    return NextResponse.json(
      { error: 'Invalid product type. Must be "Cards" or "Sealed Products"' },
      { status: 400 }
    )
  }

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
    return NextResponse.json(
      { error: 'Failed to fetch card data' },
      { status: 500 }
    )
  }
}
