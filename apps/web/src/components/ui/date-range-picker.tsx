'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateRange {
  start: Date
  end: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This month', days: 0, preset: 'thisMonth' },
  { label: 'Last month', days: 0, preset: 'lastMonth' },
  { label: 'This year', days: 0, preset: 'thisYear' },
]

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatRange = () => {
    const start = value.start.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
    const end = value.end.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${start} - ${end}`
  }

  const handlePreset = (preset: typeof PRESETS[number]) => {
    const now = new Date()
    let start: Date
    let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    if (preset.preset === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (preset.preset === 'lastMonth') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    } else if (preset.preset === 'thisYear') {
      start = new Date(now.getFullYear(), 0, 1)
    } else {
      start = new Date(now)
      start.setDate(start.getDate() - preset.days)
    }

    onChange({ start, end })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        {formatRange()}
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-vision-navy border border-white/10 shadow-xl z-50 overflow-hidden">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
