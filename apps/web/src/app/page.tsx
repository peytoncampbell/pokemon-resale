'use client'

import { MainLayout } from "@/components/layout/main-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, TrendingUp, Box, ShoppingCart, Clock } from "lucide-react"
import { useInventoryItems } from "@/hooks/use-inventory"
import { useAnalytics } from "@/hooks/use-analytics"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  const { data: inventory } = useInventoryItems()
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics()

  const recentInventory = inventory?.slice(0, 5) || []

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Your business overview at a glance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Inventory Value"
            value={analyticsLoading ? '...' : formatCurrency(analytics?.totalInventoryValue || 0)}
            icon={DollarSign}
            trend={{ value: `${analytics?.totalItems || 0} items`, isPositive: true }}
          />
          <MetricCard
            title="Total Invested"
            value={analyticsLoading ? '...' : formatCurrency(analytics?.totalInvested || 0)}
            icon={Box}
          />
          <MetricCard
            title="Items Sold"
            value={analyticsLoading ? '...' : String(analytics?.itemsSold || 0)}
            icon={TrendingUp}
            trend={analytics?.totalProfit ? { 
              value: `${formatCurrency(analytics.totalProfit)} profit`, 
              isPositive: analytics.totalProfit > 0 
            } : undefined}
          />
          <MetricCard
            title="Pending Orders"
            value={analyticsLoading ? '...' : String(analytics?.pendingProcurements || 0)}
            icon={ShoppingCart}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inventory by Status */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">In Stock</span>
                  </div>
                  <span className="font-semibold">{analytics?.inventoryByStatus?.IN_STOCK || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Listed</span>
                  </div>
                  <span className="font-semibold">{analytics?.inventoryByStatus?.LISTED || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                    <span className="text-sm">Sold</span>
                  </div>
                  <span className="font-semibold">{analytics?.inventoryByStatus?.SOLD || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory by Condition */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">By Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics?.inventoryByCondition && Object.entries(analytics.inventoryByCondition).map(([condition, count]) => (
                  <Badge key={condition} variant="outline" className="rounded-lg px-3 py-1.5">
                    {condition}: <span className="font-bold ml-1">{count}</span>
                  </Badge>
                ))}
                {(!analytics?.inventoryByCondition || Object.keys(analytics.inventoryByCondition).length === 0) && (
                  <p className="text-sm text-muted-foreground">No inventory yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {analytics?.recentActivity && analytics.recentActivity.length > 0 && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.recentActivity.map((day) => (
                  <div key={day.date} className="rounded-xl bg-accent/20 p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="font-semibold">{day.itemsAdded} items</p>
                    <p className="text-sm text-[#DC143C]">{formatCurrency(day.value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-sm bg-gradient-to-br from-background to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Recent Inventory</CardTitle>
              <Link
                href="/inventory"
                className="text-sm font-medium text-[#DC143C] hover:text-[#FF1744] transition-colors"
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
                    className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 hover:bg-background transition-colors border border-border/50"
                  >
                    <div className="w-16 h-20 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.card_image ? (
                        <Image
                          src={item.card_image}
                          alt={item.card_name}
                          width={64}
                          height={80}
                          className="object-contain"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.card_name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.set_name} • {item.location || 'No location'}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs rounded-lg">
                          {item.condition || 'NM'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#DC143C]">{formatCurrency(item.acquisition_cost)}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No inventory yet</p>
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DC143C] to-[#FF1744] text-white font-medium hover:shadow-lg hover:shadow-[#DC143C]/20 transition-all"
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
