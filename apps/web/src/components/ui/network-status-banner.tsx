'use client'

import { useState } from 'react'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { WifiOff, X } from 'lucide-react'

export function NetworkStatusBanner() {
  const { isOnline } = useNetworkStatus()
  const [dismissed, setDismissed] = useState(false)

  if (isOnline || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[90] bg-amber-600/90 backdrop-blur-sm text-white px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 flex-shrink-0" />
        <span>You&apos;re offline. Some features may not work.</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss offline notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
