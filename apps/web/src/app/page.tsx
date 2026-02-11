'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { PortfolioMetrics } from '@/components/dashboard/portfolio-metrics'
import { DealRanking } from '@/components/dashboard/deal-ranking'
import { InventoryStatusCard } from '@/components/dashboard/inventory-status-card'
import { SalesChartWrapper } from '@/components/dashboard/sales-chart-wrapper'
import { TopMovers } from '@/components/dashboard/top-movers'
import { ActivityInventoryTabs } from '@/components/dashboard/activity-inventory-tabs'
import { NetWorthSparkline } from '@/components/dashboard/net-worth-sparkline'
import {
  ProfitBySetWidget,
  ProfitByPlatformWidget,
  InventoryAgingWidget,
  SellThroughWidget,
} from '@/components/analytics'
import { ErrorBoundary } from '@/components/error-boundary'
import { AddInventoryModal } from '@/components/inventory/add-inventory-modal'
import { SellTransactionModal } from '@/components/transactions/sell-transaction-modal'
import { OnboardingTour } from '@/components/onboarding/onboarding-tour'
import { ChangelogModal } from '@/components/changelog-modal'
import { useBatchPriceRefresh } from '@/hooks/use-price-history'
import { useInventoryItems } from '@/hooks/use-inventory'
import { Plus, DollarSign, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const { refreshPrices, isRefreshing } = useBatchPriceRefresh()
  const { data: paginatedData } = useInventoryItems()

  const handleRefreshPrices = () => {
    const items = paginatedData?.items ?? []
    const cards = items.map((item) => ({
      cardId: item.card_id,
      cardName: item.card_name,
      gameType: (item.game_type || 'pokemon') as 'pokemon' | 'onepiece',
      setName: item.set_name || undefined,
    }))
    if (cards.length > 0) refreshPrices(cards)
  }

  return (
    <MainLayout>
      <OnboardingTour />
      <ChangelogModal />
      <div className="space-y-6">
        {/* Page Header */}
        <div data-tour="dashboard">
          <PageHeader
            title="Dashboard"
            description="Portfolio performance, P&L tracking, and deal analytics."
          />
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap gap-2">
          <button
            data-tour="add-inventory"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-vision-blue text-white text-sm font-medium hover:bg-vision-blue/80 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
          <button
            data-tour="record-sale"
            onClick={() => setSellOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <DollarSign className="h-4 w-4" /> Record Sale
          </button>
          <button
            onClick={handleRefreshPrices}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh Prices
          </button>
        </div>

        {/* Metric Cards Row */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load dashboard metrics</div>}>
          <PortfolioMetrics />
        </ErrorBoundary>

        {/* Net Worth Sparkline */}
        <ErrorBoundary fallback={null}>
          <NetWorthSparkline />
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

        {/* Top Movers */}
        <ErrorBoundary fallback={null}>
          <TopMovers />
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

        {/* Deal Performance */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load deal rankings</div>}>
          <DealRanking />
        </ErrorBoundary>

        {/* Activity & Inventory Tabs */}
        <ErrorBoundary fallback={<div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">Failed to load recent activity</div>}>
          <ActivityInventoryTabs />
        </ErrorBoundary>
      </div>

      {/* Modals */}
      <AddInventoryModal open={addOpen} onClose={() => setAddOpen(false)} />
      <SellTransactionModal open={sellOpen} onClose={() => setSellOpen(false)} />
    </MainLayout>
  )
}
