// Shared Scraper Utilities
// Retry logic, anti-detection, delays, and timeout handling for web scrapers

/**
 * Retry options for exponential backoff
 */
export interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
}

/**
 * Retry a function with exponential backoff
 * Delay formula: min(baseDelay * 2^attempt + jitter, maxDelay)
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay } = options
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries) {
        break // Don't delay after final attempt
      }

      // Calculate exponential backoff with jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt)
      const jitter = Math.random() * 1000 // 0-1000ms random jitter
      const delay = Math.min(exponentialDelay + jitter, maxDelay)

      console.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms delay. Error: ${error}`
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Random human-like delay between requests
 * Helps avoid rate limiting and detection
 */
export async function humanDelay(minMs = 500, maxMs = 2000): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs
  await new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Create a stealth browser context with anti-detection measures
 * For use with Playwright browsers
 */
export async function createStealthContext(browser: any) {
  return await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      DNT: '1',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
    },
  })
}

/**
 * Wrap a promise with a timeout
 * Rejects if the promise doesn't resolve within the timeout period
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label = 'Operation'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ])
}
