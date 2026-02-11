"use client"

import { cn } from "@/lib/utils"
import { colors, animations, withOpacity } from "@/lib/design-tokens"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  className?: string
}

export function CircularProgress({
  value,
  size = 150,
  strokeWidth = 12,
  label,
  sublabel,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: `all ${animations.duration.slow} ${animations.easing.out}`,
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.vision.blue} />
            <stop offset="100%" stopColor={colors.vision.cyan} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{value}%</span>
        {sublabel && <span className="text-xs text-white/60 mt-1">{sublabel}</span>}
      </div>
    </div>
  )
}

interface SatisfactionCardProps {
  value: number
  title?: string
  subtitle?: string
}

export function SatisfactionCard({ value, title = "Satisfaction Rate", subtitle = "From all projects" }: SatisfactionCardProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/60">{subtitle}</p>
        </div>
        <CircularProgress 
          value={value} 
          size={160} 
          strokeWidth={14}
          sublabel="Based on likes"
        />
        <div className="flex items-center justify-between w-full mt-4 text-sm">
          <span className="text-white/60">0%</span>
          <span className="text-white/60">100%</span>
        </div>
      </div>
    </div>
  )
}
