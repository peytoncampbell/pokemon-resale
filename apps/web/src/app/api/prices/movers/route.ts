import { NextRequest, NextResponse } from 'next/server'
import { verifyApiAuth } from '@/lib/api-auth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ gainers: [], losers: [] })
  }

  const authHeader = request.headers.get('Authorization')
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(supabaseUrl, supabaseKey)
    : createClient(supabaseUrl, supabaseKey, {
        global: { headers: authHeader ? { Authorization: authHeader } : {} }
      })

  const { data, error } = await supabase
    .from('price_snapshots')
    .select('card_id, card_name, market_price, recorded_at')
    .order('recorded_at', { ascending: false })
    .limit(500)

  if (error || !data || data.length === 0) {
    return NextResponse.json({ gainers: [], losers: [] })
  }

  // Group by card_id, get latest and previous
  const byCard = new Map<string, { cardName: string; prices: number[] }>()
  for (const row of data) {
    if (!row.market_price) continue
    const existing = byCard.get(row.card_id)
    if (existing) {
      if (existing.prices.length < 2) existing.prices.push(row.market_price)
    } else {
      byCard.set(row.card_id, { cardName: row.card_name || row.card_id, prices: [row.market_price] })
    }
  }

  const movers: { cardName: string; priceChange: number; percentChange: number }[] = []
  for (const [, entry] of byCard) {
    if (entry.prices.length < 2 || entry.prices[1] === 0) continue
    const change = entry.prices[0] - entry.prices[1]
    movers.push({ cardName: entry.cardName, priceChange: change, percentChange: (change / entry.prices[1]) * 100 })
  }

  movers.sort((a, b) => b.percentChange - a.percentChange)

  return NextResponse.json({
    gainers: movers.filter(m => m.priceChange > 0).slice(0, 5),
    losers: movers.filter(m => m.priceChange < 0).slice(-5).reverse(),
  })
}
