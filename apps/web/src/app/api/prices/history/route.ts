import { NextRequest, NextResponse } from 'next/server'
import { verifyApiAuth } from '@/lib/api-auth'
import {
  getCardPriceHistory,
  getCardPriceWithFreshness,
} from '@/lib/price/staleness'
import type { PriceHistoryPoint } from '@/lib/price/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Authentication check
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const cardId = searchParams.get('cardId')
  const daysParam = searchParams.get('days')
  const sourceParam = searchParams.get('source')

  // Validate cardId
  if (!cardId) {
    return NextResponse.json(
      { error: 'Missing required parameter: cardId' },
      { status: 400 }
    )
  }

  // Parse and validate days parameter
  const days = Math.min(
    Math.max(1, parseInt(daysParam || '30', 10) || 30),
    90
  )

  try {
    // Fetch price history
    let history = await getCardPriceHistory(cardId, days)

    // Filter by source if specified
    if (sourceParam && (sourceParam === 'tcgplayer' || sourceParam === 'ebay')) {
      history = history.filter((point) => point.source === sourceParam)
    }

    // Fetch current price with freshness
    const current = await getCardPriceWithFreshness(cardId)

    // Calculate statistics from history
    const stats = calculateStats(history)

    return NextResponse.json({
      data: {
        card_id: cardId,
        current: current
          ? {
              market_price: current.market_price,
              source: current.source,
              freshness: current.freshness,
              hours_old: current.hours_old,
              recorded_at: current.recorded_at,
            }
          : null,
        history,
        stats,
      },
    })
  } catch (error) {
    console.error('Price history error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch price history',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Calculate statistics from price history
 */
function calculateStats(history: PriceHistoryPoint[]): {
  min: number | null
  max: number | null
  avg: number | null
  count: number
} {
  if (history.length === 0) {
    return { min: null, max: null, avg: null, count: 0 }
  }

  const prices = history.map((point) => point.market_price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const sum = prices.reduce((acc, price) => acc + price, 0)
  const avg = sum / prices.length

  return {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    avg: Math.round(avg * 100) / 100,
    count: history.length,
  }
}
