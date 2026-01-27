'use client'

import { useCallback, useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number
  disabled?: boolean
}

export function FileUpload({
  onUpload,
  accept = 'image/*,.pdf',
  maxSize = 10 * 1024 * 1024,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)

    if (file.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
      return
    }

    setIsUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [maxSize, onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  return (
    <div className="space-y-2">
      <label
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors cursor-pointer',
          isDragging
            ? 'border-vision-cyan bg-vision-cyan/10'
            : 'border-white/20 hover:border-white/40 bg-white/5',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled && !isUploading) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled || isUploading}
          className="sr-only"
        />

        <div className="flex flex-col items-center gap-2 text-white/60">
          {isUploading ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-vision-cyan border-r-transparent" />
              <p className="text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <p className="text-sm">
                <span className="text-vision-cyan font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-white/40">Images or PDF up to {Math.round(maxSize / 1024 / 1024)}MB</p>
            </>
          )}
        </div>
      </label>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

interface FilePreviewProps {
  fileName: string
  fileType: string
  fileSize: number
  onRemove?: () => void
  onClick?: () => void
}

export function FilePreview({ fileName, fileType, fileSize, onRemove, onClick }: FilePreviewProps) {
  const isImage = fileType.startsWith('image/')
  const Icon = isImage ? ImageIcon : FileText

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10',
        onClick && 'cursor-pointer hover:bg-white/10'
      )}
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon className={cn('h-5 w-5', isImage ? 'text-green-400' : 'text-blue-400')} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{fileName}</p>
        <p className="text-xs text-white/60">{formatSize(fileSize)}</p>
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-1 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
