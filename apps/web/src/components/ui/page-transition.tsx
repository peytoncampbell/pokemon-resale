'use client'

import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div
      className={cn(
        'animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      {children}
    </div>
  )
}

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <div
      className={cn('animate-in fade-in-0 duration-500', className)}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {children}
    </div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

const slideDirections = {
  up: 'slide-in-from-bottom-4',
  down: 'slide-in-from-top-4',
  left: 'slide-in-from-right-4',
  right: 'slide-in-from-left-4',
}

export function SlideIn({ children, direction = 'up', delay = 0, className }: SlideInProps) {
  return (
    <div
      className={cn(
        'animate-in fade-in-0',
        slideDirections[direction],
        'duration-500',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {children}
    </div>
  )
}
