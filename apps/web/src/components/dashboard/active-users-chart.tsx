"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { Eye, MousePointer, ShoppingCart, Package } from "lucide-react"

interface ActivityData {
  day: string
  value: number
}

interface ActiveUsersChartProps {
  data?: ActivityData[]
  title?: string
  subtitle?: string
  stats?: {
    users: number
    clicks: string
    sales: string
    items: number
  }
}

const defaultData: ActivityData[] = [
  { day: "Mon", value: 200 },
  { day: "Tue", value: 350 },
  { day: "Wed", value: 180 },
  { day: "Thu", value: 400 },
  { day: "Fri", value: 280 },
  { day: "Sat", value: 450 },
  { day: "Sun", value: 320 },
]

const defaultStats = {
  users: 32984,
  clicks: "2.42m",
  sales: "$2,400",
  items: 320,
}

export function ActiveUsersChart({ 
  data = defaultData, 
  title = "Active Users",
  subtitle = "(+23) than last week",
  stats = defaultStats
}: ActiveUsersChartProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-[180px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={8}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              />
              <YAxis hide />
              <Bar 
                dataKey="value" 
                fill="white"
                radius={[4, 4, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-vision-green">{subtitle}</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vision-blue flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Users</p>
              <p className="text-sm font-semibold text-white">{stats.users.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vision-blue flex items-center justify-center">
              <MousePointer className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Clicks</p>
              <p className="text-sm font-semibold text-white">{stats.clicks}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vision-blue flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Sales</p>
              <p className="text-sm font-semibold text-white">{stats.sales}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vision-blue flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Items</p>
              <p className="text-sm font-semibold text-white">{stats.items}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
