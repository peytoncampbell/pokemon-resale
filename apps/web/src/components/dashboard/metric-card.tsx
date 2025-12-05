import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({ title, value, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("border-none shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-background to-accent/10", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="rounded-2xl p-3 bg-gradient-to-br from-[#DC143C]/10 to-[#FF1744]/5 ring-1 ring-[#DC143C]/10">
            <Icon className="h-5 w-5 text-[#DC143C]" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium flex items-center gap-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              {trend.value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
