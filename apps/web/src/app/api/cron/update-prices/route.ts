import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 300 // 5 minutes max
export const dynamic = 'force-dynamic'

interface JustTCGCard {
  id: string
  price?: number
  lastUpdated?: number
}

interface JustTCGResponse {
  data: JustTCGCard[]
  error: string | null
}

/**
 * Background price update endpoint
 * Fetches stale inventory items (price_updated_at older than 24h)
 * Batch queries JustTCG API to refresh prices (max 10/min for free tier)
 * Updates the inventory table with new prices
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Optional: Add basic authentication for manual triggers
    // For cron jobs, you can use a secret token
    const authHeader = request.headers.get('Authorization')
    const cronSecret = process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY

    // Allow either service role key or cron secret
    if (authHeader && cronSecret) {
      const token = authHeader.replace('Bearer ', '')
      if (token !== cronSecret) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch stale inventory items (price_updated_at older than 24h or null)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: staleItems, error: fetchError } = await supabase
      .from('inventory')
      .select('id, card_id, card_name, game_type, product_type, market_price, price_updated_at')
      .or(`price_updated_at.is.null,price_updated_at.lt.${twentyFourHoursAgo}`)
      .eq('status', 'IN_STOCK') // Only update items still in stock
      .limit(50) // Limit to stay under rate limits

    if (fetchError) {
      throw new Error(`Failed to fetch stale items: ${fetchError.message}`)
    }

    if (!staleItems || staleItems.length === 0) {
      console.log('[CRON] No stale inventory items found')
      return NextResponse.json({
        success: true,
        updated: 0,
        failed: 0,
        message: 'No stale items to update',
        duration: `${Date.now() - startTime}ms`,
      })
    }

    console.log(`[CRON] Found ${staleItems.length} stale inventory items`)

    // Batch update prices (respect rate limit: max 10/min for free tier)
    const batchSize = 10
    const delayBetweenBatches = 60000 // 1 minute
    let updated = 0
    let failed = 0
    const justTCGKey = process.env.JUSTTCG_API_KEY

    if (!justTCGKey) {
      throw new Error('JustTCG API key not configured')
    }

    // Process items in batches
    for (let i = 0; i < staleItems.length; i += batchSize) {
      const batch = staleItems.slice(i, i + batchSize)
      const batchStartTime = Date.now()

      console.log(`[CRON] Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(staleItems.length / batchSize)}`)

      // Query JustTCG API for each card in the batch
      const updatePromises = batch.map(async (item) => {
        try {
          const response = await fetch(
            `https://api.justtcg.com/v1/cards?cardId=${encodeURIComponent(item.card_id)}&game=${item.game_type}`,
            {
              headers: {
                'x-api-key': justTCGKey,
              },
            }
          )

          if (!response.ok) {
            if (response.status === 429) {
              console.warn(`[CRON] Rate limit hit for ${item.card_name}`)
              throw new Error('Rate limit exceeded')
            }
            throw new Error(`API error: ${response.status}`)
          }

          const data = await response.json() as JustTCGResponse

          if (data.error || !data.data || data.data.length === 0) {
            console.warn(`[CRON] No price data for ${item.card_name}`)
            return { success: false, itemId: item.id }
          }

          const card = data.data[0]
          const newPrice = card.price

          if (newPrice == null) {
            console.warn(`[CRON] No price available for ${item.card_name}`)
            return { success: false, itemId: item.id }
          }

          // Update inventory item with new price
          const { error: updateError } = await supabase
            .from('inventory')
            .update({
              market_price: newPrice,
              price_updated_at: new Date().toISOString(),
            })
            .eq('id', item.id)

          if (updateError) {
            console.error(`[CRON] Failed to update ${item.card_name}:`, updateError)
            return { success: false, itemId: item.id }
          }

          console.log(`[CRON] Updated ${item.card_name}: ${item.market_price ?? 'null'} → ${newPrice}`)
          return { success: true, itemId: item.id }
        } catch (error) {
          console.error(`[CRON] Error updating ${item.card_name}:`, error)
          return { success: false, itemId: item.id }
        }
      })

      const results = await Promise.all(updatePromises)
      updated += results.filter((r) => r.success).length
      failed += results.filter((r) => !r.success).length

      // Wait before processing next batch (if there is one)
      if (i + batchSize < staleItems.length) {
        const elapsed = Date.now() - batchStartTime
        const remainingDelay = delayBetweenBatches - elapsed

        if (remainingDelay > 0) {
          console.log(`[CRON] Waiting ${remainingDelay}ms before next batch...`)
          await new Promise((resolve) => setTimeout(resolve, remainingDelay))
        }
      }
    }

    const duration = Date.now() - startTime
    console.log(`[CRON] Price update completed: ${updated} updated, ${failed} failed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      updated,
      failed,
      total: staleItems.length,
      duration: `${duration}ms`,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[CRON] Price update error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Price update failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`,
      },
      { status: 500 }
    )
  }
}

// Allow GET for manual triggers via browser/curl
export async function GET(request: NextRequest) {
  return POST(request)
}
