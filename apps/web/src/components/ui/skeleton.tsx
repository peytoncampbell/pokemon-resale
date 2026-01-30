import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/10',
        className
      )}
    />
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card p-5 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonInventoryCard({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTransactionCard({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card p-5', className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-11 w-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-12 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-6 w-20 ml-auto" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <Skeleton className="h-8 w-28 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonMetricCard({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}

export function SkeletonList({ rows = 5, className }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <Skeleton className="h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
