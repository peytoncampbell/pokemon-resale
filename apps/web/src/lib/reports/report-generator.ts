import { supabase, InventoryItem, Transaction, TransactionItem } from '@/lib/supabase'
import type {
  ReportConfig,
  ReportData,
} from '@/types/reports'

// Transaction with items type
interface TransactionWithItems extends Transaction {
  transaction_items: TransactionItem[]
}

// Helper to resolve date range
export function resolveDateRange(config: ReportConfig['dateRange']): { from: Date; to: Date } {
  const now = new Date()
  const to = config.to ? new Date(config.to) : new Date(now)
  let from: Date

  switch (config.preset) {
    case 'today':
      from = new Date(now)
      from.setHours(0, 0, 0, 0)
      break
    case '7d':
      from = new Date(now)
      from.setDate(from.getDate() - 7)
      break
    case '30d':
      from = new Date(now)
      from.setDate(from.getDate() - 30)
      break
    case '90d':
      from = new Date(now)
      from.setDate(from.getDate() - 90)
      break
    case 'ytd':
      from = new Date(now.getFullYear(), 0, 1)
      break
    case 'all':
      from = new Date(2000, 0, 1)
      break
    case 'custom':
      from = config.from ? new Date(config.from) : new Date(2000, 0, 1)
      break
    default:
      from = new Date(now)
      from.setDate(from.getDate() - 30)
  }

  return { from, to }
}

// Fetch report data from database
async function fetchReportData(orgId: string) {
  const [inventoryResult, transactionsResult] = await Promise.all([
    supabase.from('inventory').select('*').eq('organization_id', orgId),
    supabase
      .from('transactions')
      .select('*, transaction_items(*)')
      .eq('organization_id', orgId)
      .eq('status', 'COMPLETED'),
  ])

  if (inventoryResult.error) throw inventoryResult.error
  if (transactionsResult.error) throw transactionsResult.error

  return {
    inventory: inventoryResult.data as InventoryItem[],
    transactions: transactionsResult.data as unknown as TransactionWithItems[],
  }
}

// Main report generator
export async function generateReport(
  config: ReportConfig,
  organizationId: string
): Promise<ReportData> {
  const { inventory, transactions } = await fetchReportData(organizationId)
  const dateRange = resolveDateRange(config.dateRange)

  switch (config.type) {
    case 'profit_loss':
      return generateProfitLossReport(inventory, transactions, dateRange, config)
    case 'inventory_valuation':
      return generateInventoryValuationReport(inventory, config)
    case 'sales_by_platform':
      return generateSalesByPlatformReport(inventory, transactions, dateRange, config)
    case 'sales_by_set':
      return generateSalesBySetReport(inventory, transactions, dateRange, config)
    case 'inventory_aging':
      return generateInventoryAgingReport(inventory, config)
    case 'tax_summary':
      return generateTaxSummaryReport(inventory, transactions, dateRange, config)
    default:
      throw new Error(`Unknown report type: ${config.type}`)
  }
}

