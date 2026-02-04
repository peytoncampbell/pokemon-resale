import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ReactNode, createElement } from 'react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

import { CurrencyProvider, useCurrency } from '@/components/providers/currency-provider'

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(CurrencyProvider, null, children)
  }
}

describe('useCurrency', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should default to CAD currency', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })
    expect(result.current.currency).toBe('CAD')
    expect(result.current.baseCurrency).toBe('CAD')
  })

  it('should format prices correctly', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })
    const formatted = result.current.formatPrice(100)
    expect(formatted).toContain('100')
  })

  it('should format prices without symbol', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })
    const formatted = result.current.formatPrice(100, { showSymbol: false })
    expect(formatted).toContain('100')
    expect(formatted).not.toContain('$')
  })

  it('should format numbers', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })
    const formatted = result.current.formatNumber(1234.5, { decimals: 1 })
    expect(formatted).toContain('1')
  })

  it('should toggle currency', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })

    act(() => {
      result.current.toggleCurrency()
    })

    // CAD -> USD -> GBP -> EUR -> CAD cycle
    expect(result.current.currency).toBe('USD')
  })

  it('should set currency', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })

    act(() => {
      result.current.setCurrency('GBP')
    })

    expect(result.current.currency).toBe('GBP')
    expect(result.current.symbol).toBe('£')
  })

  it('should convert from base currency', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })

    // When currency is CAD (base), conversion should be identity
    const converted = result.current.convertFromBase(100)
    expect(converted).toBe(100)
  })

  it('should convert to base currency', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })

    const converted = result.current.convertToBase(100)
    expect(converted).toBe(100)
  })

  it('should provide exchange rate', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper: createWrapper() })
    expect(typeof result.current.exchangeRate).toBe('number')
    expect(result.current.exchangeRate).toBeGreaterThan(0)
  })

  it('should throw when used outside provider', () => {
    expect(() => {
      renderHook(() => useCurrency())
    }).toThrow('useCurrency must be used within a CurrencyProvider')
  })
})
