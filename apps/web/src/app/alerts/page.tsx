'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePriceAlerts, useTogglePriceAlert, useDeletePriceAlert } from '@/hooks/use-price-alerts'
import { useCurrency } from '@/hooks/use-currency'
import { cn } from '@/lib/utils'
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Percent,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { PriceAlertFormModal } from '@/components/price-intelligence/price-alert-form-modal'
import type { PriceAlert } from '@/types/price-intelligence'

type FilterType = 'all' | 'active' | 'triggered'

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data: alerts, isLoading } = usePriceAlerts()
  const toggleAlert = useTogglePriceAlert()
  const deleteAlert = useDeletePriceAlert()
  const { formatPrice } = useCurrency()

  const filteredAlerts = alerts?.filter((alert) => {
    if (filter === 'active') return alert.isActive && !alert.isTriggered
    if (filter === 'triggered') return alert.isTriggered
    return true
  })

  const handleToggle = (alert: PriceAlert) => {
    toggleAlert.mutate({ id: alert.id, isActive: !alert.isActive })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      deleteAlert.mutate(id)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Price Alerts"
          description="Get notified when card prices hit your targets."
          action={
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Alert
            </Button>
          }
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'active', 'triggered'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                filter === f
                  ? 'bg-vision-blue text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Triggered'}
              {alerts && (
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/10">
                  {f === 'all'
                    ? alerts.length
                    : f === 'active'
                      ? alerts.filter((a) => a.isActive && !a.isTriggered).length
                      : alerts.filter((a) => a.isTriggered).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <AlertSkeleton key={i} />
            ))}
          </div>
        ) : !filteredAlerts?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-white/20 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No alerts yet</h3>
              <p className="text-white/50 text-sm mb-4 text-center max-w-md">
                Create price alerts to get notified when cards reach your target prices.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={() => handleToggle(alert)}
                onDelete={() => handleDelete(alert.id)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        <PriceAlertFormModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </MainLayout>
  )
}

interface AlertCardProps {
  alert: PriceAlert
  onToggle: () => void
  onDelete: () => void
  formatPrice: (amount: number) => string
}

function AlertCard({ alert, onToggle, onDelete, formatPrice }: AlertCardProps) {
  const AlertTypeIcon =
    alert.alertType === 'above'
      ? TrendingUp
      : alert.alertType === 'below'
        ? TrendingDown
        : Percent

  const alertTypeLabel =
    alert.alertType === 'above'
      ? `Above ${formatPrice(alert.targetPrice ?? 0)}`
      : alert.alertType === 'below'
        ? `Below ${formatPrice(alert.targetPrice ?? 0)}`
        : `Changes ${alert.thresholdPercent}%`

  return (
    <Card
      className={cn(
        'transition-all',
        !alert.isActive && 'opacity-60',
        alert.isTriggered && 'border-orange-500/30'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Card Image */}
          <div className="relative w-16 h-22 flex-shrink-0">
            {alert.cardImage ? (
              <Image
                src={alert.cardImage}
                alt={alert.cardName}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-white/30" />
              </div>
            )}
            {alert.isTriggered && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-10">
                <AlertCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Alert Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-white truncate">{alert.cardName}</h3>
                <p className="text-sm text-white/50">{alert.setName || 'Unknown Set'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full',
                      alert.condition === 'NM'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/10 text-white/70'
                    )}
                  >
                    {alert.condition}
                  </span>
                </div>
              </div>

              {/* Alert Target */}
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <AlertTypeIcon
                    className={cn(
                      'h-4 w-4',
                      alert.alertType === 'above'
                        ? 'text-emerald-400'
                        : alert.alertType === 'below'
                          ? 'text-red-400'
                          : 'text-blue-400'
                    )}
                  />
                  <span className="font-semibold text-white">{alertTypeLabel}</span>
                </div>
                {alert.isTriggered && alert.triggeredPrice && (
                  <p className="text-sm text-orange-400">
                    Triggered @ {formatPrice(alert.triggeredPrice)}
                  </p>
                )}
                {alert.isTriggered && alert.triggeredAt && (
                  <p className="text-xs text-white/50">
                    {new Date(alert.triggeredAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/50">
                {alert.notifyInApp && (
                  <span className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    In-app
                  </span>
                )}
                {alert.notifyEmail && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Email
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className={cn(
                    'gap-1.5',
                    alert.isActive ? 'text-emerald-400' : 'text-white/50'
                  )}
                >
                  {alert.isActive ? (
                    <>
                      <Bell className="h-4 w-4" />
                      Active
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4" />
                      Paused
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AlertSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-22 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-5 w-28 ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