// Profit & Loss Report
function generateProfitLossReport(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: ReportConfig
): ReportData {
  // Filter transactions by date range
  const filteredTx = transactions.filter((t) => {
    const txDate = new Date(t.transaction_date)
    return txDate >= dateRange.from && txDate <= dateRange.to
  })

  // Group by month
  const monthlyData: Record<string, { revenue: number; cost: number; fees: number; shipping: number }> = {}

  // Get inventory cost map
  const inventoryCostMap = new Map<string, number>()
  inventory.forEach((item) => inventoryCostMap.set(item.id, item.acquisition_cost))

  filteredTx.forEach((t) => {
    const month = new Date(t.transaction_date).toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { revenue: 0, cost: 0, fees: 0, shipping: 0 }
    }

    if (t.type === 'SELL') {
      monthlyData[month].revenue += Number(t.cash_in || 0)
      monthlyData[month].fees += Number(t.fees || 0)
      monthlyData[month].shipping += Number(t.shipping_cost || 0)

      // Calculate cost of sold items
      t.transaction_items
        .filter((i) => i.direction === 'OUT' && i.inventory_id)
        .forEach((item) => {
          const cost = inventoryCostMap.get(item.inventory_id!) || 0
          monthlyData[month].cost += cost
        })
    }
  })

  // Build rows
  const rows = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, data]) => {
      const profit = data.revenue - data.cost - data.fees - data.shipping
      const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0
      return {
        period: formatMonth(period),
        revenue: data.revenue,
        cost: data.cost,
        fees: data.fees,
        shipping: data.shipping,
        profit,
        margin,
      }
    })

  // Calculate totals
  const totals = rows.reduce(
    (acc, row) => ({
      revenue: acc.revenue + (row.revenue as number),
      cost: acc.cost + (row.cost as number),
      fees: acc.fees + (row.fees as number),
      shipping: acc.shipping + (row.shipping as number),
      profit: acc.profit + (row.profit as number),
    }),
    { revenue: 0, cost: 0, fees: 0, shipping: 0, profit: 0 }
  )

  const totalMargin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0

  return {
    title: 'Profit & Loss Statement',
    subtitle: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
    generatedAt: new Date().toISOString(),
    dateRange: {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    },
    summary: {
      'Total Revenue': totals.revenue,
      'Total COGS': totals.cost,
      'Total Fees': totals.fees,
      'Total Shipping': totals.shipping,
      'Net Profit': totals.profit,
      'Profit Margin': `${totalMargin.toFixed(1)}%`,
    },
    columns: [
      { key: 'period', label: 'Period', type: 'string' },
      { key: 'revenue', label: 'Revenue', type: 'currency', align: 'right' },
      { key: 'cost', label: 'COGS', type: 'currency', align: 'right' },
      { key: 'fees', label: 'Fees', type: 'currency', align: 'right' },
      { key: 'shipping', label: 'Shipping', type: 'currency', align: 'right' },
      { key: 'profit', label: 'Profit', type: 'currency', align: 'right' },
      { key: 'margin', label: 'Margin', type: 'percent', align: 'right' },
    ],
    rows,
    totals,
  }
}

// Inventory Valuation Report
function generateInventoryValuationReport(
  inventory: InventoryItem[],
  config: ReportConfig
): ReportData {
  // Filter to active inventory only
  const activeInventory = inventory.filter((i) => i.status !== 'SOLD')

  // Apply filters
  let filtered = activeInventory
  if (config.filters.gameType && config.filters.gameType !== 'all') {
    filtered = filtered.filter((i) => i.game_type === config.filters.gameType)
  }
  if (config.filters.condition && config.filters.condition !== 'all') {
    filtered = filtered.filter((i) => i.condition === config.filters.condition)
  }

  // Group by set
  const bySet: Record<string, { items: number; value: number; conditions: Record<string, number> }> = {}

  filtered.forEach((item) => {
    const setName = item.set_name || 'Unknown Set'
    if (!bySet[setName]) {
      bySet[setName] = { items: 0, value: 0, conditions: {} }
    }
    bySet[setName].items += item.quantity
    bySet[setName].value += item.acquisition_cost * item.quantity
    bySet[setName].conditions[item.condition] =
      (bySet[setName].conditions[item.condition] || 0) + item.quantity
  })

  const rows = Object.entries(bySet)
    .map(([setName, data]) => ({
      set: setName,
      items: data.items,
      value: data.value,
      avgValue: data.items > 0 ? data.value / data.items : 0,
      NM: data.conditions['NM'] || 0,
      LP: data.conditions['LP'] || 0,
      MP: data.conditions['MP'] || 0,
      HP: data.conditions['HP'] || 0,
      DMG: data.conditions['DMG'] || 0,
    }))
    .sort((a, b) => b.value - a.value)

  const totals = {
    items: rows.reduce((sum, r) => sum + (r.items as number), 0),
    value: rows.reduce((sum, r) => sum + (r.value as number), 0),
  }

  return {
    title: 'Inventory Valuation Report',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    summary: {
      'Total Items': totals.items,
      'Total Value': totals.value,
      'Unique Sets': rows.length,
      'Avg Value/Item': totals.items > 0 ? totals.value / totals.items : 0,
    },
    columns: [
      { key: 'set', label: 'Set', type: 'string' },
      { key: 'items', label: 'Items', type: 'number', align: 'right' },
      { key: 'value', label: 'Value', type: 'currency', align: 'right' },
      { key: 'avgValue', label: 'Avg Value', type: 'currency', align: 'right' },
      { key: 'NM', label: 'NM', type: 'number', align: 'right' },
      { key: 'LP', label: 'LP', type: 'number', align: 'right' },
    ],
    rows,
    totals,
  }
}

