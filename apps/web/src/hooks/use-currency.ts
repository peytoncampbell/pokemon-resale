'use client'

import { useState, useEffect, useCallback } from 'react'

export type Currency = 'USD' | 'CAD'

const STORAGE_KEY = 'preferred-currency'
const DEFAULT_CURRENCY: Currency = 'CAD'

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Currency | null
    if (stored === 'USD' || stored === 'CAD') {
      setCurrencyState(stored)
    }
    setIsLoaded(true)
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(STORAGE_KEY, newCurrency)
  }, [])

  const toggleCurrency = useCallback(() => {
    const newCurrency = currency === 'CAD' ? 'USD' : 'CAD'
    setCurrency(newCurrency)
  }, [currency, setCurrency])

  return {
    currency,
    setCurrency,
    toggleCurrency,
    isLoaded,
  }
}
