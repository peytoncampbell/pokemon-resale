import type { Condition, GameType } from './filters'

// Price history data point from JustTCG API
export interface PriceHistoryPoint {
  date: string
  price: number
  volume?: number
}

// Price comparison data across conditions
export interface PriceComparison {
  condition: Condition
  marketPrice: number | null
  lowPrice: number | null
  avgPrice: number | null
  priceChange7d: number | null
  priceChange30d: number | null
}

// Price alert configuration
export type AlertType = 'above' | 'below' | 'change_percent'

export interface PriceAlert {
  id: string
  organizationId: string
  userId: string
  cardId: string
  cardName: string
  cardImage?: string | null
  setName?: string | null
  condition: Condition
  gameType: GameType
  alertType: AlertType
  targetPrice?: number | null
  thresholdPercent?: number | null
  isActive: boolean
  isTriggered: boolean
  triggeredAt?: string | null
  triggeredPrice?: number | null
  notifyInApp: boolean
  notifyEmail: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePriceAlertInput {
  cardId: string
  cardName: string
  cardImage?: string | null
  setName?: string | null
  condition?: Condition
  gameType?: GameType
  alertType: AlertType
  targetPrice?: number | null
  thresholdPercent?: number | null
  notifyInApp?: boolean
  notifyEmail?: boolean
}

export interface UpdatePriceAlertInput {
  id: string
  isActive?: boolean
  targetPrice?: number | null
  thresholdPercent?: number | null
  notifyInApp?: boolean
  notifyEmail?: boolean
}

// Arbitrage opportunity detection
export interface ArbitrageOpportunity {
  inventoryId: string
  cardId: string
  cardName: string
  cardImage?: string | null
  setName?: string | null
  condition: Condition
  acquisitionCost: number
  currentMarketPrice: number
  potentialProfit: number
  profitMargin: number // percentage
  daysHeld: number
  recommendation: 'sell_now' | 'hold' | 'watch'
}

// In-app notification
export type NotificationType = 'price_alert' | 'system' | 'report' | 'inventory'

export interface Notification {
  id: string
  userId: string
  organizationId: string
  type: NotificationType
  title: string
  message: string
  link?: string | null
  isRead: boolean
  readAt?: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export interface CreateNotificationInput {
  type: NotificationType
  title: string
  message: string
  link?: string | null
  metadata?: Record<string, unknown>
}

// Price history API response
export interface PriceHistoryData {
  currentPrice: number | null
  priceChange7d: number | null
  priceChange30d: number | null
  avgPrice: number | null
  minPrice: number | null
  maxPrice: number | null
  history: PriceHistoryPoint[]
}

// Alert type display config
export const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; description: string }> = {
  above: {
    label: 'Price goes above',
    description: 'Notify when the market price rises above your target',
  },
  below: {
    label: 'Price drops below',
    description: 'Notify when the market price falls below your target',
  },
  change_percent: {
    label: 'Price changes by',
    description: 'Notify when the price changes by a percentage (up or down)',
  },
}

// Condition to JustTCG API condition mapping
export const CONDITION_API_MAP: Record<Condition, string> = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged',
}