// Sales by Platform Report
function generateSalesByPlatformReport(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: ReportConfig
): ReportData {
  const inventoryCostMap = new Map<string, number>()
  inventory.forEach((item) => inventoryCostMap.set(item.id, item.acquisition_cost))

  const filteredTx = transactions.filter((t) => {
    const txDate = new Date(t.transaction_date)
    return t.type === 'SELL' && txDate >= dateRange.from && txDate <= dateRange.to
  })

  const byPlatform: Record<
    string,
    { transactions: number; items: number; revenue: number; cost: number; fees: number; shipping: number }
  > = {}

  filteredTx.forEach((t) => {
    const platform = t.platform || 'Other'
    if (!byPlatform[platform]) {
      byPlatform[platform] = { transactions: 0, items: 0, revenue: 0, cost: 0, fees: 0, shipping: 0 }
    }

    byPlatform[platform].transactions++
    byPlatform[platform].revenue += Number(t.cash_in || 0)
    byPlatform[platform].fees += Number(t.fees || 0)
    byPlatform[platform].shipping += Number(t.shipping_cost || 0)

    t.transaction_items
      .filter((i) => i.direction === 'OUT')
      .forEach((item) => {
        byPlatform[platform].items += item.quantity
        if (item.inventory_id) {
          byPlatform[platform].cost += inventoryCostMap.get(item.inventory_id) || 0
        }
      })
  })

  const rows = Object.entries(byPlatform)
    .map(([platform, data]) => {
      const profit = data.revenue - data.cost - data.fees - data.shipping
      const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0
      const feePercent = data.revenue > 0 ? (data.fees / data.revenue) * 100 : 0
      return {
        platform,
        transactions: data.transactions,
        items: data.items,
        revenue: data.revenue,
        fees: data.fees,
        feePercent,
        profit,
        margin,
      }
    })
    .sort((a, b) => b.profit - a.profit)

  const totals = {
    transactions: rows.reduce((sum, r) => sum + (r.transactions as number), 0),
    items: rows.reduce((sum, r) => sum + (r.items as number), 0),
    revenue: rows.reduce((sum, r) => sum + (r.revenue as number), 0),
    fees: rows.reduce((sum, r) => sum + (r.fees as number), 0),
    profit: rows.reduce((sum, r) => sum + (r.profit as number), 0),
  }

  return {
    title: 'Sales by Platform',
    subtitle: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
    generatedAt: new Date().toISOString(),
    dateRange: {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    },
    summary: {
      'Total Transactions': totals.transactions,
      'Items Sold': totals.items,
      'Total Revenue': totals.revenue,
      'Total Profit': totals.profit,
    },
    columns: [
      { key: 'platform', label: 'Platform', type: 'string' },
      { key: 'transactions', label: 'Txns', type: 'number', align: 'right' },
      { key: 'items', label: 'Items', type: 'number', align: 'right' },
      { key: 'revenue', label: 'Revenue', type: 'currency', align: 'right' },
      { key: 'feePercent', label: 'Fee %', type: 'percent', align: 'right' },
      { key: 'profit', label: 'Profit', type: 'currency', align: 'right' },
      { key: 'margin', label: 'Margin', type: 'percent', align: 'right' },
    ],
    rows,
    totals,
  }
}

