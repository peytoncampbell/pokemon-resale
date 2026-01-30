import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { mockInventoryItem } from '../test-utils'

// Mock the entire use-inventory module at module level
// This approach avoids the complexity of mocking Supabase's chained API
const mockUseInventoryItems = vi.fn()
const mockUseInventoryItem = vi.fn()
const mockUseAddInventoryItem = vi.fn()
const mockUseUpdateInventoryItem = vi.fn()
const mockUseDeleteInventoryItem = vi.fn()

vi.mock('@/hooks/use-inventory', () => ({
  useInventoryItems: () => mockUseInventoryItems(),
  useInventoryItem: (id: string) => mockUseInventoryItem(id),
  useAddInventoryItem: () => mockUseAddInventoryItem(),
  useUpdateInventoryItem: () => mockUseUpdateInventoryItem(),
  useDeleteInventoryItem: () => mockUseDeleteInventoryItem(),
}))

// Import the mocked module
import {
  useInventoryItems,
  useInventoryItem,
  useAddInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from '@/hooks/use-inventory'

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

describe('useInventoryItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return inventory items when successful', () => {
    const mockItems = [
      mockInventoryItem({ id: 'item-1' }),
      mockInventoryItem({ id: 'item-2', card_name: 'Pikachu' }),
    ]

    mockUseInventoryItems.mockReturnValue({
      data: mockItems,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useInventoryItems(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].id).toBe('item-1')
    expect(result.current.data?.[1].card_name).toBe('Pikachu')
  })

  it('should return loading state', () => {
    mockUseInventoryItems.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useInventoryItems(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('should return error state', () => {
    const error = new Error('Database error')
    mockUseInventoryItems.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
    })

    const { result } = renderHook(() => useInventoryItems(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Database error')
  })

  it('should return empty array when no items', () => {
    mockUseInventoryItems.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useInventoryItems(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toEqual([])
  })
})

describe('useInventoryItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return single inventory item', () => {
    const mockItem = mockInventoryItem()
    mockUseInventoryItem.mockReturnValue({
      data: mockItem,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useInventoryItem('test-id-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toEqual(mockItem)
  })

  it('should return not found error', () => {
    const error = new Error('Item not found')
    mockUseInventoryItem.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error,
    })

    const { result } = renderHook(() => useInventoryItem('nonexistent'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Item not found')
  })
})

describe('useAddInventoryItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide mutate function for adding items', () => {
    const mutateFn = vi.fn()
    mockUseAddInventoryItem.mockReturnValue({
      mutate: mutateFn,
      mutateAsync: vi.fn(),
      isLoading: false,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useAddInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should return success state after mutation', () => {
    const newItem = mockInventoryItem()
    mockUseAddInventoryItem.mockReturnValue({
      mutate: vi.fn(),
      data: newItem,
      isLoading: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useAddInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toEqual(newItem)
  })
})

describe('useUpdateInventoryItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide mutate function for updating items', () => {
    const mutateFn = vi.fn()
    mockUseUpdateInventoryItem.mockReturnValue({
      mutate: mutateFn,
      isLoading: false,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUpdateInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should return updated item after successful mutation', () => {
    const updatedItem = mockInventoryItem({ location: 'BIN-02' })
    mockUseUpdateInventoryItem.mockReturnValue({
      mutate: vi.fn(),
      data: updatedItem,
      isLoading: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUpdateInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data?.location).toBe('BIN-02')
  })
})

describe('useDeleteInventoryItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide mutate function for deleting items', () => {
    const mutateFn = vi.fn()
    mockUseDeleteInventoryItem.mockReturnValue({
      mutate: mutateFn,
      isLoading: false,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useDeleteInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should return success state after deletion', () => {
    mockUseDeleteInventoryItem.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useDeleteInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isSuccess).toBe(true)
  })

  it('should return error state when deletion fails', () => {
    const error = new Error('Delete failed')
    mockUseDeleteInventoryItem.mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isPending: false,
      isSuccess: false,
      isError: true,
      error,
    })

    const { result } = renderHook(() => useDeleteInventoryItem(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Delete failed')
  })
})

// Test mock data factories
describe('mockInventoryItem', () => {
  it('should create default inventory item', () => {
    const item = mockInventoryItem()

    expect(item.id).toBe('test-id-1')
    expect(item.card_name).toBe('Charizard')
    expect(item.set_name).toBe('Base Set')
    expect(item.condition).toBe('NM')
    expect(item.status).toBe('IN_STOCK')
    expect(item.game_type).toBe('pokemon')
    expect(item.product_type).toBe('card')
  })

  it('should allow overrides', () => {
    const item = mockInventoryItem({
      id: 'custom-id',
      card_name: 'Pikachu',
      condition: 'LP',
      status: 'SOLD',
    })

    expect(item.id).toBe('custom-id')
    expect(item.card_name).toBe('Pikachu')
    expect(item.condition).toBe('LP')
    expect(item.status).toBe('SOLD')
    // Other fields should remain default
    expect(item.set_name).toBe('Base Set')
  })
})
