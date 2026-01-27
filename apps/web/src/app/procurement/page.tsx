'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useProcurements, useDeleteProcurement, useUpdateProcurement } from '@/hooks/use-procurement'
import { formatCurrency } from '@/lib/utils'
import { Plus, Trash2, Package, Calendar, Store, CheckCircle, XCircle, Clock } from 'lucide-react'
import { AddProcurementModal } from '@/components/procurement/add-procurement-modal'
import Link from 'next/link'

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

export default function ProcurementPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: procurements, isLoading, error } = useProcurements(statusFilter)
  const deleteProcurement = useDeleteProcurement()
  const updateProcurement = useUpdateProcurement()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this procurement order? Items linked to it will be unlinked.')) {
      await deleteProcurement.mutateAsync(id)
    }
  }

  const handleStatusChange = async (id: string, status: 'PENDING' | 'RECEIVED' | 'CANCELLED') => {
    await updateProcurement.mutateAsync({ id, status })
  }

  const totalSpent = procurements?.reduce((sum, p) => {
    if (p.status !== 'CANCELLED') {
      return sum + p.total
    }
    return sum
  }, 0) || 0

  const pendingCount = procurements?.filter(p => p.status === 'PENDING').length || 0

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40">Pages</span>
          <span className="text-white/40">/</span>
          <span className="text-white font-medium">Procurement</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Procurement</h1>
            <p className="text-white/60">
              Track your card purchases and orders
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !statusFilter
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'PENDING'
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('RECEIVED')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'RECEIVED'
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'CANCELLED'
                ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-card px-6 py-4">
            <p className="text-sm text-white/60 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-vision-cyan">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="glass-card px-6 py-4">
            <p className="text-sm text-white/60 mb-1">Pending Orders</p>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-vision-blue border-r-transparent"></div>
              <p className="mt-2 text-sm text-white/60">Loading orders...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Failed to load procurement orders</p>
          </div>
        )}

        {!isLoading && !error && procurements && (
          <div className="space-y-4">
            {procurements.map((procurement) => {
              const StatusIcon = STATUS_ICONS[procurement.status]
              return (
                <Card key={procurement.id} className="hover:shadow-lg hover:shadow-vision-blue/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Store className="h-5 w-5 text-white/60" />
                          <h3 className="font-bold text-lg text-white">{procurement.supplier}</h3>
                          <Badge variant={STATUS_COLORS[procurement.status]} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {procurement.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(procurement.order_date).toLocaleDateString()}
                          </span>
                        </div>
                        {procurement.notes && (
                          <p className="text-sm text-white/60 bg-white/5 rounded-xl p-3 mb-3 border border-white/5">
                            {procurement.notes}
                          </p>
                        )}
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Subtotal</span>
                            <p className="font-medium text-white">{formatCurrency(procurement.subtotal)}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Shipping</span>
                            <p className="font-medium text-white">{formatCurrency(procurement.shipping)}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Fees</span>
                            <p className="font-medium text-white">{formatCurrency(procurement.fees)}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Total</span>
                            <p className="font-bold text-vision-cyan">{formatCurrency(procurement.total)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {procurement.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(procurement.id, 'RECEIVED')}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Received
                          </Button>
                        )}
                        <Link href={`/inventory?procurement=${procurement.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 w-full"
                          >
                            <Package className="h-4 w-4" />
                            Add Items
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(procurement.id)}
                          disabled={deleteProcurement.isPending}
                          className="hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {procurements.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-28 w-28 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Package className="h-14 w-14 text-white/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">No procurement orders yet</h3>
                <p className="text-white/60 mb-6 text-center max-w-md">
                  Track your card purchases by creating procurement orders
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Order
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <AddProcurementModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </MainLayout>
  )
}