// Sales by Set Report
function generateSalesBySetReport(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: ReportConfig
): ReportData {
  const inventoryMap = new Map<string, InventoryItem>()
  inventory.forEach((item) => inventoryMap.set(item.id, item))

  const filteredTx = transactions.filter((t) => {
    const txDate = new Date(t.transaction_date)
    return t.type === 'SELL' && txDate >= dateRange.from && txDate <= dateRange.to
  })

  const bySet: Record<string, { items: number; revenue: number; cost: number }> = {}

  filteredTx.forEach((t) => {
    t.transaction_items
      .filter((i) => i.direction === 'OUT' && i.inventory_id)
      .forEach((item) => {
        const invItem = inventoryMap.get(item.inventory_id!)
        const setName = invItem?.set_name || item.set_name || 'Unknown Set'

        if (!bySet[setName]) {
          bySet[setName] = { items: 0, revenue: 0, cost: 0 }
        }
        bySet[setName].items += item.quantity
        bySet[setName].revenue += item.total_value
        bySet[setName].cost += invItem?.acquisition_cost || 0
      })
  })

  const rows = Object.entries(bySet)
    .map(([set, data]) => {
      const profit = data.revenue - data.cost
      const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0
      const roi = data.cost > 0 ? (profit / data.cost) * 100 : 0
      return {
        set,
        items: data.items,
        revenue: data.revenue,
        cost: data.cost,
        profit,
        margin,
        roi,
      }
    })
    .sort((a, b) => b.profit - a.profit)

  const totals = {
    items: rows.reduce((sum, r) => sum + (r.items as number), 0),
    revenue: rows.reduce((sum, r) => sum + (r.revenue as number), 0),
    cost: rows.reduce((sum, r) => sum + (r.cost as number), 0),
    profit: rows.reduce((sum, r) => sum + (r.profit as number), 0),
  }

  return {
    title: 'Sales by Set',
    subtitle: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
    generatedAt: new Date().toISOString(),
    dateRange: {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    },
    summary: {
      'Sets Sold': rows.length,
      'Items Sold': totals.items,
      'Total Revenue': totals.revenue,
      'Total Profit': totals.profit,
    },
    columns: [
      { key: 'set', label: 'Set', type: 'string' },
      { key: 'items', label: 'Sold', type: 'number', align: 'right' },
      { key: 'revenue', label: 'Revenue', type: 'currency', align: 'right' },
      { key: 'cost', label: 'Cost', type: 'currency', align: 'right' },
      { key: 'profit', label: 'Profit', type: 'currency', align: 'right' },
      { key: 'roi', label: 'ROI', type: 'percent', align: 'right' },
    ],
    rows,
    totals,
  }
}

