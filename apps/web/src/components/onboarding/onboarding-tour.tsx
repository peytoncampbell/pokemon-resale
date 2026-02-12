'use client'

import { useState, useEffect } from 'react'
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride'
import { colors, animations, borderRadius, shadows } from '@/lib/design-tokens'

const ONBOARDING_COMPLETE_KEY = 'pokemon_resale_onboarding_complete'

export function OnboardingTour() {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    // Check if user has completed onboarding
    const isComplete = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true'
    
    if (!isComplete) {
      // Wait a moment for the page to render before starting
      const timer = setTimeout(() => {
        setRun(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Welcome to Pokemon Resale!</h2>
          <p className="text-white/80 mb-2">
            Let's take a quick tour of the key features to help you get started managing your TCG inventory and tracking sales.
          </p>
          <p className="text-sm text-white/60">
            This tour will only take a minute. You can skip it at any time.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Dashboard Overview</h3>
          <p className="text-white/80">
            Your dashboard shows portfolio metrics, P&L tracking, and deal analytics. Monitor your total inventory value, profit margins, and recent activity all in one place.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="add-inventory"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Add Inventory</h3>
          <p className="text-white/80">
            Click here to add cards to your inventory. Search for cards by name, scan them, or import in bulk. Track quantity, cost basis, condition, and storage location.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="search"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Card Search</h3>
          <p className="text-white/80">
            Use the search to quickly find cards in your inventory or look up market prices for new acquisitions. Supports Pokemon and One Piece TCG.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="record-sale"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Record a Sale</h3>
          <p className="text-white/80">
            Track sales with detailed transaction records. Record sale price, fees, shipping costs, and platform. P&L is calculated automatically with FIFO cost basis.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="reports"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-white mb-2">View Reports</h3>
          <p className="text-white/80 mb-2">
            Navigate to the Reports section for detailed analytics:
          </p>
          <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
            <li>P&L by time period</li>
            <li>Platform performance</li>
            <li>Inventory aging</li>
            <li>Tax summaries (Schedule D format)</li>
          </ul>
        </div>
      ),
      placement: 'left',
    },
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold text-white mb-3">You're All Set! 🎉</h2>
          <p className="text-white/80 mb-3">
            You've completed the tour! Start adding your inventory and tracking sales to see your analytics come to life.
          </p>
          <p className="text-sm text-white/60">
            Tip: Check the Getting Started checklist in the sidebar to track your progress through key tasks.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ]

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      // Mark onboarding as complete
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true')
      setRun(false)
    } else if (type === EVENTS.STEP_AFTER) {
      // Move to next step
      setStepIndex(index + 1)
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: colors.vision.blue,
          backgroundColor: colors.vision.navyLight,
          textColor: colors.foreground,
          overlayColor: 'rgba(11, 20, 55, 0.8)',
          zIndex: 999,
          arrowColor: colors.vision.navyLight,
        },
        tooltip: {
          borderRadius: borderRadius.xl,
          padding: '1.5rem',
          background: `linear-gradient(127deg, rgba(15, 21, 53, 0.98) 0%, rgba(26, 31, 55, 0.98) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.glass,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '0.5rem 0',
        },
        buttonNext: {
          backgroundColor: colors.vision.blue,
          color: colors.cardForeground,
          borderRadius: borderRadius.lg,
          padding: '0.5rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: animations.transition.fast,
          border: 'none',
          outline: 'none',
        },
        buttonBack: {
          color: colors.foreground,
          marginRight: '0.5rem',
          borderRadius: borderRadius.lg,
          padding: '0.5rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: animations.transition.fast,
        },
        buttonSkip: {
          color: colors.mutedForeground,
          fontSize: '0.875rem',
          fontWeight: '500',
        },
        buttonClose: {
          display: 'none', // Hide default close button, use Skip instead
        },
        beacon: {
          marginTop: '0.5rem',
        },
        beaconInner: {
          backgroundColor: colors.vision.cyan,
        },
        beaconOuter: {
          backgroundColor: colors.vision.blue,
          border: `2px solid ${colors.vision.cyan}`,
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      floaterProps={{
        disableAnimation: false,
        styles: {
          arrow: {
            length: 8,
            spread: 16,
          },
        },
      }}
    />
  )
}

/**
 * Reset the onboarding tour (useful for testing or re-showing)
 */
export function resetOnboardingTour() {
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY)
}

/**
 * Check if the user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true'
}
