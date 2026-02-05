'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Upload, CheckCircle2, AlertCircle, FileUp } from 'lucide-react'
import { useImportUpload, useImportPreview, useImportCommit } from '@/hooks/use-import'
import { toast } from 'sonner'

interface CSVImportWizardProps {
  isOpen: boolean
  onClose: () => void
}

type WizardStep = 'upload' | 'preview' | 'complete'

export function CSVImportWizard({ isOpen, onClose }: CSVImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const uploadMutation = useImportUpload()
  const { data: previewData, isLoading: isLoadingPreview } = useImportPreview(sessionId)
  const commitMutation = useImportCommit()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['.csv', '.xlsx']
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

      if (!validTypes.includes(fileExtension)) {
        toast.error('Invalid file type', {
          description: 'Please upload a .csv or .xlsx file',
        })
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast.error('File too large', {
          description: 'Maximum file size is 5MB',
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const result = await uploadMutation.mutateAsync(selectedFile)
      setSessionId(result.session_id)
      setCurrentStep('preview')
      toast.success('File uploaded successfully', {
        description: `Processing ${result.total_rows} rows...`,
      })
    } catch (error) {
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleCommit = async () => {
    if (!sessionId) return

    try {
      const result = await commitMutation.mutateAsync(sessionId)
      setCurrentStep('complete')
      toast.success('Import complete!', {
        description: `Successfully imported ${result.imported_count} items`,
      })
    } catch (error) {
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleClose = () => {
    if (!uploadMutation.isPending && !commitMutation.isPending) {
      setCurrentStep('upload')
      setSessionId(null)
      setSelectedFile(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-import"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <div className="flex items-center gap-3">
            <FileUp className="h-6 w-6 text-vision-cyan" />
            <h2
              id="modal-title-import"
              className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent"
            >
              Import from CSV
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={uploadMutation.isPending || commitMutation.isPending}
            className="rounded-xl hover:bg-accent/50"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'upload'
                    ? 'bg-vision-blue text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 'upload' ? 'text-white' : 'text-white/40'
                }`}
              >
                Upload
              </span>
            </div>
            <div className="w-16 h-0.5 bg-white/10" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'preview'
                    ? 'bg-vision-blue text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 'preview' ? 'text-white' : 'text-white/40'
                }`}
              >
                Preview
              </span>
            </div>
            <div className="w-16 h-0.5 bg-white/10" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'complete'
                    ? 'bg-vision-blue text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 'complete' ? 'text-white' : 'text-white/40'
                }`}
              >
                Complete
              </span>
            </div>
          </div>

          {/* Step 1: Upload */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-white/60 mb-4">
                  Upload a CSV or Excel file with your inventory data
                </p>
                <p className="text-sm text-white/40 mb-6">
                  Required columns: card_name, quantity, acquisition_cost
                </p>
              </div>

              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-vision-blue/50 transition-colors">
                <Upload className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-vision-cyan hover:text-vision-blue font-medium"
                >
                  Choose file
                </label>
                <p className="text-sm text-white/40 mt-2">
                  or drag and drop (Max 5MB)
                </p>
                {selectedFile && (
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-white font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-white/40">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full"
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload and Preview'}
              </Button>
            </div>
          )}

          {/* Step 2: Preview */}
          {currentStep === 'preview' && (
            <div className="space-y-6">
              {isLoadingPreview ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vision-cyan mx-auto mb-4" />
                  <p className="text-white/60">Validating data...</p>
                </div>
              ) : previewData ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60 mb-1">Total Rows</p>
                      <p className="text-2xl font-bold text-white">{previewData.total_rows}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-sm text-emerald-400 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Valid
                      </p>
                      <p className="text-2xl font-bold text-emerald-400">{previewData.valid_rows}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-400 mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Invalid
                      </p>
                      <p className="text-2xl font-bold text-red-400">{previewData.invalid_rows}</p>
                    </div>
                  </div>

                  {/* Error Details */}
                  {previewData.invalid_rows > 0 && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                      <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Validation Errors
                      </h4>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {previewData.rows
                          .filter((row) => !row.is_valid)
                          .slice(0, 10)
                          .map((row) => (
                            <div
                              key={row.id}
                              className="p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                            >
                              <p className="text-sm text-white font-medium mb-1">
                                Row {row.row_number}
                              </p>
                              {row.validation_errors && (
                                <ul className="text-xs text-red-400 space-y-0.5">
                                  {row.validation_errors.map((error, idx) => (
                                    <li key={idx}>• {error}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        {previewData.rows.filter((row) => !row.is_valid).length > 10 && (
                          <p className="text-xs text-white/40 text-center pt-2">
                            ... and {previewData.rows.filter((row) => !row.is_valid).length - 10} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep('upload')
                        setSessionId(null)
                      }}
                      disabled={commitMutation.isPending}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCommit}
                      disabled={previewData.valid_rows === 0 || commitMutation.isPending}
                      className="flex-1"
                    >
                      {commitMutation.isPending
                        ? 'Importing...'
                        : `Import ${previewData.valid_rows} Valid Rows`}
                    </Button>
                  </div>

                  {previewData.valid_rows === 0 && (
                    <p className="text-sm text-center text-red-400">
                      No valid rows to import. Please fix errors and try again.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Import Complete!</h3>
                <p className="text-white/60">
                  Your inventory has been updated successfully
                </p>
              </div>
              <Button onClick={handleClose} className="w-full max-w-xs mx-auto">
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
