'use client'

import { usePathname } from 'next/navigation'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

const PATH_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/inventory': 'Inventory',
  '/transactions': 'Transactions',
  '/organization': 'Organization',
  '/settings': 'Settings',
  '/setup': 'Setup',
  '/join': 'Join Organization',
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const pathname = usePathname()
  const breadcrumbLabel = PATH_LABELS[pathname] || title

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <span className="text-white/40">Pages</span>
        <span className="text-white/40" aria-hidden="true">/</span>
        <span className="text-white font-medium">{breadcrumbLabel}</span>
      </nav>

      {/* Title and Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-white/60">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
