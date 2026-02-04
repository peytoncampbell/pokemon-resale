import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const mockUsePriceAlerts = vi.fn()
const mockUsePriceAlert = vi.fn()
const mockUseCreatePriceAlert = vi.fn()
const mockUseUpdatePriceAlert = vi.fn()
const mockUseDeletePriceAlert = vi.fn()
const mockUseTogglePriceAlert = vi.fn()

vi.mock('@/hooks/use-price-alerts', () => ({
  usePriceAlerts: (activeOnly?: boolean) => mockUsePriceAlerts(activeOnly),
  usePriceAlert: (id: string) => mockUsePriceAlert(id),
  useCreatePriceAlert: () => mockUseCreatePriceAlert(),
  useUpdatePriceAlert: () => mockUseUpdatePriceAlert(),
  useDeletePriceAlert: () => mockUseDeletePriceAlert(),
  useTogglePriceAlert: () => mockUseTogglePriceAlert(),
}))

import {
  usePriceAlerts,
  usePriceAlert,
  useCreatePriceAlert,
  useUpdatePriceAlert,
  useDeletePriceAlert,
  useTogglePriceAlert,
} from '@/hooks/use-price-alerts'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const mockAlert = {
  id: 'alert-1',
  organizationId: 'org-1',
  userId: 'user-1',
  cardId: 'card-1',
  cardName: 'Charizard',
  cardImage: null,
  setName: 'Base Set',
  condition: 'NM',
  gameType: 'pokemon',
  alertType: 'price_drop',
  targetPrice: 50,
  thresholdPercent: null,
  isActive: true,
  isTriggered: false,
  triggeredAt: null,
  triggeredPrice: null,
  notifyInApp: true,
  notifyEmail: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('usePriceAlerts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return all alerts', () => {
    mockUsePriceAlerts.mockReturnValue({
      data: [mockAlert],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => usePriceAlerts(), { wrapper: createWrapper() })
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].cardName).toBe('Charizard')
  })

  it('should filter active only', () => {
    mockUsePriceAlerts.mockReturnValue({
      data: [mockAlert],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    renderHook(() => usePriceAlerts(true), { wrapper: createWrapper() })
    expect(mockUsePriceAlerts).toHaveBeenCalledWith(true)
  })

  it('should return empty when no org', () => {
    mockUsePriceAlerts.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => usePriceAlerts(), { wrapper: createWrapper() })
    expect(result.current.data).toEqual([])
  })
})

describe('usePriceAlert', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return single alert', () => {
    mockUsePriceAlert.mockReturnValue({
      data: mockAlert,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => usePriceAlert('alert-1'), { wrapper: createWrapper() })
    expect(result.current.data?.targetPrice).toBe(50)
  })
})

describe('useCreatePriceAlert', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseCreatePriceAlert.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useCreatePriceAlert(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useUpdatePriceAlert', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseUpdatePriceAlert.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUpdatePriceAlert(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useDeletePriceAlert', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseDeletePriceAlert.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useDeletePriceAlert(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useTogglePriceAlert', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseTogglePriceAlert.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useTogglePriceAlert(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})
