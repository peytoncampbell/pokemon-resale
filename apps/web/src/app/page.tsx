'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics'
import { InventoryStatusCard } from '@/components/dashboard/inventory-status-card'
import { SalesChartWrapper } from '@/components/dashboard/sales-chart-wrapper'
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card'
import { RecentInventoryCard } from '@/components/dashboard/recent-inventory-card'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40">Pages</span>
          <span className="text-white/40">/</span>
          <span className="text-white font-medium">Dashboard</span>
        </div>

        {/* Metric Cards Row */}
        <DashboardMetrics />

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Inventory by Status */}
        <InventoryStatusCard />

        {/* Sales Chart */}
        <SalesChartWrapper />

        {/* Recent Activity */}
        <RecentActivityCard />

        {/* Recent Inventory */}
        <RecentInventoryCard />
      </div>
    </MainLayout>
  )
}
