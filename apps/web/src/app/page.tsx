'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { InventoryStatusCard } from '@/components/dashboard/inventory-status-card'
import { SalesChartWrapper } from '@/components/dashboard/sales-chart-wrapper'
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card'
import { RecentInventoryCard } from '@/components/dashboard/recent-inventory-card'
import {
  ProfitBySetWidget,
  ProfitByPlatformWidget,
  InventoryAgingWidget,
  SellThroughWidget,
} from '@/components/analytics'
import { ErrorBoundary } from '@/components/error-boundary'
import { GettingStartedChecklist } from '@/components/onboarding/getting-started-checklist'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Getting Started Checklist */}
        <GettingStartedChecklist />

        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="Track your Pokemon card inventory and monitor your sales."
        />

        {/* Metric Cards Row */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load dashboard metrics</div>}>
          <DashboardMetrics />
        </ErrorBoundary>

        {/* Two Column Layout: Chart + Status */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load charts</div>}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalesChartWrapper />
            </div>
            <div>
              <InventoryStatusCard />
            </div>
          </div>
        </ErrorBoundary>

        {/* Analytics Section */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load analytics</div>}>
          <div className="grid gap-6 lg:grid-cols-2">
            <ProfitBySetWidget />
            <ProfitByPlatformWidget />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InventoryAgingWidget />
            <SellThroughWidget />
          </div>
        </ErrorBoundary>

        {/* Recent Activity */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load recent activity</div>}>
          <RecentActivityCard />
        </ErrorBoundary>

        {/* Recent Inventory */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load recent inventory</div>}>
          <RecentInventoryCard />
        </ErrorBoundary>
      </div>
    </MainLayout>
  )
}
