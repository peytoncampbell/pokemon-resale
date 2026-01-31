'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGenerateReport } from '@/hooks/use-reports'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  Package,
  Store,
  Layers,
  Clock,
  FileText,
  Download,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import type { ReportConfig, ReportType, ReportData, DateRangePreset } from '@/types/reports'
import { REPORT_TEMPLATES, DATE_RANGE_PRESETS } from '@/types/reports'

const REPORT_ICONS: Record<string, typeof TrendingUp> = {
  TrendingUp,
  Package,
  Store,
  Layers,
  Clock,
  FileText,
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [datePreset, setDatePreset] = useState<DateRangePreset>('30d')
  const { generate, reportData, isGenerating, clear } = useGenerateReport()

  const handleGenerateReport = async (type: ReportType) => {
    setSelectedReport(type)
    const config: ReportConfig = {
      type,
      name: REPORT_TEMPLATES[type].name,
      dateRange: { preset: datePreset },
      filters: {},
    }
    await generate(config)
  }

  const handleBack = () => {
    setSelectedReport(null)
    clear()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description="Generate business reports and analytics."
        />

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Time Period:</span>
          <div className="flex rounded-lg bg-white/5 p-0.5">
            {DATE_RANGE_PRESETS.filter((p) => p.value !== 'custom').map((preset) => (
              <button
                key={preset.value}
                onClick={() => setDatePreset(preset.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  datePreset === preset.value
                    ? 'bg-vision-blue text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        {reportData && selectedReport ? (
          <ReportViewer
            data={reportData}
            onBack={handleBack}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(REPORT_TEMPLATES) as ReportType[])
              .filter((type) => type !== 'custom')
              .map((type) => {
                const template = REPORT_TEMPLATES[type]
                const Icon = REPORT_ICONS[template.icon] || FileText

                return (
                  <Card
                    key={type}
                    variant="interactive"
                    className="cursor-pointer"
                    onClick={() => handleGenerateReport(type)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-vision-blue/20">
                          <Icon className="h-6 w-6 text-vision-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{template.name}</h3>
                          <p className="text-sm text-white/50 mt-1">{template.description}</p>
                        </div>
                        {isGenerating && selectedReport === type ? (
                          <Loader2 className="h-5 w-5 text-vision-blue animate-spin" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-white/30" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

interface ReportViewerProps {
  data: ReportData
  onBack: () => void
}

function ReportViewer({ data, onBack }: ReportViewerProps) {
  const { formatPrice, formatNumber } = useCurrency()

  const formatCellValue = (value: unknown, type: string): string => {
    if (value === null || value === undefined) return '-'
    switch (type) {
      case 'currency':
        return formatPrice(value as number)
      case 'percent':
        return `${(value as number).toFixed(1)}%`
      case 'number':
        return formatNumber(value as number)
      case 'date':
        return value as string
      default:
        return String(value)
    }
  }

  const handleExportCSV = () => {
    const headers = data.columns.map((c) => c.label).join(',')
    const rows = data.rows.map((row) =>
      data.columns.map((col) => {
        const value = row[col.key]
        if (typeof value === 'number') return value
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    ).join('\n')

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            ← Back to Reports
          </Button>
          <h2 className="text-2xl font-bold text-white">{data.title}</h2>
          {data.subtitle && <p className="text-white/50">{data.subtitle}</p>}
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Object.entries(data.summary).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <p className="text-xs text-white/50 uppercase tracking-wider">{key}</p>
              <p className="text-xl font-bold text-white mt-1">
                {typeof value === 'number' ? formatPrice(value) : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {data.columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wider',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    {data.columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-sm',
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                          col.type === 'currency' && (row[col.key] as number) < 0 && 'text-red-400',
                          col.type === 'currency' && (row[col.key] as number) > 0 && col.key.includes('profit') && 'text-emerald-400'
                        )}
                      >
                        {formatCellValue(row[col.key], col.type)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {data.totals && (
                <tfoot>
                  <tr className="border-t border-white/10 bg-white/5 font-medium">
                    {data.columns.map((col, i) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-sm',
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        )}
                      >
                        {i === 0 ? 'TOTAL' : data.totals![col.key] !== undefined ? formatCellValue(data.totals![col.key], col.type) : ''}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Generated timestamp */}
      <p className="text-xs text-white/30 text-center">
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
