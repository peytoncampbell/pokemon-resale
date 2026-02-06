/**
 * Deal Scoring Utilities
 *
 * ROI-based ranking for unrealized gains to identify top and worst performing deals.
 */

import type { UnrealizedGain } from '@/lib/pnl/types'

export interface DealScore {
  cardName: string
  cardImage: string | null
  setName: string | null
  condition: string
  quantity: number
  costBasis: number
  marketValue: number | null
  unrealizedGain: number | null
  roi: number | null // percentage
}

/**
 * Rank deals by ROI percentage
 * Filters out items without market prices and returns top/worst performers
 */
export function rankDealsByROI(items: UnrealizedGain[]): {
  topPerformers: DealScore[]
  worstPerformers: DealScore[]
} {
  // Filter out items without market price data (cannot score)
  const scorableItems = items.filter((item) => item.current_market_price !== null)

  // Map to DealScore objects with ROI calculation
  const dealScores: DealScore[] = scorableItems.map((item) => {
    // Handle zero cost basis to avoid Infinity
    const roi =
      item.cost_basis > 0 && item.unrealized_gain !== null
        ? (item.unrealized_gain / item.cost_basis) * 100
        : null

    return {
      cardName: item.card_name,
      cardImage: item.card_image ?? null,
      setName: item.set_name ?? null,
      condition: item.condition,
      quantity: item.quantity,
      costBasis: item.cost_basis,
      marketValue: item.current_market_value,
      unrealizedGain: item.unrealized_gain,
      roi,
    }
  })

  // Sort by ROI descending (highest first)
  const sortedByROI = [...dealScores].sort((a, b) => {
    // Handle null ROIs - treat as worst performance
    if (a.roi === null) return 1
    if (b.roi === null) return -1
    return b.roi - a.roi
  })

  // Top 5 performers (highest ROI)
  const topPerformers = sortedByROI.slice(0, 5)

  // Bottom 5 performers (lowest ROI), reversed to show worst first
  const worstPerformers = sortedByROI.slice(-5).reverse()

  return {
    topPerformers,
    worstPerformers,
  }
}
