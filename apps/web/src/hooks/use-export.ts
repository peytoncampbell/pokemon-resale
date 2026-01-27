import { useState, useCallback } from 'react'
import {
  generateInventoryCSV,
  generateSalesCSV,
  generateInventoryXLSX,
  generateSalesXLSX,
  downloadFile,
  type ExportFormat
} from '@/lib/export-utils'
import type { InventoryItem, Sale } from '@/lib/supabase'

interface ExportState {
  isExporting: boolean
  error: string | null
}

export function useExportInventory() {
  const [state, setState] = useState<ExportState>({ isExporting: false, error: null })

  const exportInventory = useCallback(async (items: InventoryItem[], format: ExportFormat) => {
    setState({ isExporting: true, error: null })

    try {
      const timestamp = new Date().toISOString().split('T')[0]

      if (format === 'csv') {
        const csv = generateInventoryCSV(items)
        downloadFile(csv, `inventory-${timestamp}.csv`, 'text/csv')
      } else {
        const xlsx = await generateInventoryXLSX(items)
        downloadFile(xlsx, `inventory-${timestamp}.xlsx`)
      }

      setState({ isExporting: false, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed'
      setState({ isExporting: false, error: message })
      throw error
    }
  }, [])

  return {
    exportInventory,
    isExporting: state.isExporting,
    error: state.error,
  }
}

export function useExportSales() {
  const [state, setState] = useState<ExportState>({ isExporting: false, error: null })

  const exportSales = useCallback(async (sales: Sale[], format: ExportFormat) => {
    setState({ isExporting: true, error: null })

    try {
      const timestamp = new Date().toISOString().split('T')[0]

      if (format === 'csv') {
        const csv = generateSalesCSV(sales)
        downloadFile(csv, `sales-${timestamp}.csv`, 'text/csv')
      } else {
        const xlsx = await generateSalesXLSX(sales)
        downloadFile(xlsx, `sales-${timestamp}.xlsx`)
      }

      setState({ isExporting: false, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed'
      setState({ isExporting: false, error: message })
      throw error
    }
  }, [])

  return {
    exportSales,
    isExporting: state.isExporting,
    error: state.error,
  }
}
