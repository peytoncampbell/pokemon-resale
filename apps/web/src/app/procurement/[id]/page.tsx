'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useProcurement, useProcurementItems, useUpdateProcurement } from '@/hooks/use-procurement'
import { useAttachments, useUploadAttachment, useDeleteAttachment, useGetAttachmentUrl } from '@/hooks/use-attachments'
import { ExpectedItemsList } from '@/components/procurement/expected-items-list'
import { ReconcileModal } from '@/components/procurement/reconcile-modal'
import { CostBreakdown } from '@/components/procurement/cost-breakdown'
import { FileUpload, FilePreview } from '@/components/ui/file-upload'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar, Store, CheckCircle, Clock, XCircle, Package, Paperclip } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const STATUS_COLORS = {
  PENDING: 'secondary',
  RECEIVED: 'success',
  CANCELLED: 'destructive',
} as const

const STATUS_ICONS = {
  PENDING: Clock,
  RECEIVED: CheckCircle,
  CANCELLED: XCircle,
}

export default function ProcurementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [showReconcileModal, setShowReconcileModal] = useState(false)

  const { data: procurement, isLoading, error } = useProcurement(id)
  const { data: linkedItems } = useProcurementItems(id)
  const { data: attachments } = useAttachments(id)
  const updateProcurement = useUpdateProcurement()
  const uploadAttachment = useUploadAttachment()
  const deleteAttachment = useDeleteAttachment()
  const getAttachmentUrl = useGetAttachmentUrl()

  const handleStatusChange = async (status: 'PENDING' | 'RECEIVED' | 'CANCELLED') => {
    if (procurement) {
      await updateProcurement.mutateAsync({ id: procurement.id, status })
    }
  }

  const handleFileUpload = async (file: File) => {
    await uploadAttachment.mutateAsync({ procurementId: id, file })
  }

  const handleAttachmentClick = async (storagePath: string) => {
    const url = await getAttachmentUrl.mutateAsync(storagePath)
    window.open(url, '_blank')
  }

  const handleDeleteAttachment = async (attachmentId: string, storagePath: string) => {
    if (confirm('Delete this attachment?')) {
      await deleteAttachment.mutateAsync({ id: attachmentId, storagePath, procurementId: id })
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-vision-blue border-r-transparent" />
            <p className="mt-2 text-sm text-white/60">Loading...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !procurement) {
    return (
      <MainLayout>
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">Failed to load procurement</p>
        </div>
      </MainLayout>
    )
  }

  const StatusIcon = STATUS_ICONS[procurement.status]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/procurement" className="text-white/40 hover:text-white/60">
            Procurement
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white font-medium">{procurement.supplier}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/procurement">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">{procurement.supplier}</h1>
                <Badge variant={STATUS_COLORS[procurement.status]} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {procurement.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(procurement.order_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {procurement.status === 'PENDING' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange('RECEIVED')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Received
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Expected Items */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <ExpectedItemsList
                  procurementId={id}
                  onReconcile={() => setShowReconcileModal(true)}
                />
              </CardContent>
            </Card>

            {/* Linked Inventory Items */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-vision-cyan" />
                    Linked Inventory
                  </h3>
                  <Link href={`/inventory?procurement=${id}`}>
                    <Button size="sm" variant="outline">
                      Add Items
                    </Button>
                  </Link>
                </div>

                {linkedItems && linkedItems.length > 0 ? (
                  <div className="space-y-3">
                    {linkedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <div className="h-12 w-9 rounded-lg bg-white/5 flex items-center justify-center relative overflow-hidden">
                          {item.card_image ? (
                            <Image
                              src={item.card_image}
                              alt={item.card_name}
                              fill
                              className="object-contain"
                              sizes="36px"
                            />
                          ) : (
                            <Package className="h-4 w-4 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{item.card_name}</p>
                          <p className="text-xs text-white/60">{item.condition} - {item.location}</p>
                        </div>
                        <p className="font-semibold text-vision-cyan">{formatCurrency(item.acquisition_cost)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-white/40">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No inventory items linked yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-vision-cyan" />
                  Attachments
                </h3>

                <FileUpload
                  onUpload={handleFileUpload}
                  disabled={uploadAttachment.isPending}
                />

                {attachments && attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <FilePreview
                        key={attachment.id}
                        fileName={attachment.file_name}
                        fileType={attachment.file_type}
                        fileSize={attachment.file_size}
                        onClick={() => handleAttachmentClick(attachment.storage_path)}
                        onRemove={() => handleDeleteAttachment(attachment.id, attachment.storage_path)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {procurement.notes && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Notes</h3>
                  <p className="text-white/80 whitespace-pre-wrap">{procurement.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <CostBreakdown procurement={procurement} />
          </div>
        </div>
      </div>

      <ReconcileModal
        open={showReconcileModal}
        onClose={() => setShowReconcileModal(false)}
        procurementId={id}
      />
    </MainLayout>
  )
}
