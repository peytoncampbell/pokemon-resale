import { supabase } from './supabase'

/**
 * Get the current authenticated user's ID
 * @throws Error if user is not authenticated
 */
export async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

/**
 * Get the current authenticated user's email
 * @throws Error if user is not authenticated or has no email
 */
export async function getCurrentUserEmail(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) throw new Error('Not authenticated')
  return user.email
}

/**
 * Get the current authenticated user object
 * @throws Error if user is not authenticated
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}
