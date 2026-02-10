import { NextRequest, NextResponse } from 'next/server'
import { verifyApiAuth } from '@/lib/api-auth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/**
 * GET /api/prices/latest?cardIds=id1,id2,id3
 * Returns latest market prices for given card IDs from price_snapshots
 */
export async function GET(request: NextRequest) {
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cardIds = request.nextUrl.searchParams.get('cardIds')?.split(',').filter(Boolean)
  if (!cardIds?.length) {
    return NextResponse.json({ error: 'cardIds required' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from('latest_prices')
    .select('card_id, market_price')
    .in('card_id', cardIds)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return as map: { card_id: market_price }
  const priceMap: Record<string, number | null> = {}
  for (const row of data || []) {
    priceMap[row.card_id] = row.market_price
  }

  return NextResponse.json(priceMap)
}
