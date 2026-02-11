/**
 * In-memory rate limiter with sliding window
 * Tracks requests per IP address with automatic cleanup
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetAt) {
        this.requests.delete(key)
      }
    }
  }

  check(identifier: string): { limited: boolean; retryAfter?: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // No entry or window expired - allow request
    if (!entry || now >= entry.resetAt) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.config.windowMs,
      })
      return { limited: false }
    }

    // Within window - check limit
    if (entry.count < this.config.maxRequests) {
      entry.count++
      return { limited: false }
    }

    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { limited: true, retryAfter }
  }

  reset(identifier: string): void {
    this.requests.delete(identifier)
  }
}

// Rate limiters for different endpoints
export const authLimiter = new RateLimiter({
  maxRequests: 5,           // 5 attempts per window
  windowMs: 60 * 1000,      // 1 minute window
})

export const apiLimiter = new RateLimiter({
  maxRequests: 20,          // 20 requests per window
  windowMs: 60 * 1000,      // 1 minute window
})

/**
 * Extract IP address from request headers
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers)
  
  // Try various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a placeholder (shouldn't happen in production)
  return 'unknown'
}
