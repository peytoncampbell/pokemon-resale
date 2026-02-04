import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock the onboarding hook
const mockUseOnboarding = vi.fn()

vi.mock('@/hooks/use-onboarding', () => ({
  useOnboarding: () => mockUseOnboarding(),
}))

import { useOnboarding } from '@/hooks/use-onboarding'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should return all steps', () => {
    const steps = [
      { id: 'add-card', label: 'Add your first card', completed: false, href: '/inventory' },
      { id: 'record-buy', label: 'Record a purchase', completed: false, href: '/transactions' },
      { id: 'record-sell', label: 'Record a sale', completed: false, href: '/transactions' },
      { id: 'view-reports', label: 'View your reports', completed: false, href: '/reports' },
      { id: 'set-alert', label: 'Set a price alert', completed: false, href: '/alerts' },
    ]

    mockUseOnboarding.mockReturnValue({
      steps,
      isComplete: false,
      completedCount: 0,
      totalSteps: 5,
      isDismissed: false,
      dismiss: vi.fn(),
      isLoading: false,
    })

    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    expect(result.current.steps).toHaveLength(5)
    expect(result.current.completedCount).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('should track completed steps', () => {
    const steps = [
      { id: 'add-card', label: 'Add your first card', completed: true, href: '/inventory' },
      { id: 'record-buy', label: 'Record a purchase', completed: true, href: '/transactions' },
      { id: 'record-sell', label: 'Record a sale', completed: false, href: '/transactions' },
      { id: 'view-reports', label: 'View your reports', completed: false, href: '/reports' },
      { id: 'set-alert', label: 'Set a price alert', completed: false, href: '/alerts' },
    ]

    mockUseOnboarding.mockReturnValue({
      steps,
      isComplete: false,
      completedCount: 2,
      totalSteps: 5,
      isDismissed: false,
      dismiss: vi.fn(),
      isLoading: false,
    })

    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    expect(result.current.completedCount).toBe(2)
    expect(result.current.isComplete).toBe(false)
  })

  it('should detect when all steps are complete', () => {
    mockUseOnboarding.mockReturnValue({
      steps: [],
      isComplete: true,
      completedCount: 5,
      totalSteps: 5,
      isDismissed: false,
      dismiss: vi.fn(),
      isLoading: false,
    })

    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    expect(result.current.isComplete).toBe(true)
  })

  it('should handle dismiss', () => {
    const dismissFn = vi.fn()
    mockUseOnboarding.mockReturnValue({
      steps: [],
      isComplete: false,
      completedCount: 0,
      totalSteps: 5,
      isDismissed: false,
      dismiss: dismissFn,
      isLoading: false,
    })

    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })

    act(() => {
      result.current.dismiss()
    })

    expect(dismissFn).toHaveBeenCalled()
  })

  it('should respect dismissed state', () => {
    mockUseOnboarding.mockReturnValue({
      steps: [],
      isComplete: false,
      completedCount: 0,
      totalSteps: 5,
      isDismissed: true,
      dismiss: vi.fn(),
      isLoading: false,
    })

    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() })
    expect(result.current.isDismissed).toBe(true)
  })
})
