import { NextRequest, NextResponse } from 'next/server'
import type { GameType } from '@/lib/tcg/types'
import { searchTCGPlayer, getTCGPlayerImageUrl } from '@/lib/tcg/tcgplayer-api'
import { generateCacheKey, tcgCache } from '@/lib/tcg/cache'
import { verifyApiAuth } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

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
  const productType = (searchParams.get('type') || 'Cards') as 'Cards' | 'Sealed Products'
  const noCache = searchParams.get('nocache') === 'true'

  // Validate
  if (gameType !== 'pokemon' && gameType !== 'onepiece') {
    return NextResponse.json({ error: 'Invalid game type' }, { status: 400 })
  }
  if (productType !== 'Cards' && productType !== 'Sealed Products') {
    return NextResponse.json({ error: 'Invalid product type' }, { status: 400 })
  }
  if (!query) {
    return NextResponse.json({ error: 'Must provide "q" search query' }, { status: 400 })
  }

  try {
    // Check cache first
    const baseProductType = productType === 'Cards' ? 'card' : 'sealed'
    const cacheKey = generateCacheKey(baseProductType, gameType, `tcgp:${query}`)

    if (!noCache) {
      const cached = await tcgCache.get(cacheKey)
      if (cached) {
        return NextResponse.json({
          data: cached.data,
          meta: { total: (cached.data as unknown[]).length, page: 1, source: 'tcgplayer' },
          cached: true,
          cacheExpires: cached.expiresAt,
          url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(query)}`,
        })
      }
    }

    // Search TCGPlayer via their internal API (no browser needed)
    const result = await searchTCGPlayer(query, gameType, productType)

    // Transform to the format the frontend expects
    const cards = result.products.map((p) => ({
      productId: String(p.productId),
      name: p.productName,
      setName: p.setName,
      number: p.customAttributes?.number || null,
      rarity: p.rarityName,
      imageUrl: getTCGPlayerImageUrl(p.productId),
      marketPrice: p.marketPrice,
      lowPrice: p.lowestPriceWithShipping,
      productUrl: `https://www.tcgplayer.com/product/${p.productId}/${p.productUrlName}`,
    }))

    // Cache for 1 hour
    if (cards.length > 0) {
      await tcgCache.set(cacheKey, cards, {
        productType: baseProductType,
        gameType,
        source: 'tcgplayer',
      })
    }

    return NextResponse.json({
      data: cards,
      meta: { total: cards.length, page: 1, source: 'tcgplayer' },
      cached: false,
      url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(query)}`,
    })
  } catch (error) {
    console.error('TCGPlayer API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch card data', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
