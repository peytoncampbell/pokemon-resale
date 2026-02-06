/**
 * Activity Feed Formatting
 *
 * Convert transactions and inventory events into a unified timeline feed.
 */

import { formatDistanceToNow } from 'date-fns'

export interface ActivityEvent {
  id: string
  type: 'buy' | 'sell' | 'price_up' | 'price_down'
  timestamp: Date
  description: string
  cardName: string | null
  amount: number | null // dollar amount involved
  isPositive: boolean // green for sells/gains, blue for buys
}

interface RecentInventoryItem {
  id: string
  card_name: string
  quantity: number
  acquisition_cost: number
  created_at: string
}

interface RecentTransaction {
  id: string
  type: 'BUY' | 'SELL' | 'TRADE'
  cash_in: number
  transaction_date: string
  platform: string | null
  transaction_items?: Array<{
    card_name: string
    quantity: number
  }>
}

/**
 * Format activity feed from recent inventory and transactions
 * Merges both sources into a unified timeline sorted by timestamp
 */
export function formatActivityFeed(params: {
  recentInventory: RecentInventoryItem[]
  recentTransactions: RecentTransaction[]
}): ActivityEvent[] {
  const { recentInventory, recentTransactions } = params
  const events: ActivityEvent[] = []

  // Convert recent inventory items to buy events
  recentInventory.forEach((item) => {
    const totalCost = item.acquisition_cost * item.quantity
    const description = `Bought ${item.quantity}x ${item.card_name} for $${totalCost.toFixed(2)}`

    events.push({
      id: `buy-${item.id}`,
      type: 'buy',
      timestamp: new Date(item.created_at),
      description,
      cardName: item.card_name,
      amount: totalCost,
      isPositive: false, // Buys are neutral/blue
    })
  })

  // Convert recent transactions to sell events
  recentTransactions.forEach((tx) => {
    if (tx.type === 'SELL') {
      const platform = tx.platform || 'Unknown'
      const amount = Number(tx.cash_in || 0)

      // Build description with card details if available
      let description = `Sold on ${platform} for $${amount.toFixed(2)}`

      if (tx.transaction_items && tx.transaction_items.length > 0) {
        const items = tx.transaction_items
        if (items.length === 1) {
          description = `Sold ${items[0].quantity}x ${items[0].card_name} on ${platform} for $${amount.toFixed(2)}`
        } else {
          description = `Sold ${items.length} items on ${platform} for $${amount.toFixed(2)}`
        }
      }

      events.push({
        id: `sell-${tx.id}`,
        type: 'sell',
        timestamp: new Date(tx.transaction_date),
        description,
        cardName: tx.transaction_items?.[0]?.card_name || null,
        amount,
        isPositive: true, // Sells are positive/green
      })
    }
  })

  // Sort by timestamp descending (newest first)
  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Limit to 20 most recent events
  return events.slice(0, 20)
}
