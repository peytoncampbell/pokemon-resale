'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

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

// Base currency that data is stored in (TCGPlayer prices are USD)
const BASE_CURRENCY: Currency = 'USD'

// Exchange rates relative to USD (for display purposes)
// In production, these would be fetched from an API
const EXCHANGE_RATES_TO_USD: Record<Currency, number> = {
  USD: 1.0,
  CAD: 0.74,  // 1 CAD = 0.74 USD
  GBP: 1.27,  // 1 GBP = 1.27 USD
  EUR: 1.09,  // 1 EUR = 1.09 USD
}

interface CurrencyContextType {
  currency: Currency
  locale: Locale
  baseCurrency: Currency
  setCurrency: (currency: Currency) => void
  setLocale: (locale: Locale) => void
  toggleCurrency: () => void
  formatPrice: (amount: number, options?: { showSymbol?: boolean; decimals?: number }) => string
  formatNumber: (value: number, options?: { decimals?: number }) => string
  convertFromBase: (baseAmount: number) => number
  convertToBase: (amount: number) => number
  formatConverted: (baseAmount: number, options?: { showSymbol?: boolean; decimals?: number }) => string
  isLoaded: boolean
  symbol: string
  exchangeRate: number
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
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
      setLocaleState(CURRENCY_LOCALE_MAP[storedCurrency])
    }
    setIsLoaded(true)
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
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

  const convertFromBase = useCallback(
    (baseAmount: number): number => {
      if (currency === BASE_CURRENCY) return baseAmount
      const usdAmount = baseAmount * EXCHANGE_RATES_TO_USD[BASE_CURRENCY]
      return usdAmount / EXCHANGE_RATES_TO_USD[currency]
    },
    [currency]
  )

  const convertToBase = useCallback(
    (amount: number): number => {
      if (currency === BASE_CURRENCY) return amount
      const usdAmount = amount * EXCHANGE_RATES_TO_USD[currency]
      return usdAmount / EXCHANGE_RATES_TO_USD[BASE_CURRENCY]
    },
    [currency]
  )

  const formatConverted = useCallback(
    (baseAmount: number, options?: { showSymbol?: boolean; decimals?: number }) => {
      const converted = convertFromBase(baseAmount)
      return formatPrice(converted, options)
    },
    [convertFromBase, formatPrice]
  )

  const value: CurrencyContextType = {
    currency,
    locale,
    baseCurrency: BASE_CURRENCY,
    setCurrency,
    setLocale,
    toggleCurrency,
    formatPrice,
    formatNumber,
    convertFromBase,
    convertToBase,
    formatConverted,
    isLoaded,
    symbol: CURRENCY_SYMBOLS[currency],
    exchangeRate: EXCHANGE_RATES_TO_USD[currency],
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

// Type guards
function isValidCurrency(value: string): value is Currency {
  return ['USD', 'CAD', 'GBP', 'EUR'].includes(value)
}

function isValidLocale(value: string): value is Locale {
  return ['en-US', 'en-CA', 'en-GB', 'de-DE', 'fr-FR'].includes(value)
}
