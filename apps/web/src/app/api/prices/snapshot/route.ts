import { NextRequest, NextResponse } from 'next/server'
import { verifyApiAuth } from '@/lib/api-auth'
import { createClient } from '@supabase/supabase-js'

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Use the request's auth token if no service role key
    const authHeader = request.headers.get('Authorization')
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(supabaseUrl, supabaseKey)
      : createClient(supabaseUrl, supabaseKey, {
          global: { headers: authHeader ? { Authorization: authHeader } : {} }
        })

    const { error } = await supabase.from('price_snapshots').insert({
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

    if (error) {
      // Duplicate for same card/source/condition/day is OK
      if (error.code === '23505') {
        return NextResponse.json({ success: true, duplicate: true })
      }
      console.error('Price snapshot insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Price snapshot error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
