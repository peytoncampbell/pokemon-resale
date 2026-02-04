import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import { getCurrentUserId } from '@/lib/auth-helpers'

export interface AuditLogEntry {
  id: string
  organization_id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// Type assertion for audit_log table (not yet in generated types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export function useLogAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      action,
      entityType,
      entityId,
      metadata,
    }: {
      action: string
      entityType: string
      entityId?: string
      metadata?: Record<string, unknown>
    }) => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return null

      const { error } = await db.from('audit_log').insert({
        organization_id: orgId,
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        metadata: metadata || {},
      })

      if (error) {
        // Audit logging should not break the app — log and continue
        console.error('Audit log insert error:', error)
        return null
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-log'] })
    },
  })
}

export function useAuditLog(limit = 50) {
  return useQuery({
    queryKey: ['audit-log', limit],
    queryFn: async (): Promise<AuditLogEntry[]> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data, error } = await db
        .from('audit_log')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data as AuditLogEntry[]
    },
  })
}
