'use client'

import type { TransactionType } from '@/hooks/use-transactions'

interface TransactionFiltersProps {
  activeType: TransactionType | undefined
  onTypeChange: (type: TransactionType | undefined) => void
}

export function TransactionFilters({ activeType, onTypeChange }: TransactionFiltersProps) {
  const tabs = [
    { label: 'All', value: undefined },
    { label: 'Buys', value: 'BUY' as TransactionType },
    { label: 'Sales', value: 'SELL' as TransactionType },
    { label: 'Trades', value: 'TRADE' as TransactionType },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onTypeChange(tab.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
            activeType === tab.value
              ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
