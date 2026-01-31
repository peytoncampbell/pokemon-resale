import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import { getCurrentUserId } from '@/lib/auth-helpers'
import type { Notification, CreateNotificationInput } from '@/types/price-intelligence'

// Database row type
interface NotificationRow {
  id: string
  user_id: string
  organization_id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  read_at: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// Transform database row to frontend type
function transformNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    organizationId: row.organization_id,
    type: row.type as Notification['type'],
    title: row.title,
    message: row.message,
    link: row.link,
    isRead: row.is_read,
    readAt: row.read_at,
    metadata: row.metadata,
    createdAt: row.created_at,
  }
}

export function useNotifications(limit: number = 50) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications', limit],
    queryFn: async (): Promise<Notification[]> => {
      const userId = await getCurrentUserId()
      if (!userId) return []

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data as NotificationRow[]).map(transformNotification)
    },
  })

  // Subscribe to real-time notifications
  useEffect(() => {
    const setupSubscription = async () => {
      const userId = await getCurrentUserId()
      if (!userId) return

      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            // Invalidate and refetch notifications
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    setupSubscription()
  }, [queryClient])

  return query
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async (): Promise<number> => {
      const userId = await getCurrentUserId()
      if (!userId) return 0

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error

      return count ?? 0
    },
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useClearAllNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// Create notification (for internal use)
export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateNotificationInput): Promise<Notification> => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!userId || !orgId) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          organization_id: orgId,
          type: input.type,
          title: input.title,
          message: input.message,
          link: input.link || null,
          metadata: input.metadata || {},
        })
        .select()
        .single()

      if (error) throw error

      return transformNotification(data as NotificationRow)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
