import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default locale for server-side rendering
const DEFAULT_LOCALE = 'en-US'
const DEFAULT_CURRENCY = 'USD'

/**
 * Format a currency value with proper locale formatting
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format a number with locale-specific thousands separators
 */
export function formatNumber(
  value: number,
  locale: string = DEFAULT_LOCALE,
  options?: { decimals?: number; compact?: boolean }
): string {
  const { decimals, compact } = options || {}

  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format a date with locale-specific formatting
 */
export function formatDate(
  date: Date | string,
  locale: string = DEFAULT_LOCALE,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(new Date(date))
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = DEFAULT_LOCALE
): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute')
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour')
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day')
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month')
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return rtf.format(-diffInYears, 'year')
}

/**
 * Format a percentage value
 */
export function formatPercent(
  value: number,
  locale: string = DEFAULT_LOCALE,
  options?: { decimals?: number; showSign?: boolean }
): string {
  const { decimals = 1, showSign = false } = options || {}

  const formatted = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)

  if (showSign && value > 0) {
    return `+${formatted}`
  }

  return formatted
}

/**
 * Calculate profit from revenue and cost
 */
export function calculateProfit(revenue: number, cost: number): number {
  return revenue - cost
}

/**
 * Calculate profit margin as a percentage
 */
export function calculateMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0
  return ((revenue - cost) / revenue) * 100
}

/**
 * Calculate ROI (Return on Investment) as a percentage
 */
export function calculateROI(profit: number, cost: number): number {
  if (cost === 0) return 0
  return (profit / cost) * 100
}

/**
 * Parse a price string to a number
 */
export function parsePrice(priceString: string): number | null {
  // Remove currency symbols and whitespace
  const cleaned = priceString.replace(/[^0-9.,\-]/g, '')

  // Handle different decimal separators
  // If there's both comma and period, assume last one is decimal
  const hasComma = cleaned.includes(',')
  const hasPeriod = cleaned.includes('.')

  let normalized = cleaned

  if (hasComma && hasPeriod) {
    // Figure out which is the decimal separator
    const lastComma = cleaned.lastIndexOf(',')
    const lastPeriod = cleaned.lastIndexOf('.')

    if (lastComma > lastPeriod) {
      // Comma is decimal separator (European format)
      normalized = cleaned.replace(/\./g, '').replace(',', '.')
    } else {
      // Period is decimal separator (US format)
      normalized = cleaned.replace(/,/g, '')
    }
  } else if (hasComma) {
    // Could be thousands separator or decimal
    // If exactly 2 digits after comma, treat as decimal
    const afterComma = cleaned.split(',')[1]
    if (afterComma && afterComma.length === 2) {
      normalized = cleaned.replace(',', '.')
    } else {
      normalized = cleaned.replace(/,/g, '')
    }
  }

  const parsed = parseFloat(normalized)
  return isNaN(parsed) ? null : parsed
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Group an array by a key
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}
