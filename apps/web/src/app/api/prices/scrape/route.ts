import { NextRequest, NextResponse } from 'next/server'
import type { GameType } from '@/lib/tcg/types'
import { verifyApiAuth } from '@/lib/api-auth'
import { fetchPriceWithFallback, fetchBatchPrices } from '@/lib/scrapers/price-fetcher'

export const maxDuration = 60 // Pro tier Vercel timeout
export const dynamic = 'force-dynamic'

// Valid game types - extend this array when new games are added to GameType union
const VALID_GAME_TYPES: GameType[] = ['pokemon', 'onepiece']

function isValidGameType(gameType: string): gameType is GameType {
  return VALID_GAME_TYPES.includes(gameType as GameType)
}

export async function POST(request: NextRequest) {
  // Authentication check
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Check if this is a batch request
    if (body.cards && Array.isArray(body.cards)) {
      // Batch mode
      if (body.cards.length === 0) {
        return NextResponse.json(
          { error: 'Batch request must contain at least one card' },
          { status: 400 }
        )
      }

      if (body.cards.length > 20) {
        return NextResponse.json(
          { error: 'Batch size limit exceeded (max 20 cards)' },
          { status: 400 }
        )
      }

      // Validate each card in batch
      for (const card of body.cards) {
        if (!card.cardId || !card.cardName || !card.gameType) {
          return NextResponse.json(
            {
              error: 'Each card must have cardId, cardName, and gameType',
              invalidCard: card,
            },
            { status: 400 }
          )
        }

        if (!isValidGameType(card.gameType)) {
          return NextResponse.json(
            {
              error: `Invalid gameType: ${card.gameType}. Must be one of: ${VALID_GAME_TYPES.join(', ')}`,
            },
            { status: 400 }
          )
        }
      }

      // Process batch
      const result = await fetchBatchPrices(body.cards, {
        batchSize: body.batchSize,
        delayBetweenMs: body.delayBetweenMs,
      })

      return NextResponse.json({
        data: result,
        cached: false,
      })
    } else {
      // Single card mode
      const { cardId, cardName, gameType, setName, productType } = body

      // Validate required fields
      if (!cardId || !cardName || !gameType) {
        return NextResponse.json(
          { error: 'Missing required fields: cardId, cardName, gameType' },
          { status: 400 }
        )
      }

      // Validate gameType
      if (!isValidGameType(gameType)) {
        return NextResponse.json(
          {
            error: `Invalid gameType: ${gameType}. Must be one of: ${VALID_GAME_TYPES.join(', ')}`,
          },
          { status: 400 }
        )
      }

      // Validate productType if provided
      if (productType && productType !== 'card' && productType !== 'sealed') {
        return NextResponse.json(
          { error: 'Invalid productType. Must be "card" or "sealed"' },
          { status: 400 }
        )
      }

      // Fetch price with fallback
      const result = await fetchPriceWithFallback({
        cardId,
        cardName,
        gameType,
        setName,
        productType: productType || 'card',
      })

      return NextResponse.json({
        data: {
          card_id: result.card_id,
          market_price: result.market_price,
          low_price: result.low_price,
          source: result.source,
        },
        cached: false,
      })
    }
  } catch (error) {
    console.error('Price scraping error:', error)

    return NextResponse.json(
      {
        error: 'Price scraping failed for all sources',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    )
  }
}
