'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useAddInventoryItem } from '@/hooks/use-inventory'
import { useCheckDuplicates } from '@/hooks/use-bulk-operations'
import type { UnifiedCard } from '@/lib/card-types'
import { DuplicateWarningModal } from './duplicate-warning-modal'
import { CardSearchPanel } from './card-search-panel'
import { InventoryForm, type InventoryFormData } from './inventory-form'
import type { InventoryItem } from '@/lib/supabase'

interface AddInventoryModalProps {
  open: boolean
  onClose: () => void
}

export function AddInventoryModal({ open, onClose }: AddInventoryModalProps) {
  const [selectedCard, setSelectedCard] = useState<UnifiedCard | null>(null)
  const [duplicates, setDuplicates] = useState<InventoryItem[]>([])
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [pendingSubmitData, setPendingSubmitData] = useState<InventoryFormData | null>(null)

  const addItem = useAddInventoryItem()
  const checkDuplicates = useCheckDuplicates()

  // Save market price snapshot when adding an item
  const savePriceSnapshot = useCallback(async (card: UnifiedCard) => {
    if (card.marketPrice == null) return
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
      }
      await fetch('/api/prices/snapshot', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
          marketPrice: card.marketPrice,
          gameType: card.gameType,
          productType: card.productType,
        }),
      })
    } catch (e) {
      console.warn('Failed to save price snapshot:', e)
    }
  }, [])

  const resetState = () => {
    setSelectedCard(null)
    setDuplicates([])
    setPendingSubmitData(null)
  }

  const performAdd = async (data: InventoryFormData) => {
    if (!selectedCard) return

    // Save market price from search results so it shows up immediately
    await savePriceSnapshot(selectedCard)

    await addItem.mutateAsync({
      card_id: selectedCard.id,
      card_name: selectedCard.name,
      card_image: selectedCard.imageSmall,
      set_name: selectedCard.setName,
      location: data.location,
      condition: data.condition,
      acquisition_cost: data.acquisitionCost,
      quantity: data.quantity,
      notes: data.notes,
      game_type: selectedCard.gameType,
      product_type: selectedCard.productType,
    })
    resetState()
    onClose()
  }

  const handleFormSubmit = async (data: InventoryFormData) => {
    if (!selectedCard) return

    try {
      const existingItems = await checkDuplicates.mutateAsync(selectedCard.id)

      if (existingItems.length > 0) {
        setDuplicates(existingItems as unknown as InventoryItem[])
        setPendingSubmitData(data)
        setShowDuplicateWarning(true)
        return
      }

      await performAdd(data)
    } catch (error) {
      console.error('Failed to add inventory item:', error)
    }
  }

  const handleDuplicateContinue = async () => {
    setShowDuplicateWarning(false)
    if (pendingSubmitData) {
      try {
        await performAdd(pendingSubmitData)
      } catch (error) {
        console.error('Failed to add inventory item:', error)
      }
    }
  }

  const handleCardSelect = (card: UnifiedCard) => {
    setSelectedCard(card)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title-add-inventory" className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl m-4 flex flex-col border-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-background to-accent/5 px-6 py-5">
          <h2 id="modal-title-add-inventory" className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent">
            Add {selectedCard?.productType === 'sealed' ? 'Sealed Product' : 'Card'} to Inventory
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-accent/50" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!selectedCard ? (
            <CardSearchPanel onCardSelect={handleCardSelect} />
          ) : (
            <InventoryForm
              selectedCard={selectedCard}
              onSubmit={handleFormSubmit}
              onBack={() => setSelectedCard(null)}
              isSubmitting={addItem.isPending}
            />
          )}
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        open={showDuplicateWarning}
        onClose={() => {
          setShowDuplicateWarning(false)
          setPendingSubmitData(null)
        }}
        onContinue={handleDuplicateContinue}
        duplicates={duplicates}
        cardName={selectedCard?.name || ''}
      />
    </div>
  )
}
