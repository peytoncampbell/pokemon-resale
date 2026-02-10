import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchBatchPrices } from '@/lib/scrapers/price-fetcher'
import { getStaleCards } from '@/lib/price/staleness'

async function runAlertCheck() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return []

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase.rpc('check_price_alerts')
  if (error) {
    console.warn('[CRON] Alert check failed:', error.message)
    return []
  }
  return data || []
}

export const maxDuration = 60 // Pro tier max
export const dynamic = 'force-dynamic'

/**
 * Daily cron endpoint for automatic price updates
 * Called by pg_cron via pg_net at 2 AM UTC
 * Authenticates via service role key (not user auth)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // Authenticate via service role key
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token || token !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[CRON] Authentication failed - invalid or missing service role key')
    return NextResponse.json(
      { error: 'Unauthorized - invalid service role key' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    // Log if this is a cron-triggered call
    if (body.source === 'cron') {
      console.log('[CRON] Daily price update triggered by pg_cron')
    }

    // Get stale cards that need price updates
    console.log('[CRON] Fetching stale cards...')
    const staleCards = await getStaleCards(20) // Limit 20 to stay under 60s timeout

    if (staleCards.length === 0) {
      // No stale cards - check for any cards from inventory that need initial prices
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: inventoryCards, error: inventoryError } = await supabase
        .from('inventory')
        .select('card_id, card_name, game_type, set_name')
        .limit(20)

      if (inventoryError) {
        throw new Error(`Failed to fetch inventory: ${inventoryError.message}`)
      }

      if (!inventoryCards || inventoryCards.length === 0) {
        const duration = Date.now() - startTime
        console.log('[CRON] No cards to update')
        return NextResponse.json({
          updated: 0,
          failed: 0,
          skipped: 0,
          nextRun: 'tomorrow 2AM UTC',
          duration: `${duration}ms`,
        })
      }

      // Use inventory cards
      const cardsToUpdate = inventoryCards.map((card) => ({
        cardId: card.card_id,
        cardName: card.card_name,
        gameType: card.game_type,
        setName: card.set_name,
      }))

      console.log(`[CRON] Processing ${cardsToUpdate.length} inventory cards (no stale cards found)`)

      const result = await fetchBatchPrices(cardsToUpdate, {
        batchSize: 5,
        delayBetweenMs: 2000,
      })

      // Check price alerts after updating prices
      const triggeredAlerts = await runAlertCheck()
      if (triggeredAlerts.length > 0) {
        console.log(`[CRON] ${triggeredAlerts.length} price alerts triggered`)
      }

      const duration = Date.now() - startTime
      console.log('[CRON] Daily price update completed:', {
        updated: result.succeeded,
        failed: result.failed,
        duration: `${duration}ms`,
      })

      return NextResponse.json({
        updated: result.succeeded,
        failed: result.failed,
        skipped: 0,
        alertsTriggered: triggeredAlerts.length,
        nextRun: 'tomorrow 2AM UTC',
        duration: `${duration}ms`,
      })
    }

    // Process stale cards
    const cardsToUpdate = staleCards.map((card) => ({
      cardId: card.card_id,
      cardName: card.card_name,
      gameType: card.game_type,
    }))

    console.log(`[CRON] Processing ${cardsToUpdate.length} stale cards`)

    const result = await fetchBatchPrices(cardsToUpdate, {
      batchSize: 5,
      delayBetweenMs: 2000,
    })

    // Check price alerts after updating prices
    const triggeredAlerts = await runAlertCheck()
    if (triggeredAlerts.length > 0) {
      console.log(`[CRON] ${triggeredAlerts.length} price alerts triggered`)
    }

    const duration = Date.now() - startTime

    console.log('[CRON] Daily price update completed:', {
      updated: result.succeeded,
      failed: result.failed,
      duration: `${duration}ms`,
    })

    return NextResponse.json({
      updated: result.succeeded,
      failed: result.failed,
      skipped: 0,
      alertsTriggered: triggeredAlerts.length,
      nextRun: 'tomorrow 2AM UTC',
      duration: `${duration}ms`,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[CRON] Daily price update error:', error)

    return NextResponse.json(
      {
        error: 'Daily price update failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`,
      },
      { status: 500 }
    )
  }
}
