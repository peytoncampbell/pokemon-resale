'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw]',
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  className = '',
  size = 'md',
  showCloseButton = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Store onClose in a ref to avoid re-triggering the effect
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      // Focus trap: focus the close button when dialog opens
      closeButtonRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }

    // Handle escape key
    const handleCancel = (e: Event) => {
      e.preventDefault()
      onCloseRef.current()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [open])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current
    if (!dialog) return

    const rect = dialog.getBoundingClientRect()
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width

    if (!isInDialog) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="backdrop:bg-background/90 backdrop:backdrop-blur-md bg-transparent p-0 w-full max-w-none"
      style={{ zIndex: 10001 }}
      aria-labelledby="dialog-title"
      aria-modal="true"
    >
      <div
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] m-4
          bg-background rounded-3xl shadow-2xl
          flex flex-col
          border border-white/10
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-background to-accent/5 px-6 py-5 rounded-t-3xl flex-shrink-0">
          <h2
            id="dialog-title"
            className="text-2xl font-bold bg-gradient-to-r from-vision-blue to-vision-cyan bg-clip-text text-transparent"
          >
            {title}
          </h2>
          {showCloseButton && (
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl hover:bg-accent/50"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </dialog>
  )
}

// Sub-components for better composition
interface DialogContentProps {
  children: ReactNode
  className?: string
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

interface DialogFooterProps {
  children: ReactNode
  className?: string
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`flex items-center justify-end gap-3 border-t border-white/10 bg-accent/5 px-6 py-4 rounded-b-3xl flex-shrink-0 ${className}`}>
      {children}
    </div>
  )
}
