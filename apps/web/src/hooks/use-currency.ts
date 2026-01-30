'use client'

import { useState, useEffect, useCallback } from 'react'

export type Currency = 'USD' | 'CAD' | 'GBP' | 'EUR'
export type Locale = 'en-US' | 'en-CA' | 'en-GB' | 'de-DE' | 'fr-FR'

const CURRENCY_STORAGE_KEY = 'preferred-currency'
const LOCALE_STORAGE_KEY = 'preferred-locale'
const DEFAULT_CURRENCY: Currency = 'CAD'
const DEFAULT_LOCALE: Locale = 'en-CA'

// Currency to locale mapping for sensible defaults
const CURRENCY_LOCALE_MAP: Record<Currency, Locale> = {
  USD: 'en-US',
  CAD: 'en-CA',
  GBP: 'en-GB',
  EUR: 'de-DE',
}

// Currency symbols for quick reference
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CAD: 'C$',
  GBP: '£',
  EUR: '€',
}

// Exchange rates relative to USD (for display purposes)
// In production, these would be fetched from an API
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.0,
  CAD: 1.36,
  GBP: 0.79,
  EUR: 0.92,
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY)
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null

    if (storedCurrency && isValidCurrency(storedCurrency)) {
      setCurrencyState(storedCurrency)
    }
    if (storedLocale && isValidLocale(storedLocale)) {
      setLocaleState(storedLocale)
    } else if (storedCurrency && isValidCurrency(storedCurrency)) {
      // Set locale based on currency if no locale stored
      setLocaleState(CURRENCY_LOCALE_MAP[storedCurrency])
    }
    setIsLoaded(true)
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
    // Update locale to match currency
    const newLocale = CURRENCY_LOCALE_MAP[newCurrency]
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  const toggleCurrency = useCallback(() => {
    const currencies: Currency[] = ['CAD', 'USD', 'GBP', 'EUR']
    const currentIndex = currencies.indexOf(currency)
    const nextIndex = (currentIndex + 1) % currencies.length
    setCurrency(currencies[nextIndex])
  }, [currency, setCurrency])

  // Format a price in the current currency/locale
  const formatPrice = useCallback(
    (amount: number, options?: { showSymbol?: boolean; decimals?: number }) => {
      const { showSymbol = true, decimals = 2 } = options || {}

      if (showSymbol) {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(amount)
      }

      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(amount)
    },
    [currency, locale]
  )

  // Format a number with locale-specific separators
  const formatNumber = useCallback(
    (value: number, options?: { decimals?: number }) => {
      const { decimals } = options || {}

      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
    },
    [locale]
  )

  // Convert from USD to current currency (for display)
  const convertFromUSD = useCallback(
    (usdAmount: number): number => {
      return usdAmount * EXCHANGE_RATES[currency]
    },
    [currency]
  )

  // Convert to USD from current currency
  const convertToUSD = useCallback(
    (amount: number): number => {
      return amount / EXCHANGE_RATES[currency]
    },
    [currency]
  )

  return {
    currency,
    locale,
    setCurrency,
    setLocale,
    toggleCurrency,
    formatPrice,
    formatNumber,
    convertFromUSD,
    convertToUSD,
    isLoaded,
    symbol: CURRENCY_SYMBOLS[currency],
    exchangeRate: EXCHANGE_RATES[currency],
  }
}

// Type guards
function isValidCurrency(value: string): value is Currency {
  return ['USD', 'CAD', 'GBP', 'EUR'].includes(value)
}

function isValidLocale(value: string): value is Locale {
  return ['en-US', 'en-CA', 'en-GB', 'de-DE', 'fr-FR'].includes(value)
}
