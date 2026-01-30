'use client'

import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Search,
  FileX,
  Inbox,
  Users,
  type LucideIcon
} from 'lucide-react'

type EmptyStateVariant = 'inventory' | 'transactions' | 'search' | 'error' | 'generic' | 'members'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  icon?: LucideIcon
  className?: string
}

const variantConfig: Record<EmptyStateVariant, { icon: LucideIcon; gradient: string }> = {
  inventory: {
    icon: Package,
    gradient: 'from-vision-blue/20 to-vision-cyan/20',
  },
  transactions: {
    icon: ShoppingCart,
    gradient: 'from-vision-green/20 to-emerald-500/20',
  },
  search: {
    icon: Search,
    gradient: 'from-vision-purple/20 to-vision-pink/20',
  },
  error: {
    icon: FileX,
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  generic: {
    icon: Inbox,
    gradient: 'from-white/10 to-white/5',
  },
  members: {
    icon: Users,
    gradient: 'from-vision-purple/20 to-vision-blue/20',
  },
}

export function EmptyState({
  variant = 'generic',
  title,
  description,
  action,
  secondaryAction,
  icon: CustomIcon,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = CustomIcon || config.icon

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 animate-in fade-in-50 duration-500', className)}>
      {/* Illustrated icon container */}
      <div className={cn(
        'relative mb-6 animate-in zoom-in-50 duration-500 delay-100'
      )}>
        {/* Background glow */}
        <div className={cn(
          'absolute inset-0 rounded-3xl bg-gradient-to-br blur-2xl opacity-50',
          config.gradient
        )} />

        {/* Icon container */}
        <div className={cn(
          'relative h-28 w-28 rounded-3xl bg-gradient-to-br flex items-center justify-center border border-white/10',
          config.gradient
        )}>
          <Icon className="h-14 w-14 text-white/60" strokeWidth={1.5} />
        </div>

        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-vision-cyan/30 animate-pulse" />
        <div className="absolute -bottom-1 -left-3 h-3 w-3 rounded-full bg-vision-purple/30 animate-pulse delay-300" />
      </div>

      {/* Text content */}
      <h3 className="text-2xl font-bold mb-2 text-white animate-in fade-in-50 slide-in-from-bottom-2 duration-500 delay-200">
        {title}
      </h3>
      <p className="text-white/60 mb-6 text-center max-w-md animate-in fade-in-50 slide-in-from-bottom-2 duration-500 delay-300">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 delay-400">
          {action && (
            <Button
              variant={action.variant || 'default'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
