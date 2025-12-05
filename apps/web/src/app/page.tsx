'use client'

import { MainLayout } from "@/components/layout/main-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, TrendingUp, Box } from "lucide-react"
import { useInventoryItems } from "@/hooks/use-inventory"
import { formatCurrency, formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  const { data: inventory } = useInventoryItems()

  const inventoryValue = inventory?.reduce((sum, item) => {
    if (item.status === 'IN_STOCK' || item.status === 'LISTED') {
      return sum + (item.acquisition_cost * item.quantity)
    }
    return sum
  }, 0) || 0

  const totalItems = inventory?.reduce((sum, item) => {
    if (item.status === 'IN_STOCK' || item.status === 'LISTED') {
      return sum + item.quantity
    }
    return sum
  }, 0) || 0

  const totalInvested = inventory?.reduce((sum, item) => {
    return sum + (item.acquisition_cost * item.quantity)
  }, 0) || 0

  const soldItems = inventory?.filter((item) => item.status === 'SOLD') || []
  const totalRevenue = soldItems.reduce((sum, item) => sum + (item.sale_price || 0), 0)
  const totalCost = soldItems.reduce((sum, item) => sum + item.acquisition_cost, 0)
  const totalProfit = totalRevenue - totalCost

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
            title="Business Value"
            value={formatCurrency(inventoryValue)}
            icon={DollarSign}
            trend={{ value: "Current inventory value", isPositive: true }}
          />
          <MetricCard
            title="Total Items"
            value={String(totalItems)}
            icon={Package}
          />
          <MetricCard
            title="Total Profit"
            value={formatCurrency(totalProfit)}
            icon={TrendingUp}
            trend={totalProfit > 0 ? { value: `${soldItems.length} sales`, isPositive: true } : undefined}
          />
          <MetricCard
            title="Invested"
            value={formatCurrency(totalInvested)}
            icon={Box}
          />
        </div>

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
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
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
