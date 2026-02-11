'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, Check } from 'lucide-react'
import { colors, animations, borderRadius, shadows } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

const CURRENT_VERSION = '2.1.0'
const LAST_SEEN_VERSION_KEY = 'pokemon_resale_last_seen_version'
const DONT_SHOW_AGAIN_KEY = 'pokemon_resale_changelog_dont_show'

interface ChangelogEntry {
  version: string
  date: string
  changes: {
    type: 'feature' | 'improvement' | 'fix'
    title: string
    description: string
  }[]
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.1.0',
    date: '2026-02-11',
    changes: [
      {
        type: 'feature',
        title: 'Onboarding Tour',
        description: 'New users now get an interactive guided tour of key features to help them get started quickly.',
      },
      {
        type: 'feature',
        title: 'Design Tokens System',
        description: 'Centralized design system for consistent styling across all components.',
      },
      {
        type: 'improvement',
        title: 'Performance Optimizations',
        description: 'Improved loading times and reduced bundle size for faster page loads.',
      },
    ],
  },
  {
    version: '2.0.0',
    date: '2026-02-04',
    changes: [
      {
        type: 'feature',
        title: 'Platform Fee Presets',
        description: 'Auto-calculate fees for eBay (13.25%), TCGPlayer (10.25%), and other platforms.',
      },
      {
        type: 'feature',
        title: 'Shipping Cost Tracking',
        description: 'Track shipping costs on all transactions for accurate P&L calculations.',
      },
      {
        type: 'feature',
        title: 'Price Freshness Indicators',
        description: 'See how recent your price data is with color-coded freshness badges.',
      },
      {
        type: 'improvement',
        title: 'Enhanced Error Handling',
        description: 'Granular error boundaries and toast notifications for better user feedback.',
      },
      {
        type: 'fix',
        title: 'Rate Limit Handling',
        description: 'Improved API reliability with exponential backoff on rate-limited requests.',
      },
    ],
  },
]

const typeConfig = {
  feature: {
    label: 'New',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
  },
  improvement: {
    label: 'Improved',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
  },
  fix: {
    label: 'Fixed',
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
  },
}

export function ChangelogModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    // Check if user has opted out of changelog
    const dontShow = localStorage.getItem(DONT_SHOW_AGAIN_KEY) === 'true'
    if (dontShow) return

    // Check if there's a new version
    const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY)
    if (lastSeenVersion !== CURRENT_VERSION) {
      // Show modal after a brief delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    // Mark current version as seen
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION)
    
    // If user checked "don't show again", persist that
    if (dontShowAgain) {
      localStorage.setItem(DONT_SHOW_AGAIN_KEY, 'true')
    }
    
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-title"
      style={{ backgroundColor: 'rgba(11, 20, 55, 0.9)' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden"
        style={{
          background: 'linear-gradient(127deg, rgba(15, 21, 53, 0.98) 0%, rgba(26, 31, 55, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.glass,
        }}
      >
        {/* Header */}
        <div 
          className="flex items-start justify-between p-6 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.vision.blue}, ${colors.vision.cyan})`,
                boxShadow: '0 4px 12px rgba(0, 117, 255, 0.3)',
              }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 
                id="changelog-title" 
                className="text-xl font-bold text-white"
              >
                What's New in v{CURRENT_VERSION}
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Check out the latest features and improvements
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors"
            style={{ transition: animations.transition.fast }}
            aria-label="Close changelog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Changelog Content */}
        <div className="overflow-y-auto max-h-[50vh] p-6 space-y-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.version}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    v{entry.version}
                  </span>
                  <span className="text-sm text-white/40">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {entry.changes.map((change, idx) => {
                  const config = typeConfig[change.type]
                  return (
                    <div 
                      key={idx}
                      className={cn(
                        'p-4 rounded-xl border transition-colors',
                        config.bg,
                        config.border
                      )}
                      style={{ transition: animations.transition.normal }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <span 
                            className={cn(
                              'inline-block px-2 py-1 rounded-lg text-xs font-semibold',
                              config.color,
                              config.bg
                            )}
                          >
                            {config.label}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white mb-1">
                            {change.title}
                          </h3>
                          <p className="text-sm text-white/70">
                            {change.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="sr-only"
                />
                <div 
                  className={cn(
                    'h-5 w-5 rounded border-2 flex items-center justify-center transition-all',
                    dontShowAgain 
                      ? 'bg-vision-blue border-vision-blue' 
                      : 'border-white/20 bg-transparent'
                  )}
                  style={{ transition: animations.transition.fast }}
                >
                  {dontShowAgain && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Don't show this again
              </span>
            </label>

            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl text-white font-medium"
              style={{
                background: `linear-gradient(to right, ${colors.vision.blue}, ${colors.vision.cyan})`,
                transition: animations.transition.fast,
                borderRadius: borderRadius.xl,
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Reset the changelog modal (useful for testing or showing again)
 */
export function resetChangelogModal() {
  localStorage.removeItem(LAST_SEEN_VERSION_KEY)
  localStorage.removeItem(DONT_SHOW_AGAIN_KEY)
}

/**
 * Check if the user has seen the current version
 */
export function hasSeenCurrentVersion(): boolean {
  return localStorage.getItem(LAST_SEEN_VERSION_KEY) === CURRENT_VERSION
}
