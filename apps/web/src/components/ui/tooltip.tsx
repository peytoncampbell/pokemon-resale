'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-vision-navy border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-vision-navy border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-vision-navy border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-vision-navy border-y-transparent border-l-transparent',
}

export function Tooltip({ children, content, position = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-vision-navy border border-white/10 rounded-lg shadow-lg whitespace-nowrap',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <span
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  )
}
