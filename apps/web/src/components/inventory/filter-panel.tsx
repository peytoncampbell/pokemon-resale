'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  MapPin,
  Sparkles,
  Package,
  Gamepad2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InventoryFilters, Condition, InventoryStatus, GameType, ProductType } from '@/types/filters'
import {
  CONDITION_OPTIONS,
  STATUS_OPTIONS,
  GAME_OPTIONS,
  PRODUCT_OPTIONS,
  SORT_OPTIONS,
} from '@/types/filters'

interface FilterPanelProps {
  filters: InventoryFilters
  onFilterChange: <K extends keyof InventoryFilters>(key: K, value: InventoryFilters[K]) => void
  onClearFilters: () => void
  activeFilterCount: number
  locations: { location: string; count: number }[]
  counts?: {
    status: Record<string, number>
    condition: Record<string, number>
    gameType: Record<string, number>
    productType: Record<string, number>
  }
}

interface FilterDropdownProps {
  label: string
  icon: React.ReactNode
  value: string
  options: readonly { value: string; label: string; color?: string }[]
  onChange: (value: string) => void
  counts?: Record<string, number>
}

function FilterDropdown({ label, icon, value, options, onChange, counts }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all',
          value !== 'ALL'
            ? 'border-vision-cyan/50 bg-vision-cyan/10 text-vision-cyan'
            : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
        )}
      >
        {icon}
        <span className="hidden sm:inline">{selectedOption?.label || label}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 min-w-[180px] rounded-xl bg-vision-navy border border-white/10 shadow-xl z-50 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors',
                  value === option.value
                    ? 'bg-vision-cyan/20 text-vision-cyan'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-2">
                  {option.color && (
                    <span className={cn('w-2 h-2 rounded-full', option.color.split(' ')[0])} />
                  )}
                  {option.label}
                </span>
                {counts && option.value !== 'ALL' && counts[option.value] !== undefined && (
                  <span className="text-white/40 text-xs">{counts[option.value]}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface PriceRangeInputProps {
  minValue: number | null
  maxValue: number | null
  onMinChange: (value: number | null) => void
  onMaxChange: (value: number | null) => void
}

function PriceRangeInput({ minValue, maxValue, onMinChange, onMaxChange }: PriceRangeInputProps) {
  const [localMin, setLocalMin] = useState(minValue?.toString() || '')
  const [localMax, setLocalMax] = useState(maxValue?.toString() || '')

  useEffect(() => {
    setLocalMin(minValue?.toString() || '')
  }, [minValue])

  useEffect(() => {
    setLocalMax(maxValue?.toString() || '')
  }, [maxValue])

  const handleMinBlur = useCallback(() => {
    const num = parseFloat(localMin)
    onMinChange(isNaN(num) ? null : num)
  }, [localMin, onMinChange])

  const handleMaxBlur = useCallback(() => {
    const num = parseFloat(localMax)
    onMaxChange(isNaN(num) ? null : num)
  }, [localMax, onMaxChange])

  const hasValue = minValue !== null || maxValue !== null

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm',
      hasValue
        ? 'border-vision-cyan/50 bg-vision-cyan/10'
        : 'border-white/10 bg-white/5'
    )}>
      <DollarSign className={cn('h-4 w-4', hasValue ? 'text-vision-cyan' : 'text-white/40')} />
      <input
        type="number"
        placeholder="Min"
        value={localMin}
        onChange={(e) => setLocalMin(e.target.value)}
        onBlur={handleMinBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleMinBlur()}
        className="w-16 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
      />
      <span className="text-white/40">-</span>
      <input
        type="number"
        placeholder="Max"
        value={localMax}
        onChange={(e) => setLocalMax(e.target.value)}
        onBlur={handleMaxBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleMaxBlur()}
        className="w-16 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
      />
      {hasValue && (
        <button
          onClick={() => {
            setLocalMin('')
            setLocalMax('')
            onMinChange(null)
            onMaxChange(null)
          }}
          className="text-white/40 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

interface DateFilterProps {
  dateFrom: Date | null
  dateTo: Date | null
  onDateFromChange: (date: Date | null) => void
  onDateToChange: (date: Date | null) => void
}

function DateFilter({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasValue = dateFrom !== null || dateTo !== null

  const presets = [
    { label: 'Today', getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return { from: today, to: new Date() }
    }},
    { label: 'Last 7 days', getValue: () => {
      const from = new Date()
      from.setDate(from.getDate() - 7)
      return { from, to: new Date() }
    }},
    { label: 'Last 30 days', getValue: () => {
      const from = new Date()
      from.setDate(from.getDate() - 30)
      return { from, to: new Date() }
    }},
    { label: 'This month', getValue: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date() }
    }},
    { label: 'Last month', getValue: () => {
      const now = new Date()
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 0)
      }
    }},
  ]

  const formatDateRange = () => {
    if (!dateFrom && !dateTo) return 'Any time'
    if (dateFrom && dateTo) {
      return `${dateFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateTo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
    if (dateFrom) return `From ${dateFrom.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    if (dateTo) return `Until ${dateTo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    return 'Any time'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all',
          hasValue
            ? 'border-vision-cyan/50 bg-vision-cyan/10 text-vision-cyan'
            : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
        )}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">{formatDateRange()}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 min-w-[200px] rounded-xl bg-vision-navy border border-white/10 shadow-xl z-50 overflow-hidden">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const { from, to } = preset.getValue()
                  onDateFromChange(from)
                  onDateToChange(to)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
            {hasValue && (
              <>
                <div className="border-t border-white/10" />
                <button
                  onClick={() => {
                    onDateFromChange(null)
                    onDateToChange(null)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Clear dates
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

interface LocationFilterProps {
  value: string | null
  onChange: (value: string | null) => void
  locations: { location: string; count: number }[]
}

function LocationFilter({ value, onChange, locations }: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasValue = value !== null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all',
          hasValue
            ? 'border-vision-cyan/50 bg-vision-cyan/10 text-vision-cyan'
            : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
        )}
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">{value || 'Location'}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 min-w-[180px] max-h-[300px] overflow-y-auto rounded-xl bg-vision-navy border border-white/10 shadow-xl z-50">
            <button
              onClick={() => {
                onChange(null)
                setIsOpen(false)
              }}
              className={cn(
                'w-full px-4 py-2.5 text-left text-sm transition-colors',
                !hasValue
                  ? 'bg-vision-cyan/20 text-vision-cyan'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              All Locations
            </button>
            {locations.map(({ location, count }) => (
              <button
                key={location}
                onClick={() => {
                  onChange(location)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors',
                  value === location
                    ? 'bg-vision-cyan/20 text-vision-cyan'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <span>{location}</span>
                <span className="text-white/40 text-xs">{count}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface SortDropdownProps {
  sortBy: string
  sortOrder: string
  onChange: (sortBy: string, sortOrder: string) => void
}

function SortDropdown({ sortBy, sortOrder, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentValue = `${sortBy}:${sortOrder}`
  const selectedOption = SORT_OPTIONS.find(o => o.value === currentValue) || SORT_OPTIONS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-all"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">{selectedOption.label}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 min-w-[180px] rounded-xl bg-vision-navy border border-white/10 shadow-xl z-50 overflow-hidden">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.sortBy, option.sortOrder)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm transition-colors',
                  currentValue === option.value
                    ? 'bg-vision-cyan/20 text-vision-cyan'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
  locations,
  counts,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-3">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="info" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-white/60 hover:text-white"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter controls */}
      {isExpanded && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <FilterDropdown
            label="Status"
            icon={<Sparkles className="h-4 w-4" />}
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(v) => onFilterChange('status', v as InventoryStatus | 'ALL')}
            counts={counts?.status}
          />

          {/* Condition Filter */}
          <FilterDropdown
            label="Condition"
            icon={<Sparkles className="h-4 w-4" />}
            value={filters.condition}
            options={CONDITION_OPTIONS}
            onChange={(v) => onFilterChange('condition', v as Condition | 'ALL')}
            counts={counts?.condition}
          />

          {/* Location Filter */}
          <LocationFilter
            value={filters.location}
            onChange={(v) => onFilterChange('location', v)}
            locations={locations}
          />

          {/* Game Type Filter */}
          <FilterDropdown
            label="Game"
            icon={<Gamepad2 className="h-4 w-4" />}
            value={filters.gameType}
            options={GAME_OPTIONS}
            onChange={(v) => onFilterChange('gameType', v as GameType | 'ALL')}
            counts={counts?.gameType}
          />

          {/* Product Type Filter */}
          <FilterDropdown
            label="Type"
            icon={<Package className="h-4 w-4" />}
            value={filters.productType}
            options={PRODUCT_OPTIONS}
            onChange={(v) => onFilterChange('productType', v as ProductType | 'ALL')}
            counts={counts?.productType}
          />

          {/* Price Range */}
          <PriceRangeInput
            minValue={filters.priceMin}
            maxValue={filters.priceMax}
            onMinChange={(v) => onFilterChange('priceMin', v)}
            onMaxChange={(v) => onFilterChange('priceMax', v)}
          />

          {/* Date Filter */}
          <DateFilter
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateFromChange={(v) => onFilterChange('dateFrom', v)}
            onDateToChange={(v) => onFilterChange('dateTo', v)}
          />

          {/* Sort */}
          <div className="ml-auto">
            <SortDropdown
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onChange={(sortBy, sortOrder) => {
                onFilterChange('sortBy', sortBy as InventoryFilters['sortBy'])
                onFilterChange('sortOrder', sortOrder as InventoryFilters['sortOrder'])
              }}
            />
          </div>
        </div>
      )}

      {/* Active filters chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40">Active:</span>

          {filters.status !== 'ALL' && (
            <Badge variant="outline" className="gap-1 pr-1">
              {STATUS_OPTIONS.find(o => o.value === filters.status)?.label}
              <button
                onClick={() => onFilterChange('status', 'ALL')}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.condition !== 'ALL' && (
            <Badge variant="outline" className="gap-1 pr-1">
              {filters.condition}
              <button
                onClick={() => onFilterChange('condition', 'ALL')}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.location && (
            <Badge variant="outline" className="gap-1 pr-1">
              {filters.location}
              <button
                onClick={() => onFilterChange('location', null)}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.gameType !== 'ALL' && (
            <Badge variant="outline" className="gap-1 pr-1">
              {GAME_OPTIONS.find(o => o.value === filters.gameType)?.label}
              <button
                onClick={() => onFilterChange('gameType', 'ALL')}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.productType !== 'ALL' && (
            <Badge variant="outline" className="gap-1 pr-1">
              {PRODUCT_OPTIONS.find(o => o.value === filters.productType)?.label}
              <button
                onClick={() => onFilterChange('productType', 'ALL')}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.priceMin !== null || filters.priceMax !== null) && (
            <Badge variant="outline" className="gap-1 pr-1">
              ${filters.priceMin ?? '0'} - ${filters.priceMax ?? '∞'}
              <button
                onClick={() => {
                  onFilterChange('priceMin', null)
                  onFilterChange('priceMax', null)
                }}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="outline" className="gap-1 pr-1">
              {filters.dateFrom?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Start'}
              {' - '}
              {filters.dateTo?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Now'}
              <button
                onClick={() => {
                  onFilterChange('dateFrom', null)
                  onFilterChange('dateTo', null)
                }}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.search && (
            <Badge variant="outline" className="gap-1 pr-1">
              &quot;{filters.search}&quot;
              <button
                onClick={() => onFilterChange('search', '')}
                className="ml-1 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
