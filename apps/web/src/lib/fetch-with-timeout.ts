/**
 * Fetch wrapper with configurable timeout
 * Automatically aborts requests that exceed the timeout duration
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number
}

/**
 * Fetch with automatic timeout and abort
 * @param url - URL to fetch
 * @param options - Fetch options including optional timeoutMs
 * @returns Promise<Response>
 * @throws {Error} - Throws if timeout exceeded or fetch fails
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options

  // Create an AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Handle abort errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`)
    }
    
    throw error
  }
}

/**
 * Fetch with retry logic and timeout
 * Useful for external APIs that may have transient failures
 */
export async function fetchWithRetryAndTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {},
  maxRetries = 3
): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, { ...fetchOptions, timeoutMs })

      // Only retry on 429 or 5xx errors
      if (response.ok || (response.status < 500 && response.status !== 429)) {
        return response
      }

      if (attempt === maxRetries) {
        return response
      }

      // Handle 429 with Retry-After header
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(1000 * 2 ** attempt, 8000)

        console.warn(
          `Request failed with 429, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`
        )
        await new Promise((resolve) => setTimeout(resolve, waitMs))
        continue
      }

      // Exponential backoff for 5xx errors
      const waitMs = Math.min(1000 * 2 ** attempt, 8000)
      console.warn(
        `Request failed with ${response.status}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`
      )
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      // Exponential backoff on errors
      const waitMs = Math.min(1000 * 2 ** attempt, 8000)
      console.warn(
        `Request failed with error, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`,
        error
      )
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }
  }

  // Unreachable, but TypeScript needs it
  throw new Error('Retry logic failed')
}

/**
 * Preset timeouts for common use cases
 */
export const TIMEOUTS = {
  DEFAULT: 10000,       // 10s for standard API calls
  SCRAPING: 30000,      // 30s for web scraping/heavy operations
  FAST: 5000,           // 5s for quick lookups
  UPLOADS: 60000,       // 60s for file uploads
} as const
