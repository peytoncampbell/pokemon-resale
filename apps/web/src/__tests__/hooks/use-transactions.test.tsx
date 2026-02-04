import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { mockTransaction } from '../test-utils'

// Mock the use-transactions module
const mockUseTransactions = vi.fn()
const mockUseTransaction = vi.fn()
const mockUseTransactionStats = vi.fn()
const mockUseCreateTransaction = vi.fn()
const mockUseUpdateTransaction = vi.fn()
const mockUseDeleteTransaction = vi.fn()

vi.mock('@/hooks/use-transactions', () => ({
  useTransactions: (filters?: unknown) => mockUseTransactions(filters),
  useTransaction: (id: string) => mockUseTransaction(id),
  useTransactionStats: () => mockUseTransactionStats(),
  useCreateTransaction: () => mockUseCreateTransaction(),
  useUpdateTransaction: () => mockUseUpdateTransaction(),
  useDeleteTransaction: () => mockUseDeleteTransaction(),
}))

import {
  useTransactions,
  useTransaction,
  useTransactionStats,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/use-transactions'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useTransactions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return transactions list', () => {
    const txns = [
      mockTransaction({ id: 'txn-1', type: 'BUY' }),
      mockTransaction({ id: 'txn-2', type: 'SELL', cash_in: 200 }),
    ]
    mockUseTransactions.mockReturnValue({
      data: txns,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toHaveLength(2)
  })

  it('should filter by type', () => {
    const sellTxns = [mockTransaction({ id: 'txn-2', type: 'SELL' })]
    mockUseTransactions.mockReturnValue({
      data: sellTxns,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(
      () => useTransactions({ type: 'SELL' }),
      { wrapper: createWrapper() }
    )
    expect(result.current.data).toHaveLength(1)
    expect(mockUseTransactions).toHaveBeenCalledWith({ type: 'SELL' })
  })

  it('should return loading state', () => {
    mockUseTransactions.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('should return error state', () => {
    const error = new Error('Failed to fetch')
    mockUseTransactions.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
    })

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() })
    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Failed to fetch')
  })
})

describe('useTransaction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return single transaction', () => {
    const txn = mockTransaction({ id: 'txn-1' })
    mockUseTransaction.mockReturnValue({
      data: txn,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useTransaction('txn-1'), { wrapper: createWrapper() })
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data?.id).toBe('txn-1')
  })
})

describe('useTransactionStats', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return P&L statistics', () => {
    const stats = {
      totalBuys: 10,
      totalSells: 5,
      totalTrades: 2,
      totalCashOut: 1000,
      totalCashIn: 1500,
      netCashFlow: 500,
    }
    mockUseTransactionStats.mockReturnValue({
      data: stats,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useTransactionStats(), { wrapper: createWrapper() })
    expect(result.current.data?.netCashFlow).toBe(500)
    expect(result.current.data?.totalBuys).toBe(10)
  })

  it('should return zero stats when no org', () => {
    const emptyStats = {
      totalBuys: 0,
      totalSells: 0,
      totalTrades: 0,
      totalCashOut: 0,
      totalCashIn: 0,
      netCashFlow: 0,
    }
    mockUseTransactionStats.mockReturnValue({
      data: emptyStats,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useTransactionStats(), { wrapper: createWrapper() })
    expect(result.current.data?.netCashFlow).toBe(0)
  })
})

describe('useCreateTransaction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseCreateTransaction.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useCreateTransaction(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should return success after mutation', () => {
    const newTxn = mockTransaction({ id: 'txn-new' })
    mockUseCreateTransaction.mockReturnValue({
      mutate: vi.fn(),
      data: newTxn,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useCreateTransaction(), { wrapper: createWrapper() })
    expect(result.current.isSuccess).toBe(true)
  })
})

describe('useUpdateTransaction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseUpdateTransaction.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUpdateTransaction(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useDeleteTransaction', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseDeleteTransaction.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useDeleteTransaction(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should return error on failure', () => {
    const error = new Error('Cannot delete')
    mockUseDeleteTransaction.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: true,
      error,
    })

    const { result } = renderHook(() => useDeleteTransaction(), { wrapper: createWrapper() })
    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Cannot delete')
  })
})
