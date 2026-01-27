"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface SalesData {
  month: string
  sales: number
}

interface SalesChartProps {
  data?: SalesData[]
  title?: string
  subtitle?: string
}

const defaultData: SalesData[] = [
  { month: "Jan", sales: 200 },
  { month: "Feb", sales: 300 },
  { month: "Mar", sales: 250 },
  { month: "Apr", sales: 400 },
  { month: "May", sales: 350 },
  { month: "Jun", sales: 450 },
  { month: "Jul", sales: 380 },
  { month: "Aug", sales: 420 },
  { month: "Sep", sales: 500 },
  { month: "Oct", sales: 480 },
  { month: "Nov", sales: 520 },
  { month: "Dec", sales: 600 },
]

export function SalesChart({ 
  data = defaultData, 
  title = "Sales overview", 
  subtitle = "(+5) more in 2024" 
}: SalesChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-vision-green">{subtitle}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0075FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0075FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1535',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0075FF"
                strokeWidth={3}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
