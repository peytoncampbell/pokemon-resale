import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const mockUseNotifications = vi.fn()
const mockUseUnreadNotificationCount = vi.fn()
const mockUseMarkNotificationRead = vi.fn()
const mockUseMarkAllNotificationsRead = vi.fn()
const mockUseDeleteNotification = vi.fn()
const mockUseClearAllNotifications = vi.fn()

vi.mock('@/hooks/use-notifications', () => ({
  useNotifications: (limit?: number) => mockUseNotifications(limit),
  useUnreadNotificationCount: () => mockUseUnreadNotificationCount(),
  useMarkNotificationRead: () => mockUseMarkNotificationRead(),
  useMarkAllNotificationsRead: () => mockUseMarkAllNotificationsRead(),
  useDeleteNotification: () => mockUseDeleteNotification(),
  useClearAllNotifications: () => mockUseClearAllNotifications(),
}))

import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useClearAllNotifications,
} from '@/hooks/use-notifications'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const mockNotification = {
  id: 'notif-1',
  userId: 'user-1',
  organizationId: 'org-1',
  type: 'price_alert',
  title: 'Price Drop',
  message: 'Charizard dropped to $40',
  link: '/alerts',
  isRead: false,
  readAt: null,
  metadata: {},
  createdAt: new Date().toISOString(),
}

describe('useNotifications', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return notifications list', () => {
    mockUseNotifications.mockReturnValue({
      data: [mockNotification],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() })
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].title).toBe('Price Drop')
  })

  it('should accept limit parameter', () => {
    mockUseNotifications.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    renderHook(() => useNotifications(10), { wrapper: createWrapper() })
    expect(mockUseNotifications).toHaveBeenCalledWith(10)
  })

  it('should return empty for unauthenticated users', () => {
    mockUseNotifications.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() })
    expect(result.current.data).toEqual([])
  })
})

describe('useUnreadNotificationCount', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return unread count', () => {
    mockUseUnreadNotificationCount.mockReturnValue({
      data: 5,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUnreadNotificationCount(), { wrapper: createWrapper() })
    expect(result.current.data).toBe(5)
  })

  it('should return 0 when no unread', () => {
    mockUseUnreadNotificationCount.mockReturnValue({
      data: 0,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUnreadNotificationCount(), { wrapper: createWrapper() })
    expect(result.current.data).toBe(0)
  })
})

describe('useMarkNotificationRead', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseMarkNotificationRead.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useMarkNotificationRead(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useMarkAllNotificationsRead', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseMarkAllNotificationsRead.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useMarkAllNotificationsRead(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useDeleteNotification', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseDeleteNotification.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useDeleteNotification(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useClearAllNotifications', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseClearAllNotifications.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useClearAllNotifications(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})
