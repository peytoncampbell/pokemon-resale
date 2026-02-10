'use client'

import { useState } from 'react'
import { ActivityFeedCard } from './activity-feed'
import { RecentInventoryCard } from './recent-inventory-card'
import { cn } from '@/lib/utils'

type Tab = 'activity' | 'inventory'

export function ActivityInventoryTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('activity')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 w-full">
        <button
          onClick={() => setActiveTab('activity')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none',
            activeTab === 'activity'
              ? 'bg-vision-blue text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          )}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none',
            activeTab === 'inventory'
              ? 'bg-vision-blue text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          )}
        >
          Recent Inventory
        </button>
      </div>
      {activeTab === 'activity' ? <ActivityFeedCard /> : <RecentInventoryCard />}
    </div>
  )
}
