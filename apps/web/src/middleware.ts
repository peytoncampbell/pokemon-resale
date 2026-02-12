import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authLimiter, apiLimiter, getClientIp } from '@/lib/rate-limiter'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIp = getClientIp(request)

  // Apply rate limiting to auth endpoints
  if (pathname === '/login' || pathname === '/signup' || pathname === '/api/auth') {
    const { limited, retryAfter } = authLimiter.check(clientIp)
    if (limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter || 60),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const { limited, retryAfter } = apiLimiter.check(clientIp)
    if (limited) {
      return NextResponse.json(
        { error: 'Too many API requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter || 60),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  // Content Security Policy
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseDomain = supabaseUrl ? new URL(supabaseUrl).hostname : ''

  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://images.pokemontcg.io https://tcgplayer-cdn.tcgplayer.com https://storage.googleapis.com https://grainy-gradients.vercel.app${supabaseDomain ? ` https://${supabaseDomain}` : ''}`,
    `font-src 'self'`,
    `connect-src 'self'${supabaseDomain ? ` https://${supabaseDomain} wss://${supabaseDomain}` : ''} https://api.justtcg.com`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
