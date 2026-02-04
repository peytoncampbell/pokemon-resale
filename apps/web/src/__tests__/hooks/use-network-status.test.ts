import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// We need to mock this before importing
vi.mock('@/hooks/use-network-status', async () => {
  const actual = await vi.importActual<typeof import('@/hooks/use-network-status')>('@/hooks/use-network-status')
  return actual
})

import { useNetworkStatus } from '@/hooks/use-network-status'

describe('useNetworkStatus', () => {
  let originalOnLine: boolean
  let listeners: Record<string, Array<() => void>>

  beforeEach(() => {
    originalOnLine = navigator.onLine
    listeners = { online: [], offline: [] }

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    // Mock addEventListener
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'online' || event === 'offline') {
        listeners[event].push(handler as () => void)
      }
    })

    vi.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
      if (event === 'online' || event === 'offline') {
        listeners[event] = listeners[event].filter((h) => h !== handler)
      }
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      writable: true,
      configurable: true,
    })
    vi.restoreAllMocks()
  })

  it('should return online status initially', () => {
    const { result } = renderHook(() => useNetworkStatus())
    expect(result.current.isOnline).toBe(true)
  })

  it('should detect offline', () => {
    const { result } = renderHook(() => useNetworkStatus())

    act(() => {
      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })
      listeners.offline.forEach((handler) => handler())
    })

    expect(result.current.isOnline).toBe(false)
  })

  it('should detect coming back online', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })

    const { result } = renderHook(() => useNetworkStatus())

    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
      listeners.online.forEach((handler) => handler())
    })

    expect(result.current.isOnline).toBe(true)
  })

  it('should register event listeners', () => {
    renderHook(() => useNetworkStatus())

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should cleanup event listeners on unmount', () => {
    const { unmount } = renderHook(() => useNetworkStatus())
    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})
