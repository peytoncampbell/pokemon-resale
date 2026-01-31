'use client'

import { useState, useMemo, useCallback } from 'react'
import type { InventoryItem } from '@/lib/supabase'
import type { InventoryFilters, Condition } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'

export function useInventoryFilters() {
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_FILTERS)

  const setFilter = useCallback(<K extends keyof InventoryFilters>(
    key: K,
    value: InventoryFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const setMultipleFilters = useCallback((updates: Partial<InventoryFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status !== 'ALL') count++
    if (filters.condition !== 'ALL') count++
    if (filters.location) count++
    if (filters.gameType !== 'ALL') count++
    if (filters.productType !== 'ALL') count++
    if (filters.priceMin !== null || filters.priceMax !== null) count++
    if (filters.dateFrom || filters.dateTo) count++
    if (filters.search) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    setFilter,
    setMultipleFilters,
    clearFilters,
    activeFilterCount,
    hasActiveFilters,
  }
}

const CONDITION_ORDER: Condition[] = ['NM', 'LP', 'MP', 'HP', 'DMG']

export function filterInventory(
  items: InventoryItem[],
  filters: InventoryFilters
): InventoryItem[] {
  return items
    .filter(item => {
      // Status filter
      if (filters.status !== 'ALL' && item.status !== filters.status) return false

      // Condition filter
      if (filters.condition !== 'ALL' && item.condition !== filters.condition) return false

      // Location filter
      if (filters.location && item.location !== filters.location) return false

      // Game type filter
      if (filters.gameType !== 'ALL' && item.game_type !== filters.gameType) return false

      // Product type filter
      if (filters.productType !== 'ALL' && item.product_type !== filters.productType) return false

      // Price range filter
      if (filters.priceMin !== null && (item.acquisition_cost ?? 0) < filters.priceMin) return false
      if (filters.priceMax !== null && (item.acquisition_cost ?? 0) > filters.priceMax) return false

      // Date range filter
      if (filters.dateFrom && new Date(item.created_at) < filters.dateFrom) return false
      if (filters.dateTo) {
        const endOfDay = new Date(filters.dateTo)
        endOfDay.setHours(23, 59, 59, 999)
        if (new Date(item.created_at) > endOfDay) return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = item.card_name?.toLowerCase().includes(searchLower)
        const matchesSet = item.set_name?.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesSet) return false
      }

      return true
    })
    .sort((a, b) => {
      const { sortBy, sortOrder } = filters
      let comparison = 0

      switch (sortBy) {
        case 'card_name':
          comparison = (a.card_name || '').localeCompare(b.card_name || '')
          break
        case 'acquisition_cost':
          comparison = (a.acquisition_cost ?? 0) - (b.acquisition_cost ?? 0)
          break
        case 'condition':
          comparison = CONDITION_ORDER.indexOf(a.condition) - CONDITION_ORDER.indexOf(b.condition)
          break
        case 'created_at':
        default:
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
}

export function getUniqueLocations(items: InventoryItem[]): { location: string; count: number }[] {
  const locationCounts = items.reduce((acc, item) => {
    if (item.location) {
      acc[item.location] = (acc[item.location] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => a.location.localeCompare(b.location))
}

export function getFilterCounts(items: InventoryItem[]) {
  const counts = {
    status: {
      IN_STOCK: 0,
      LISTED: 0,
      SOLD: 0,
    },
    condition: {
      NM: 0,
      LP: 0,
      MP: 0,
      HP: 0,
      DMG: 0,
    },
    gameType: {
      pokemon: 0,
      onepiece: 0,
    },
    productType: {
      card: 0,
      sealed: 0,
    },
  }

  items.forEach(item => {
    if (item.status in counts.status) {
      counts.status[item.status as keyof typeof counts.status]++
    }
    if (item.condition in counts.condition) {
      counts.condition[item.condition as keyof typeof counts.condition]++
    }
    if (item.game_type in counts.gameType) {
      counts.gameType[item.game_type as keyof typeof counts.gameType]++
    }
    if (item.product_type in counts.productType) {
      counts.productType[item.product_type as keyof typeof counts.productType]++
    }
  })

  return counts
}
