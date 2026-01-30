'use client'

import { TabGroup, type Tab } from '@/components/ui/tab-group'
import type { TransactionType } from '@/hooks/use-transactions'

interface TransactionFiltersProps {
  activeType: TransactionType | undefined
  onTypeChange: (type: TransactionType | undefined) => void
}

const tabs: Tab<TransactionType | undefined>[] = [
  { label: 'All', value: undefined },
  { label: 'Buys', value: 'BUY' },
  { label: 'Sales', value: 'SELL' },
  { label: 'Trades', value: 'TRADE' },
]

export function TransactionFilters({ activeType, onTypeChange }: TransactionFiltersProps) {
  return (
    <TabGroup
      tabs={tabs}
      value={activeType}
      onChange={onTypeChange}
    />
  )
}
