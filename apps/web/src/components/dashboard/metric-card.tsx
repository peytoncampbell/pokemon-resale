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
  iconColor?: 'blue' | 'green' | 'orange' | 'purple' | 'cyan'
  className?: string
}

const iconColorClasses = {
  blue: 'icon-bg-blue shadow-vision-blue/30',
  green: 'icon-bg-green shadow-vision-green/30',
  orange: 'icon-bg-orange shadow-vision-orange/30',
  purple: 'icon-bg-purple shadow-vision-purple/30',
  cyan: 'icon-bg-cyan shadow-vision-cyan/30',
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  iconColor = 'blue',
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("hover:shadow-lg hover:shadow-vision-blue/5 transition-all", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-white/60 uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">{value}</p>
              {trend && (
                <span className={cn(
                  "text-xs font-semibold",
                  trend.isPositive ? "text-vision-green" : "text-red-400"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}
                </span>
              )}
            </div>
          </div>
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl shadow-lg",
            iconColorClasses[iconColor]
          )}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
