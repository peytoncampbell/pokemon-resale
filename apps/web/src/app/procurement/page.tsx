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
  PENDING: 'default',
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Procurement</h1>
            <p className="text-muted-foreground text-lg">
              Track your card purchases and orders
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-[#DC143C] to-[#FF1744] hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all rounded-xl px-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !statusFilter
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'PENDING'
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('RECEIVED')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'RECEIVED'
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === 'CANCELLED'
                ? 'bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white shadow-md'
                : 'bg-background border hover:bg-accent'
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-none bg-gradient-to-br from-background to-accent/10 px-6 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-[#DC143C]">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="rounded-2xl border-none bg-gradient-to-br from-background to-accent/10 px-6 py-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Failed to load procurement orders</p>
          </div>
        )}

        {!isLoading && !error && procurements && (
          <div className="space-y-4">
            {procurements.map((procurement) => {
              const StatusIcon = STATUS_ICONS[procurement.status]
              return (
                <Card key={procurement.id} className="border-none shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Store className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-bold text-lg">{procurement.supplier}</h3>
                          <Badge variant={STATUS_COLORS[procurement.status]} className="rounded-lg gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {procurement.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(procurement.order_date).toLocaleDateString()}
                          </span>
                        </div>
                        {procurement.notes && (
                          <p className="text-sm text-muted-foreground bg-accent/20 rounded-lg p-2 mb-3">
                            {procurement.notes}
                          </p>
                        )}
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Subtotal</span>
                            <p className="font-medium">{formatCurrency(procurement.subtotal)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Shipping</span>
                            <p className="font-medium">{formatCurrency(procurement.shipping)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fees</span>
                            <p className="font-medium">{formatCurrency(procurement.fees)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total</span>
                            <p className="font-bold text-[#DC143C]">{formatCurrency(procurement.total)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {procurement.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(procurement.id, 'RECEIVED')}
                            className="rounded-xl gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Received
                          </Button>
                        )}
                        <Link href={`/inventory?procurement=${procurement.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-1 w-full"
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
                          className="hover:bg-destructive/10 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {procurements.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6 ring-8 ring-accent/5">
                  <Package className="h-14 w-14 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No procurement orders yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Track your card purchases by creating procurement orders
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-[#DC143C] to-[#FF1744] hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all rounded-xl px-6"
                >
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
