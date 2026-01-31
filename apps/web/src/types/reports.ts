import type { GameType, Condition, ProductType } from './filters'

// Report type definitions
export type ReportType =
  | 'profit_loss'
  | 'inventory_valuation'
  | 'sales_by_platform'
  | 'sales_by_set'
  | 'inventory_aging'
  | 'tax_summary'
  | 'custom'

// Date range presets
export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'ytd' | 'all' | 'custom'

// Report configuration
export interface ReportConfig {
  type: ReportType
  name: string
  dateRange: {
    preset: DateRangePreset
    from?: string
    to?: string
  }
  filters: {
    gameType?: GameType | 'all'
    productType?: ProductType | 'all'
    platform?: string | 'all'
    condition?: Condition | 'all'
  }
  columns?: string[] // for custom reports
  groupBy?: string[] // for custom reports
  sortBy?: { field: string; direction: 'asc' | 'desc' }
}

// Saved report entity
export interface SavedReport {
  id: string
  organizationId: string
  userId: string
  name: string
  reportType: ReportType
  config: ReportConfig
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    dayOfWeek?: number // 0-6 for weekly
    dayOfMonth?: number // 1-31 for monthly
    email?: string
  } | null
  lastRunAt?: string | null
  createdAt: string
  updatedAt: string
}

// Column definition for report tables
export interface ReportColumn {
  key: string
  label: string
  type: 'string' | 'number' | 'currency' | 'percent' | 'date'
  align?: 'left' | 'center' | 'right'
}

// Generated report data
export interface ReportData {
  title: string
  subtitle?: string
  generatedAt: string
  dateRange: { from: string; to: string }
  summary: Record<string, number | string>
  columns: ReportColumn[]
  rows: Record<string, unknown>[]
  totals?: Record<string, number>
}

// Report template definitions
export const REPORT_TEMPLATES: Record<
  ReportType,
  { name: string; description: string; icon: string }
> = {
  profit_loss: {
    name: 'Profit & Loss',
    description: 'Revenue, costs, and profit breakdown by period',
    icon: 'TrendingUp',
  },
  inventory_valuation: {
    name: 'Inventory Valuation',
    description: 'Current inventory value by set and condition',
    icon: 'Package',
  },
  sales_by_platform: {
    name: 'Sales by Platform',
    description: 'Performance comparison across selling platforms',
    icon: 'Store',
  },
  sales_by_set: {
    name: 'Sales by Set',
    description: 'Which sets are selling best and their margins',
    icon: 'Layers',
  },
  inventory_aging: {
    name: 'Inventory Aging',
    description: 'How long items have been in stock',
    icon: 'Clock',
  },
  tax_summary: {
    name: 'Tax Summary',
    description: 'Annual summary for tax filing (Schedule D format)',
    icon: 'FileText',
  },
  custom: {
    name: 'Custom Report',
    description: 'Build your own report with custom columns and filters',
    icon: 'Settings',
  },
}

// Input for creating a saved report
export interface CreateSavedReportInput {
  name: string
  reportType: ReportType
  config: ReportConfig
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly' | null
  scheduleDayOfWeek?: number | null
  scheduleDayOfMonth?: number | null
  scheduleEmail?: string | null
}

// Input for updating a saved report
export interface UpdateSavedReportInput {
  id: string
  name?: string
  config?: ReportConfig
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly' | null
  scheduleDayOfWeek?: number | null
  scheduleDayOfMonth?: number | null
  scheduleEmail?: string | null
}

// Date range presets for reports
export const DATE_RANGE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' },
]
