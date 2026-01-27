import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, ProcurementAttachment } from '@/lib/supabase'

export type { ProcurementAttachment }

const BUCKET_NAME = 'procurement-attachments'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

export function useAttachments(procurementId: string) {
  return useQuery({
    queryKey: ['attachments', procurementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('procurement_attachments')
        .select('*')
        .eq('procurement_id', procurementId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ProcurementAttachment[]
    },
    enabled: !!procurementId,
  })
}

export function useUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      procurementId,
      file,
    }: {
      procurementId: string
      file: File
    }) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 10MB limit')
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('File type not allowed. Please upload images or PDFs only.')
      }

      const userId = await getCurrentUserId()
      const fileExt = file.name.split('.').pop()
      const fileName = `${procurementId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: result, error: insertError } = await supabase
        .from('procurement_attachments')
        .insert([{
          procurement_id: procurementId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: fileName,
          uploaded_by: userId,
        }])
        .select()
        .single()

      if (insertError) {
        await supabase.storage.from(BUCKET_NAME).remove([fileName])
        throw insertError
      }

      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attachments', variables.procurementId] })
    },
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      storagePath,
      procurementId,
    }: {
      id: string
      storagePath: string
      procurementId: string
    }) => {
      const { error: deleteStorageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath])

      if (deleteStorageError) {
        console.error('Failed to delete file from storage:', deleteStorageError)
      }

      const { error: deleteRecordError } = await supabase
        .from('procurement_attachments')
        .delete()
        .eq('id', id)

      if (deleteRecordError) throw deleteRecordError

      return procurementId
    },
    onSuccess: (procurementId) => {
      queryClient.invalidateQueries({ queryKey: ['attachments', procurementId] })
    },
  })
}

export function useGetAttachmentUrl() {
  return useMutation({
    mutationFn: async (storagePath: string) => {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(storagePath, 3600)

      if (error) throw error
      return data.signedUrl
    },
  })
}
