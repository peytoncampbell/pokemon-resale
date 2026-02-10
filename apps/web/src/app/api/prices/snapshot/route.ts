import { NextRequest, NextResponse } from 'next/server'
import { verifyApiAuth } from '@/lib/api-auth'
import { savePriceSnapshot } from '@/lib/price/staleness'

export const dynamic = 'force-dynamic'

/**
 * POST /api/prices/snapshot
 * Save a price snapshot directly (no scraping needed)
 * Used when we already have the price (e.g., from search results)
 */
export async function POST(request: NextRequest) {
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { cardId, cardName, marketPrice, lowPrice, gameType, productType } = body

    if (!cardId || !cardName || marketPrice == null) {
      return NextResponse.json(
        { error: 'Missing required fields: cardId, cardName, marketPrice' },
        { status: 400 }
      )
    }

    const saved = await savePriceSnapshot({
      card_id: cardId,
      card_name: cardName,
      product_type: productType || 'card',
      game_type: gameType || 'pokemon',
      market_price: marketPrice,
      low_price: lowPrice ?? null,
      source: 'tcgplayer',
      condition: 'NM',
      raw_data: { savedFrom: 'search-results' },
      recorded_at: new Date().toISOString(),
    })

    if (!saved) {
      return NextResponse.json({ error: 'Failed to save snapshot' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Price snapshot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
