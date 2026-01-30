'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedList({ children, className, staggerDelay = 50 }: AnimatedListProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-in fade-in-0 slide-in-from-bottom-2"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'backwards',
            animationDuration: '300ms',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

interface AnimatedGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedGrid({ children, className, staggerDelay = 30 }: AnimatedGridProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-in fade-in-0 zoom-in-95"
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'backwards',
            animationDuration: '300ms',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
