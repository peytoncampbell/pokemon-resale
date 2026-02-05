import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyApiAuth } from '@/lib/api-auth'
import type { PnLSummary, RealizedProfit, UnrealizedGain } from '@/lib/pnl/types'
import { calculateUnrealizedGain } from '@/lib/pnl/calculations'

export const dynamic = 'force-dynamic'

/**
 * GET /api/pnl
 * Query P&L data: realized profits, unrealized gains, or summary
 * Query params: type (realized | unrealized | summary), days (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await verifyApiAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'
    const daysParam = searchParams.get('days')
    const days = daysParam ? parseInt(daysParam, 10) : 30

    if (!['realized', 'unrealized', 'summary'].includes(type)) {
      return NextResponse.json(
        { error: 'type must be one of: realized, unrealized, summary' },
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

    // 5. Handle unrealized gains
    if (type === 'unrealized' || type === 'summary') {
      const { data: lots, error: lotsError } = await supabase
        .from('acquisition_lots')
        .select('*, inventory:inventory_id(*)')
        .eq('organization_id', organization_id)
        .gt('quantity_remaining', 0)

      if (lotsError) {
        return NextResponse.json(
          { error: `Failed to fetch lots: ${lotsError.message}` },
          { status: 500 }
        )
      }

      // Group lots by inventory_id
      const inventoryMap = new Map<string, {
        inventory: any
        lots: any[]
      }>()

      for (const lot of lots || []) {
        const invId = lot.inventory_id
        if (!inventoryMap.has(invId)) {
          inventoryMap.set(invId, {
            inventory: lot.inventory,
            lots: []
          })
        }
        inventoryMap.get(invId)!.lots.push(lot)
      }

      // Get latest prices for inventory items (from price_snapshots view if exists, or fallback)
      const inventoryIds = Array.from(inventoryMap.keys())
      const unrealizedGains: UnrealizedGain[] = []

      for (const [invId, { inventory, lots }] of inventoryMap.entries()) {
        if (!inventory) continue

        // Calculate cost basis from remaining lots
        const costBasis = lots.reduce((sum: number, lot: any) => {
          return sum + (lot.quantity_remaining * lot.unit_cost)
        }, 0)

        const quantity = lots.reduce((sum: number, lot: any) => sum + lot.quantity_remaining, 0)

        // Try to get latest market price (from price_snapshots or other source)
        // For now, we'll fetch from a hypothetical latest_prices view or skip
        let marketPrice: number | null = null

        // TODO: Implement price lookup from price_snapshots table
        // For MVP, return null for market price (will be added in UI integration)

        const gains = calculateUnrealizedGain(costBasis, marketPrice, quantity)

        // Find oldest acquisition date
        const oldestDate = lots.reduce((oldest: string | null, lot: any) => {
          if (!oldest) return lot.acquisition_date
          return lot.acquisition_date < oldest ? lot.acquisition_date : oldest
        }, null)

        unrealizedGains.push({
          inventory_id: invId,
          card_name: inventory.card_name,
          card_image: inventory.card_image,
          set_name: inventory.set_name,
          condition: inventory.condition,
          quantity,
          cost_basis: Number(costBasis.toFixed(2)),
          current_market_price: marketPrice,
          current_market_value: gains.current_market_value,
          unrealized_gain: gains.unrealized_gain,
          gain_percentage: gains.gain_percentage,
          oldest_acquisition_date: oldestDate,
        })
      }

      if (type === 'unrealized') {
        return NextResponse.json(unrealizedGains, { status: 200 })
      }
    }

    // 6. Handle realized profits
    if (type === 'realized' || type === 'summary') {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0]

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, transaction_items(*)')
        .eq('organization_id', organization_id)
        .eq('type', 'SELL')
        .eq('status', 'COMPLETED')
        .gte('transaction_date', cutoffDateStr)

      if (transactionsError) {
        return NextResponse.json(
          { error: `Failed to fetch transactions: ${transactionsError.message}` },
          { status: 500 }
        )
      }

      // Calculate realized profit
      let totalSales = 0
      let totalCostBasis = 0
      let totalFees = 0
      let totalShipping = 0
      let itemsSold = 0

      for (const tx of transactions || []) {
        totalSales += Number(tx.cash_in) || 0
        totalFees += Number(tx.fees) || 0
        totalShipping += Number(tx.shipping_cost) || 0

        // Calculate cost basis from transaction_items
        const items = (tx as any).transaction_items || []
        for (const item of items) {
          if (item.direction === 'OUT') {
            totalCostBasis += Number(item.total_value) || 0
            itemsSold += item.quantity || 0
          }
        }
      }

      const grossProfit = totalSales - totalCostBasis
      const netProfit = grossProfit - totalFees - totalShipping
      const averageRoi = totalCostBasis > 0 ? (netProfit / totalCostBasis) * 100 : 0

      const realizedProfit: RealizedProfit = {
        total_sales: Number(totalSales.toFixed(2)),
        total_cost_basis: Number(totalCostBasis.toFixed(2)),
        total_fees: Number(totalFees.toFixed(2)),
        total_shipping: Number(totalShipping.toFixed(2)),
        gross_profit: Number(grossProfit.toFixed(2)),
        net_profit: Number(netProfit.toFixed(2)),
        items_sold: itemsSold,
        average_roi: Number(averageRoi.toFixed(2)),
      }

      if (type === 'realized') {
        return NextResponse.json(realizedProfit, { status: 200 })
      }
    }

    // 7. Handle summary (combine both)
    if (type === 'summary') {
      // Recalculate both for summary
      const unrealizedGainsData = await getUnrealizedGains(supabase, organization_id)
      const realizedProfitData = await getRealizedProfit(supabase, organization_id, days)

      const totalUnrealizedGain = unrealizedGainsData.reduce(
        (sum, gain) => sum + (gain.unrealized_gain || 0),
        0
      )

      const totalInvested = unrealizedGainsData.reduce(
        (sum, gain) => sum + gain.cost_basis,
        0
      ) + realizedProfitData.total_cost_basis

      const totalRevenue = realizedProfitData.total_sales
      const totalFees = realizedProfitData.total_fees
      const totalShipping = realizedProfitData.total_shipping
      const netProfit = realizedProfitData.net_profit
      const roiPercentage = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0

      const summary: PnLSummary = {
        realized_profit: realizedProfitData,
        unrealized_gains: unrealizedGainsData,
        total_invested: Number(totalInvested.toFixed(2)),
        total_revenue: Number(totalRevenue.toFixed(2)),
        total_fees: Number(totalFees.toFixed(2)),
        total_shipping_costs: Number(totalShipping.toFixed(2)),
        net_profit: Number(netProfit.toFixed(2)),
        roi_percentage: Number(roiPercentage.toFixed(2)),
      }

      return NextResponse.json(summary, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })

  } catch (error) {
    console.error('[API] /api/pnl error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Helper functions
async function getUnrealizedGains(supabase: any, organization_id: string): Promise<UnrealizedGain[]> {
  const { data: lots } = await supabase
    .from('acquisition_lots')
    .select('*, inventory:inventory_id(*)')
    .eq('organization_id', organization_id)
    .gt('quantity_remaining', 0)

  const inventoryMap = new Map<string, { inventory: any; lots: any[] }>()

  for (const lot of lots || []) {
    const invId = lot.inventory_id
    if (!inventoryMap.has(invId)) {
      inventoryMap.set(invId, { inventory: lot.inventory, lots: [] })
    }
    inventoryMap.get(invId)!.lots.push(lot)
  }

  const unrealizedGains: UnrealizedGain[] = []

  for (const [invId, { inventory, lots }] of inventoryMap.entries()) {
    if (!inventory) continue

    const costBasis = lots.reduce((sum: number, lot: any) => sum + (lot.quantity_remaining * lot.unit_cost), 0)
    const quantity = lots.reduce((sum: number, lot: any) => sum + lot.quantity_remaining, 0)
    let marketPrice: number | null = null

    const gains = calculateUnrealizedGain(costBasis, marketPrice, quantity)

    const oldestDate = lots.reduce((oldest: string | null, lot: any) => {
      if (!oldest) return lot.acquisition_date
      return lot.acquisition_date < oldest ? lot.acquisition_date : oldest
    }, null)

    unrealizedGains.push({
      inventory_id: invId,
      card_name: inventory.card_name,
      card_image: inventory.card_image,
      set_name: inventory.set_name,
      condition: inventory.condition,
      quantity,
      cost_basis: Number(costBasis.toFixed(2)),
      current_market_price: marketPrice,
      current_market_value: gains.current_market_value,
      unrealized_gain: gains.unrealized_gain,
      gain_percentage: gains.gain_percentage,
      oldest_acquisition_date: oldestDate,
    })
  }

  return unrealizedGains
}

async function getRealizedProfit(supabase: any, organization_id: string, days: number): Promise<RealizedProfit> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  const cutoffDateStr = cutoffDate.toISOString().split('T')[0]

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, transaction_items(*)')
    .eq('organization_id', organization_id)
    .eq('type', 'SELL')
    .eq('status', 'COMPLETED')
    .gte('transaction_date', cutoffDateStr)

  let totalSales = 0
  let totalCostBasis = 0
  let totalFees = 0
  let totalShipping = 0
  let itemsSold = 0

  for (const tx of transactions || []) {
    totalSales += Number(tx.cash_in) || 0
    totalFees += Number(tx.fees) || 0
    totalShipping += Number(tx.shipping_cost) || 0

    const items = (tx as any).transaction_items || []
    for (const item of items) {
      if (item.direction === 'OUT') {
        totalCostBasis += Number(item.total_value) || 0
        itemsSold += item.quantity || 0
      }
    }
  }

  const grossProfit = totalSales - totalCostBasis
  const netProfit = grossProfit - totalFees - totalShipping
  const averageRoi = totalCostBasis > 0 ? (netProfit / totalCostBasis) * 100 : 0

  return {
    total_sales: Number(totalSales.toFixed(2)),
    total_cost_basis: Number(totalCostBasis.toFixed(2)),
    total_fees: Number(totalFees.toFixed(2)),
    total_shipping: Number(totalShipping.toFixed(2)),
    gross_profit: Number(grossProfit.toFixed(2)),
    net_profit: Number(netProfit.toFixed(2)),
    items_sold: itemsSold,
    average_roi: Number(averageRoi.toFixed(2)),
  }
}
