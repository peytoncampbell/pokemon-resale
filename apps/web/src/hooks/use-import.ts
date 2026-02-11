import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ImportRow } from '@/lib/pnl/types'
import { fetchWithTimeout, TIMEOUTS } from '@/lib/fetch-with-timeout'

// Helper to get auth headers from Supabase session
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

interface ImportUploadResponse {
  session_id: string
  total_rows: number
}

interface ImportPreviewResponse {
  session_id: string
  total_rows: number
  valid_rows: number
  invalid_rows: number
  rows: ImportRow[]
}

interface ImportCommitResponse {
  imported_count: number
  inventory_ids: string[]
}

/**
 * useImportUpload - Mutation to upload CSV/XLSX file
 */
export function useImportUpload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<ImportUploadResponse> => {
      const authHeaders = await getAuthHeaders()
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetchWithTimeout('/api/inventory/import', {
        timeoutMs: TIMEOUTS.UPLOADS,
        method: 'POST',
        headers: authHeaders,
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload file')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate import previews
      queryClient.invalidateQueries({ queryKey: ['import', 'preview'] })
    },
  })
}

/**
 * useImportPreview - Query for import validation results
 */
export function useImportPreview(sessionId: string | null) {
  return useQuery({
    queryKey: ['import', 'preview', sessionId],
    queryFn: async (): Promise<ImportPreviewResponse> => {
      if (!sessionId) {
        throw new Error('Session ID is required')
      }

      const authHeaders = await getAuthHeaders()
      const params = new URLSearchParams()
      params.set('session_id', sessionId)

      const response = await fetchWithTimeout(`/api/inventory/import/preview?${params}`, {
        timeoutMs: TIMEOUTS.DEFAULT,
        headers: authHeaders,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch preview')
      }

      return response.json()
    },
    enabled: !!sessionId,
  })
}

/**
 * useImportCommit - Mutation to commit valid rows from staging
 */
export function useImportCommit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string): Promise<ImportCommitResponse> => {
      const authHeaders = await getAuthHeaders()
      const response = await fetchWithTimeout('/api/inventory/import/commit', {
        timeoutMs: TIMEOUTS.DEFAULT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ session_id: sessionId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to commit import')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate inventory and related queries
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      queryClient.invalidateQueries({ queryKey: ['pnl'] })
      queryClient.invalidateQueries({ queryKey: ['import', 'preview'] })
    },
  })
}
