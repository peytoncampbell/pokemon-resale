'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useBulkUpdateInventory, useBulkDeleteInventory } from '@/hooks/use-bulk-operations'
import { usePermissions } from '@/hooks/use-permissions'
import { Trash2, MapPin, Tag, X, CheckCircle, ShieldAlert } from 'lucide-react'

const LOCATIONS = [
  'BIN-01', 'BIN-02', 'BIN-03', 'BIN-04', 'BIN-05',
  'BIN-06', 'BIN-07', 'BIN-08', 'BIN-09', 'BIN-10',
]

const STATUSES = [
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'LISTED', label: 'Listed' },
  { value: 'SOLD', label: 'Sold' },
] as const

interface BulkActionBarProps {
  selectedIds: string[]
  onClearSelection: () => void
}

export function BulkActionBar({ selectedIds, onClearSelection }: BulkActionBarProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const { canEdit } = usePermissions()

  const bulkUpdate = useBulkUpdateInventory()
  const bulkDelete = useBulkDeleteInventory()

  const handleStatusChange = useCallback(
    async (status: 'IN_STOCK' | 'LISTED' | 'SOLD') => {
      await bulkUpdate.mutateAsync({ ids: selectedIds, status })
      setShowStatusDropdown(false)
      onClearSelection()
    },
    [bulkUpdate, selectedIds, onClearSelection]
  )

  const handleLocationChange = useCallback(
    async (location: string) => {
      await bulkUpdate.mutateAsync({ ids: selectedIds, location })
      setShowLocationDropdown(false)
      onClearSelection()
    },
    [bulkUpdate, selectedIds, onClearSelection]
  )

  const handleDelete = useCallback(async () => {
    if (
      confirm(`Are you sure you want to delete ${selectedIds.length} items? This cannot be undone.`)
    ) {
      await bulkDelete.mutateAsync(selectedIds)
      onClearSelection()
    }
  }, [bulkDelete, selectedIds, onClearSelection])

  if (selectedIds.length === 0) return null

  const isLoading = bulkUpdate.isPending || bulkDelete.isPending

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-vision-navy/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
          <CheckCircle className="h-5 w-5 text-vision-cyan" />
          <span className="font-semibold text-white">{selectedIds.length} selected</span>
        </div>

        {!canEdit ? (
          <div className="flex items-center gap-2 text-white/60">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-sm">View-only access</span>
          </div>
        ) : (
          <>
            <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown)
              setShowLocationDropdown(false)
            }}
            disabled={isLoading}
            className="gap-2"
          >
            <Tag className="h-4 w-4" />
            Status
          </Button>
          {showStatusDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-40 rounded-xl bg-vision-navy border border-white/10 shadow-xl overflow-hidden">
              {STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowLocationDropdown(!showLocationDropdown)
              setShowStatusDropdown(false)
            }}
            disabled={isLoading}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Location
          </Button>
          {showLocationDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-40 max-h-60 overflow-y-auto rounded-xl bg-vision-navy border border-white/10 shadow-xl">
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              aria-label="Delete selected items"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}

        <div className="pl-2 border-l border-white/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
