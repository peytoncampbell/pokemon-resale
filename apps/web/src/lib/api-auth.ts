import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Verify authentication for API routes (server-side only)
 * Returns the user if authenticated, null otherwise
 */
export async function verifyApiAuth(): Promise<{ id: string; email?: string } | null> {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) return null

    // Try parsing the auth token cookie (Supabase stores it as JSON)
    const allCookies = cookieStore.getAll()
    const authCookie = allCookies.find(c => c.name.includes('auth-token'))

    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie.value)
        if (parsed?.access_token) {
          const client = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${parsed.access_token}` } }
          })
          const { data: { user } } = await client.auth.getUser()
          return user ? { id: user.id, email: user.email ?? undefined } : null
        }
      } catch {
        // Cookie parsing failed, try other formats
      }
    }

    // Try direct access token cookie
    const accessToken = cookieStore.get('sb-access-token')?.value
    if (accessToken) {
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${accessToken}` } }
      })
      const { data: { user } } = await client.auth.getUser()
      return user ? { id: user.id, email: user.email ?? undefined } : null
    }

    return null
  } catch {
    return null
  }
}
