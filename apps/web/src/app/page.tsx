'use client'

import { MainLayout } from "@/components/layout/main-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, TrendingUp, ShoppingCart, Clock } from "lucide-react"
import { useInventoryItems } from "@/hooks/use-inventory"
import { useAnalytics } from "@/hooks/use-analytics"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/hooks/use-currency"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  const { data: inventory } = useInventoryItems()
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics()
  const { currency } = useCurrency()

  const recentInventory = inventory?.slice(0, 5) || []

  // Transform recent activity for chart
  const salesData = analytics?.recentActivity?.map(day => ({
    month: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    sales: day.value
  })) || []

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Inventory Value"
            value={analyticsLoading ? '...' : formatCurrency(analytics?.totalInventoryValue || 0, currency)}
            icon={DollarSign}
            iconColor="blue"
            trend={{ value: `${analytics?.totalItems || 0} items`, isPositive: true }}
          />
          <MetricCard
            title="Total Invested"
            value={analyticsLoading ? '...' : formatCurrency(analytics?.totalInvested || 0, currency)}
            icon={Package}
            iconColor="green"
          />
          <MetricCard
            title="Items Sold"
            value={analyticsLoading ? '...' : String(analytics?.itemsSold || 0)}
            icon={TrendingUp}
            iconColor="orange"
            trend={analytics?.totalProfit ? {
              value: `${formatCurrency(analytics.totalProfit, currency)} profit`,
              isPositive: analytics.totalProfit > 0
            } : undefined}
          />
          <MetricCard
            title="Pending Orders"
            value={analyticsLoading ? '...' : String(analytics?.pendingProcurements || 0)}
            icon={ShoppingCart}
            iconColor="purple"
          />
        </div>

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Inventory by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-vision-green" />
                  <span className="text-sm text-white/80">In Stock</span>
                </div>
                <span className="font-semibold text-white">{analytics?.inventoryByStatus?.IN_STOCK || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-vision-blue" />
                  <span className="text-sm text-white/80">Listed</span>
                </div>
                <span className="font-semibold text-white">{analytics?.inventoryByStatus?.LISTED || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-white/40" />
                  <span className="text-sm text-white/80">Sold</span>
                </div>
                <span className="font-semibold text-white">{analytics?.inventoryByStatus?.SOLD || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <SalesChart 
          data={salesData.length > 0 ? salesData : undefined}
          title="Sales overview"
          subtitle={`(+${analytics?.itemsSold || 0}) items sold`}
        />

        {/* Recent Activity */}
        {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-vision-cyan" />
                Recent Activity (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.recentActivity.map((day) => (
                  <div key={day.date} className="rounded-xl bg-white/5 p-4 border border-white/10">
                    <p className="text-sm text-white/60 mb-1">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="font-semibold text-white">{day.itemsAdded} items</p>
                    <p className="text-sm text-vision-cyan">{formatCurrency(day.value, currency)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Inventory */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Inventory</CardTitle>
              <Link
                href="/inventory"
                className="text-sm font-medium text-vision-cyan hover:text-vision-blue transition-colors"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentInventory.length > 0 ? (
              <div className="space-y-4">
                {recentInventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="w-16 h-20 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.card_image ? (
                        <Image
                          src={item.card_image}
                          alt={item.card_name}
                          width={64}
                          height={80}
                          className="object-contain"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.card_name}</h3>
                      <p className="text-sm text-white/60 truncate">
                        {item.set_name} • {item.location || 'No location'}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs rounded-lg border-white/20 text-white/80">
                          {item.condition || 'NM'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-vision-cyan">{formatCurrency(item.acquisition_cost, currency)}</p>
                      <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">No inventory yet</p>
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-vision-blue to-vision-cyan text-white font-medium hover:shadow-lg hover:shadow-vision-blue/20 transition-all"
                >
                  Add your first item
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
