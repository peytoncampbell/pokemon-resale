'use client'

import { useState } from 'react'
import { useSuppliers, type Supplier } from '@/hooks/use-suppliers'
import { ChevronDown, Store, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupplierSelectProps {
  value: string | null
  onChange: (supplierId: string | null) => void
  onAddNew?: () => void
  placeholder?: string
  disabled?: boolean
}

export function SupplierSelect({
  value,
  onChange,
  onAddNew,
  placeholder = 'Select supplier...',
  disabled = false,
}: SupplierSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: suppliers, isLoading } = useSuppliers()

  const selectedSupplier = suppliers?.find((s) => s.id === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-left transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Store className="h-4 w-4 text-white/40 flex-shrink-0" />
          <span className={cn('truncate', selectedSupplier ? 'text-white' : 'text-white/40')}>
            {isLoading ? 'Loading...' : selectedSupplier?.name || placeholder}
          </span>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-white/40 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-2 rounded-xl bg-vision-navy border border-white/10 shadow-xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="w-4" />
                <span>No supplier</span>
              </button>

              {suppliers?.map((supplier) => (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => {
                    onChange(supplier.id)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span className="w-4 flex items-center justify-center">
                    {supplier.id === value && <Check className="h-4 w-4 text-vision-cyan" />}
                  </span>
                  <span className="truncate">{supplier.name}</span>
                  {supplier.rating && (
                    <span className="text-xs text-yellow-400">{'★'.repeat(supplier.rating)}</span>
                  )}
                </button>
              ))}
            </div>

            {onAddNew && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onAddNew()
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-vision-cyan hover:bg-vision-cyan/10 transition-colors border-t border-white/10"
              >
                <Plus className="h-4 w-4" />
                Add new supplier
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
