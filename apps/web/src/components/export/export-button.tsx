'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react'
import type { ExportFormat } from '@/lib/export-utils'

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>
  isExporting: boolean
  label?: string
}

export function ExportButton({ onExport, isExporting, label = 'Export' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setIsOpen(false)
    await onExport(format)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {isExporting ? 'Exporting...' : label}
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-vision-navy border border-white/10 shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3"
            >
              <FileText className="h-4 w-4 text-vision-cyan" />
              <div>
                <p className="font-medium">CSV File</p>
                <p className="text-xs text-white/50">Comma-separated values</p>
              </div>
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3 border-t border-white/5"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-400" />
              <div>
                <p className="font-medium">Excel File</p>
                <p className="text-xs text-white/50">Microsoft Excel format</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
