'use client'

import { cn } from '@/lib/utils'

export interface Tab<T> {
  label: string
  value: T
}

interface TabGroupProps<T> {
  tabs: Tab<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function TabGroup<T>({ tabs, value, onChange, className }: TabGroupProps<T>) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue focus-visible:ring-offset-2 focus-visible:ring-offset-vision-navy',
            value === tab.value
              ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
