import { MainLayout } from "@/components/layout/main-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, TrendingUp, ListChecks } from "lucide-react"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your business
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Profit"
            value="$12,450"
            icon={DollarSign}
            trend={{ value: "12.5% from last month", isPositive: true }}
          />
          <MetricCard
            title="Active Listings"
            value="247"
            icon={ListChecks}
            trend={{ value: "3.2% from last week", isPositive: true }}
          />
          <MetricCard
            title="Average Margin"
            value="42.3%"
            icon={TrendingUp}
            trend={{ value: "1.8% from last month", isPositive: true }}
          />
          <MetricCard
            title="Inventory Value"
            value="$28,900"
            icon={Package}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">New listing created</p>
                    <p className="text-sm text-muted-foreground">
                      Charizard VMAX - PSA 10
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Sale completed</p>
                    <p className="text-sm text-muted-foreground">
                      Pikachu V - CGC 9.5
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Inventory added</p>
                    <p className="text-sm text-muted-foreground">
                      10 cards from TCGPlayer order
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">3 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deal tracked</p>
                    <p className="text-sm text-muted-foreground">
                      Umbreon VMAX Alt Art
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">5 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/deals"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="font-medium">Track New Deal 🔥</span>
                <span className="text-sm text-muted-foreground">→</span>
              </a>
              <a
                href="/inventory"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="font-medium">Add to Inventory</span>
                <span className="text-sm text-muted-foreground">→</span>
              </a>
              <a
                href="/listings"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="font-medium">Create Listing</span>
                <span className="text-sm text-muted-foreground">→</span>
              </a>
              <a
                href="/procurement"
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="font-medium">New Purchase Order</span>
                <span className="text-sm text-muted-foreground">→</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
