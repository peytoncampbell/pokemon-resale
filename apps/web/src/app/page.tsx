'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { InventoryStatusCard } from '@/components/dashboard/inventory-status-card'
import { SalesChartWrapper } from '@/components/dashboard/sales-chart-wrapper'
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card'
import { RecentInventoryCard } from '@/components/dashboard/recent-inventory-card'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="Track your Pokemon card inventory and monitor your sales."
        />

        {/* Metric Cards Row */}
        <DashboardMetrics />

        {/* Two Column Layout: Chart + Status */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChartWrapper />
          </div>
          <div>
            <InventoryStatusCard />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivityCard />

        {/* Recent Inventory */}
        <RecentInventoryCard />
      </div>
    </MainLayout>
  )
}
