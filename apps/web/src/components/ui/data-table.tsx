'use client'

import { cn } from '@/lib/utils'
import { SkeletonTableRow } from './skeleton'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  isLoading?: boolean
  loadingRows?: number
  emptyMessage?: string
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onRowClick?: (item: T) => void
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRows = 5,
  emptyMessage = 'No data found',
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-white transition-colors select-none',
                    column.headerClassName
                  )}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc'
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: loadingRows }).map((_, i) => (
                <SkeletonTableRow key={i} columns={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-white/40"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={cn(
                    'border-b border-white/5 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-white/5'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-4 py-3 text-sm text-white', column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
