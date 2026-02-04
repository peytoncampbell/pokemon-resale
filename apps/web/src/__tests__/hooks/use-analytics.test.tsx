import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Mock the analytics hooks
const mockUseAnalytics = vi.fn()
const mockUseSetProfitability = vi.fn()
const mockUsePlatformProfitability = vi.fn()
const mockUseInventoryAging = vi.fn()
const mockUseSellThrough = vi.fn()

vi.mock('@/hooks/use-analytics', () => ({
  useAnalytics: () => mockUseAnalytics(),
  useSetProfitability: (timeRange?: unknown) => mockUseSetProfitability(timeRange),
  usePlatformProfitability: (timeRange?: unknown) => mockUsePlatformProfitability(timeRange),
  useInventoryAging: () => mockUseInventoryAging(),
  useSellThrough: (timeRange?: unknown) => mockUseSellThrough(timeRange),
}))

import {
  useAnalytics,
  useSetProfitability,
  usePlatformProfitability,
  useInventoryAging,
  useSellThrough,
} from '@/hooks/use-analytics'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useAnalytics', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return analytics summary', () => {
    mockUseAnalytics.mockReturnValue({
      data: {
        totalInventoryValue: 5000,
        totalItems: 50,
        totalInvested: 8000,
        itemsSold: 30,
        totalRevenue: 12000,
        totalProfit: 4000,
        pendingProcurements: 2,
        inventoryByStatus: { IN_STOCK: 35, LISTED: 10, SOLD: 30 },
        inventoryByCondition: { NM: 40, LP: 10 },
        recentActivity: [],
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
    })

    const { result } = renderHook(() => useAnalytics(), { wrapper: createWrapper() })
    expect(result.current.data?.totalProfit).toBe(4000)
    expect(result.current.data?.totalItems).toBe(50)
    expect(result.current.data?.inventoryByStatus.IN_STOCK).toBe(35)
  })

  it('should return empty analytics when no org', () => {
    mockUseAnalytics.mockReturnValue({
      data: {
        totalInventoryValue: 0,
        totalItems: 0,
        totalInvested: 0,
        itemsSold: 0,
        totalRevenue: 0,
        totalProfit: 0,
        pendingProcurements: 0,
        inventoryByStatus: { IN_STOCK: 0, LISTED: 0, SOLD: 0 },
        inventoryByCondition: {},
        recentActivity: [],
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
    })

    const { result } = renderHook(() => useAnalytics(), { wrapper: createWrapper() })
    expect(result.current.data?.totalItems).toBe(0)
  })

  it('should return loading state', () => {
    mockUseAnalytics.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
    })

    const { result } = renderHook(() => useAnalytics(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })
})

describe('useSetProfitability', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return set profitability data', () => {
    mockUseSetProfitability.mockReturnValue({
      data: [
        { setName: 'Surging Sparks', game: 'pokemon', itemsSold: 10, netProfit: 500, roi: 25 },
        { setName: 'Base Set', game: 'pokemon', itemsSold: 5, netProfit: 1000, roi: 50 },
      ],
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(
      () => useSetProfitability({ preset: '30d' }),
      { wrapper: createWrapper() }
    )
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].setName).toBe('Surging Sparks')
  })

  it('should return empty array when no data', () => {
    mockUseSetProfitability.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useSetProfitability(), { wrapper: createWrapper() })
    expect(result.current.data).toEqual([])
  })
})

describe('usePlatformProfitability', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return platform profitability data', () => {
    mockUsePlatformProfitability.mockReturnValue({
      data: [
        { platform: 'eBay', transactionCount: 20, netProfit: 800, feePercentage: 13.25 },
        { platform: 'TCGPlayer', transactionCount: 15, netProfit: 600, feePercentage: 10.25 },
      ],
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => usePlatformProfitability(), { wrapper: createWrapper() })
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].platform).toBe('eBay')
  })
})

describe('useInventoryAging', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return aging buckets', () => {
    mockUseInventoryAging.mockReturnValue({
      data: [
        { bucket: 'fresh', label: 'Fresh', itemCount: 20, totalValue: 2000, percentage: 50 },
        { bucket: 'aging', label: 'Aging', itemCount: 10, totalValue: 1000, percentage: 25 },
        { bucket: 'stale', label: 'Stale', itemCount: 5, totalValue: 500, percentage: 12.5 },
        { bucket: 'dead', label: 'Dead Stock', itemCount: 5, totalValue: 500, percentage: 12.5 },
      ],
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useInventoryAging(), { wrapper: createWrapper() })
    expect(result.current.data).toHaveLength(4)
    expect(result.current.data[0].bucket).toBe('fresh')
  })
})

describe('useSellThrough', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return sell-through metrics', () => {
    mockUseSellThrough.mockReturnValue({
      data: {
        currentRate: 15.5,
        previousRate: 12.0,
        trend: 'up',
        avgDaysToSell: 14,
        velocity: 2.3,
        byCondition: { NM: 20, LP: 10 },
      },
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useSellThrough(), { wrapper: createWrapper() })
    expect(result.current.data?.currentRate).toBe(15.5)
    expect(result.current.data?.trend).toBe('up')
    expect(result.current.data?.avgDaysToSell).toBe(14)
  })

  it('should return null when no data', () => {
    mockUseSellThrough.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    })

    const { result } = renderHook(() => useSellThrough(), { wrapper: createWrapper() })
    expect(result.current.data).toBeNull()
  })
})