// Inventory Aging Report
function generateInventoryAgingReport(
  inventory: InventoryItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: ReportConfig
): ReportData {
  const now = new Date()
  const activeInventory = inventory.filter((i) => i.status !== 'SOLD')

  const buckets = {
    '0-30': { items: 0, value: 0 },
    '31-60': { items: 0, value: 0 },
    '61-90': { items: 0, value: 0 },
    '91-180': { items: 0, value: 0 },
    '180+': { items: 0, value: 0 },
  }

  activeInventory.forEach((item) => {
    const daysOld = Math.floor(
      (now.getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    const value = item.acquisition_cost * item.quantity

    if (daysOld <= 30) {
      buckets['0-30'].items += item.quantity
      buckets['0-30'].value += value
    } else if (daysOld <= 60) {
      buckets['31-60'].items += item.quantity
      buckets['31-60'].value += value
    } else if (daysOld <= 90) {
      buckets['61-90'].items += item.quantity
      buckets['61-90'].value += value
    } else if (daysOld <= 180) {
      buckets['91-180'].items += item.quantity
      buckets['91-180'].value += value
    } else {
      buckets['180+'].items += item.quantity
      buckets['180+'].value += value
    }
  })

  const totalItems = Object.values(buckets).reduce((sum, b) => sum + b.items, 0)
  const totalValue = Object.values(buckets).reduce((sum, b) => sum + b.value, 0)

  const rows = Object.entries(buckets).map(([bucket, data]) => ({
    bucket: bucket + ' days',
    items: data.items,
    value: data.value,
    percent: totalItems > 0 ? (data.items / totalItems) * 100 : 0,
  }))

  return {
    title: 'Inventory Aging Report',
    generatedAt: new Date().toISOString(),
    dateRange: { from: '', to: '' },
    summary: {
      'Total Items': totalItems,
      'Total Value': totalValue,
      'Items > 90 days': buckets['91-180'].items + buckets['180+'].items,
      'Value > 90 days': buckets['91-180'].value + buckets['180+'].value,
    },
    columns: [
      { key: 'bucket', label: 'Age', type: 'string' },
      { key: 'items', label: 'Items', type: 'number', align: 'right' },
      { key: 'value', label: 'Value', type: 'currency', align: 'right' },
      { key: 'percent', label: '% of Total', type: 'percent', align: 'right' },
    ],
    rows,
    totals: { items: totalItems, value: totalValue },
  }
}

// Tax Summary Report
function generateTaxSummaryReport(
  inventory: InventoryItem[],
  transactions: TransactionWithItems[],
  dateRange: { from: Date; to: Date },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: ReportConfig
): ReportData {
  const inventoryMap = new Map<string, InventoryItem>()
  inventory.forEach((item) => inventoryMap.set(item.id, item))

  const filteredTx = transactions.filter((t) => {
    const txDate = new Date(t.transaction_date)
    return t.type === 'SELL' && txDate >= dateRange.from && txDate <= dateRange.to
  })

  // Build transaction detail rows
  const rows: Record<string, unknown>[] = []
  let totalProceeds = 0
  let totalCostBasis = 0
  let totalFees = 0
  let totalShipping = 0

  filteredTx.forEach((t) => {
    t.transaction_items
      .filter((i) => i.direction === 'OUT' && i.inventory_id)
      .forEach((item) => {
        const invItem = inventoryMap.get(item.inventory_id!)
        const proceeds = item.total_value
        const costBasis = invItem?.acquisition_cost || 0
        const gainLoss = proceeds - costBasis

        // Proportional fees and shipping
        const totalTxValue = t.transaction_items
          .filter((i) => i.direction === 'OUT')
          .reduce((sum, i) => sum + i.total_value, 0)
        const proportion = totalTxValue > 0 ? item.total_value / totalTxValue : 0
        const itemFees = t.fees * proportion
        const itemShipping = Number(t.shipping_cost || 0) * proportion

        totalProceeds += proceeds
        totalCostBasis += costBasis
        totalFees += itemFees
        totalShipping += itemShipping

        rows.push({
          dateSold: new Date(t.transaction_date).toLocaleDateString(),
          description: item.card_name,
          dateAcquired: invItem ? new Date(invItem.created_at).toLocaleDateString() : 'N/A',
          proceeds,
          costBasis,
          gainLoss: gainLoss - itemFees - itemShipping,
        })
      })
  })

  const netGainLoss = totalProceeds - totalCostBasis - totalFees - totalShipping

  return {
    title: 'Tax Summary Report',
    subtitle: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
    generatedAt: new Date().toISOString(),
    dateRange: {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    },
    summary: {
      'Total Proceeds': totalProceeds,
      'Total Cost Basis': totalCostBasis,
      'Total Fees': totalFees,
      'Total Shipping': totalShipping,
      'Net Gain/Loss': netGainLoss,
      'Transactions': rows.length,
    },
    columns: [
      { key: 'dateSold', label: 'Date Sold', type: 'date' },
      { key: 'description', label: 'Description', type: 'string' },
      { key: 'dateAcquired', label: 'Acquired', type: 'date' },
      { key: 'proceeds', label: 'Proceeds', type: 'currency', align: 'right' },
      { key: 'costBasis', label: 'Cost Basis', type: 'currency', align: 'right' },
      { key: 'gainLoss', label: 'Gain/Loss', type: 'currency', align: 'right' },
    ],
    rows,
    totals: {
      proceeds: totalProceeds,
      costBasis: totalCostBasis,
      gainLoss: netGainLoss,
    },
  }
}

// Helper to format month
function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
