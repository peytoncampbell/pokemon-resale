import type { InventoryItem, Sale } from '@/lib/supabase'

export type ExportFormat = 'csv' | 'xlsx'

interface ExportColumn<T> {
  key: keyof T | string
  header: string
  format?: (value: unknown, row: T) => string | number
}

const INVENTORY_COLUMNS: ExportColumn<InventoryItem>[] = [
  { key: 'card_name', header: 'Card Name' },
  { key: 'card_id', header: 'Card ID' },
  { key: 'set_name', header: 'Set' },
  { key: 'condition', header: 'Condition' },
  { key: 'status', header: 'Status' },
  { key: 'location', header: 'Location' },
  { key: 'quantity', header: 'Quantity' },
  {
    key: 'acquisition_cost',
    header: 'Acquisition Cost',
    format: (value) => typeof value === 'number' ? value : 0
  },
  {
    key: 'total_value',
    header: 'Total Value',
    format: (_, row) => row.acquisition_cost * row.quantity
  },
  { key: 'notes', header: 'Notes' },
  {
    key: 'created_at',
    header: 'Date Added',
    format: (value) => value ? new Date(value as string).toLocaleDateString() : ''
  },
]

const SALES_COLUMNS: ExportColumn<Sale>[] = [
  {
    key: 'sold_at',
    header: 'Sale Date',
    format: (value) => value ? new Date(value as string).toLocaleDateString() : ''
  },
  { key: 'sale_price', header: 'Sale Price' },
  { key: 'platform', header: 'Platform' },
  { key: 'fees', header: 'Fees' },
  { key: 'shipping_cost', header: 'Shipping Cost' },
  {
    key: 'net_profit',
    header: 'Net Profit',
    format: (_, row) => row.sale_price - row.fees - row.shipping_cost
  },
]

function getValue<T>(row: T, column: ExportColumn<T>): string | number {
  const rawValue = (row as Record<string, unknown>)[column.key as string]
  if (column.format) {
    return column.format(rawValue, row)
  }
  if (rawValue === null || rawValue === undefined) {
    return ''
  }
  return String(rawValue)
}

function escapeCSVValue(value: string | number): string {
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export function generateCSV<T>(data: T[], columns: ExportColumn<T>[]): string {
  const headers = columns.map(col => escapeCSVValue(col.header)).join(',')
  const rows = data.map(row =>
    columns.map(col => escapeCSVValue(getValue(row, col))).join(',')
  )
  return [headers, ...rows].join('\n')
}

export function generateInventoryCSV(items: InventoryItem[]): string {
  return generateCSV(items, INVENTORY_COLUMNS)
}

export function generateSalesCSV(sales: Sale[]): string {
  return generateCSV(sales, SALES_COLUMNS)
}

export async function generateInventoryXLSX(items: InventoryItem[]): Promise<Blob> {
  const XLSX = await import('xlsx')

  const data = items.map(item => ({
    'Card Name': item.card_name,
    'Card ID': item.card_id,
    'Set': item.set_name || '',
    'Condition': item.condition,
    'Status': item.status,
    'Location': item.location,
    'Quantity': item.quantity,
    'Acquisition Cost': item.acquisition_cost,
    'Total Value': item.acquisition_cost * item.quantity,
    'Notes': item.notes || '',
    'Date Added': new Date(item.created_at).toLocaleDateString(),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory')

  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export async function generateSalesXLSX(sales: Sale[]): Promise<Blob> {
  const XLSX = await import('xlsx')

  const data = sales.map(sale => ({
    'Sale Date': new Date(sale.sold_at).toLocaleDateString(),
    'Sale Price': sale.sale_price,
    'Platform': sale.platform || '',
    'Fees': sale.fees,
    'Shipping Cost': sale.shipping_cost,
    'Net Profit': sale.sale_price - sale.fees - sale.shipping_cost,
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales')

  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export function downloadFile(content: string | Blob, filename: string, mimeType?: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType || 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
