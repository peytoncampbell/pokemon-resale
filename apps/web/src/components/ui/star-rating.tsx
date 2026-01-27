'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating === value ? 0 : rating)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={cn(
            'transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-white/20'
            )}
          />
        </button>
      ))}
    </div>
  )
}
