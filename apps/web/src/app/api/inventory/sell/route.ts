import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyApiAuth } from '@/lib/api-auth'
import type { Platform, ConsumedLot } from '@/lib/pnl/types'
import { calculateFeeEstimate } from '@/lib/pnl/calculations'

export const dynamic = 'force-dynamic'

interface SellInventoryRequest {
  inventory_id: string
  quantity: number
  sale_price: number
  platform: Platform
  shipping_cost?: number
  buyer_name?: string
  notes?: string
}

interface SellInventoryResponse {
  transaction_id: string
  cost_basis: number
  fees: number
  net_profit: number
  lot_breakdown: ConsumedLot[]
}

/**
 * POST /api/inventory/sell
 * Records a sale with FIFO lot consumption and auto-calculated fees
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await verifyApiAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse and validate request body
    const body: SellInventoryRequest = await request.json()

    if (!body.inventory_id) {
      return NextResponse.json(
        { error: 'inventory_id is required' },
        { status: 400 }
      )
    }

    if (!body.quantity || body.quantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be greater than 0' },
        { status: 400 }
      )
    }

    if (!body.sale_price || body.sale_price <= 0) {
      return NextResponse.json(
        { error: 'sale_price must be greater than 0' },
        { status: 400 }
      )
    }

    const validPlatforms: Platform[] = ['TCGPlayer', 'eBay', 'Direct', 'Other']
    if (!body.platform || !validPlatforms.includes(body.platform)) {
      return NextResponse.json(
        { error: 'platform must be one of: TCGPlayer, eBay, Direct, Other' },
        { status: 400 }
      )
    }

    // 3. Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: request.headers.get('Authorization') || '' } }
    })

    // 4. Get user's organization_id
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'User not in an organization' },
        { status: 403 }
      )
    }

    const organization_id = membership.organization_id

    // 5. Verify inventory item exists and has sufficient quantity
    const { data: inventoryItem, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', body.inventory_id)
      .eq('organization_id', organization_id)
      .single()

    if (inventoryError || !inventoryItem) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }

    if (inventoryItem.quantity < body.quantity) {
      return NextResponse.json(
        { error: `Insufficient inventory (available: ${inventoryItem.quantity}, requested: ${body.quantity})` },
        { status: 409 }
      )
    }

    // 6. Consume lots via FIFO
    const { data: consumedLots, error: fifoError } = await supabase.rpc('consume_lots_fifo', {
      p_inventory_id: body.inventory_id,
      p_quantity: body.quantity
    })

    if (fifoError) {
      return NextResponse.json(
        { error: `Failed to consume lots: ${fifoError.message}` },
        { status: 409 }
      )
    }

    if (!consumedLots || consumedLots.length === 0) {
      return NextResponse.json(
        { error: 'No lots available to consume' },
        { status: 409 }
      )
    }

    // 7. Calculate cost basis from consumed lots
    const costBasis = consumedLots.reduce((sum: number, lot: ConsumedLot) => {
      return sum + (lot.quantity_consumed * lot.unit_cost)
    }, 0)

    // 8. Calculate fees (will be auto-calculated by trigger, but estimate here)
    const feeEstimate = calculateFeeEstimate(body.sale_price, body.platform)

    // 9. Create SELL transaction (fee trigger will auto-calculate fees)
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        organization_id,
        user_id: user.id,
        type: 'SELL',
        counterparty_name: body.buyer_name || 'Unknown Buyer',
        platform: body.platform,
        cash_in: body.sale_price,
        cash_out: 0,
        fees: 0, // Will be auto-calculated by trigger
        shipping_cost: body.shipping_cost || 0,
        transaction_date: new Date().toISOString().split('T')[0],
        status: 'COMPLETED',
        notes: body.notes || null,
      })
      .select()
      .single()

    if (transactionError) {
      return NextResponse.json(
        { error: `Failed to create transaction: ${transactionError.message}` },
        { status: 500 }
      )
    }

    // 10. Create transaction_items for each consumed lot
    const transactionItems = consumedLots.map((lot: ConsumedLot) => ({
      transaction_id: transaction.id,
      direction: 'OUT' as const,
      card_id: inventoryItem.card_id,
      card_name: inventoryItem.card_name,
      card_image: inventoryItem.card_image,
      set_name: inventoryItem.set_name,
      game_type: inventoryItem.game_type,
      condition: inventoryItem.condition,
      inventory_id: body.inventory_id,
      quantity: lot.quantity_consumed,
      unit_value: lot.unit_cost,
      total_value: lot.quantity_consumed * lot.unit_cost,
      location: inventoryItem.location,
      notes: `Consumed from lot ${lot.lot_id}`,
    }))

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems)

    if (itemsError) {
      return NextResponse.json(
        { error: `Failed to create transaction items: ${itemsError.message}` },
        { status: 500 }
      )
    }

    // 11. Update inventory item
    const newQuantity = inventoryItem.quantity - body.quantity
    const newStatus = newQuantity === 0 ? 'SOLD' : inventoryItem.status

    const { error: updateError } = await supabase
      .from('inventory')
      .update({
        quantity: newQuantity,
        status: newStatus,
      })
      .eq('id', body.inventory_id)

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update inventory: ${updateError.message}` },
        { status: 500 }
      )
    }

    // 12. Calculate net profit
    const netProfit = body.sale_price - costBasis - feeEstimate.total_fees - (body.shipping_cost || 0)

    // 13. Return response
    const response: SellInventoryResponse = {
      transaction_id: transaction.id,
      cost_basis: Number(costBasis.toFixed(2)),
      fees: feeEstimate.total_fees,
      net_profit: Number(netProfit.toFixed(2)),
      lot_breakdown: consumedLots,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] /api/inventory/sell error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
