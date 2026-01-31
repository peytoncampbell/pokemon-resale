import type { GameType, Condition } from './filters'

// Time range presets for analytics queries
export type TimeRangePreset = '7d' | '30d' | '90d' | 'ytd' | 'all' | 'custom'

export interface TimeRange {
  preset: TimeRangePreset
  from?: Date
  to?: Date
}

// Set profitability analytics
export interface SetProfitability {
  setName: string
  game: GameType
  itemsSold: number
  itemsInStock: number
  totalCost: number
  totalRevenue: number
  totalFees: number
  netProfit: number
  roi: number // percentage
  avgDaysToSell: number | null
}

// Platform profitability analytics
export interface PlatformProfitability {
  platform: string
  transactionCount: number
  itemsSold: number
  totalRevenue: number
  totalFees: number
  netProfit: number
  avgSalePrice: number
  avgProfit: number
  feePercentage: number
}

// Inventory aging buckets
export type AgingBucket = 'fresh' | 'aging' | 'stale' | 'dead'

export interface InventoryAgingBucket {
  bucket: AgingBucket
  label: string
  daysRange: string
  itemCount: number
  totalValue: number
  percentage: number
  color: string
}

// Sell-through metrics
export interface SellThroughMetrics {
  currentRate: number
  previousRate: number
  trend: 'up' | 'down' | 'stable'
  avgDaysToSell: number
  velocity: number // items sold per day
  byCondition: Partial<Record<Condition, number>>
}

// Dashboard analytics summary
export interface AnalyticsSummary {
  setProfitability: SetProfitability[]
  platformProfitability: PlatformProfitability[]
  inventoryAging: InventoryAgingBucket[]
  sellThrough: SellThroughMetrics | null
}

// Aging bucket configuration
export const AGING_BUCKETS: Record<AgingBucket, { label: string; daysRange: string; maxDays: number; color: string }> = {
  fresh: {
    label: 'Fresh',
    daysRange: '0-30 days',
    maxDays: 30,
    color: 'bg-emerald-500',
  },
  aging: {
    label: 'Aging',
    daysRange: '31-90 days',
    maxDays: 90,
    color: 'bg-yellow-500',
  },
  stale: {
    label: 'Stale',
    daysRange: '91-180 days',
    maxDays: 180,
    color: 'bg-orange-500',
  },
  dead: {
    label: 'Dead Stock',
    daysRange: '180+ days',
    maxDays: Infinity,
    color: 'bg-red-500',
  },
}

// Time range helper options
export const TIME_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'all', label: 'All Time' },
] as const

// Platform options for filtering
export const PLATFORM_OPTIONS = [
  { value: 'TCGPlayer', label: 'TCGPlayer', color: 'bg-blue-500' },
  { value: 'eBay', label: 'eBay', color: 'bg-yellow-500' },
  { value: 'Facebook', label: 'Facebook', color: 'bg-indigo-500' },
  { value: 'Local', label: 'Local', color: 'bg-green-500' },
  { value: 'Other', label: 'Other', color: 'bg-gray-500' },
] as const
