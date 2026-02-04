'use client'

import Link from 'next/link'
import { useOnboarding } from '@/hooks/use-onboarding'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, X } from 'lucide-react'

export function GettingStartedChecklist() {
  const { steps, isComplete, isDismissed, dismiss, completedCount, totalSteps } = useOnboarding()

  if (isDismissed || isComplete) return null

  const progressPercent = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0

  return (
    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Getting Started</CardTitle>
          <button
            onClick={dismiss}
            className="p-1 text-white/40 hover:text-white/80 transition-colors rounded"
            aria-label="Dismiss getting started checklist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1">
            <span>{completedCount} of {totalSteps} complete</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/5 group"
          >
            {step.completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-white/30 group-hover:text-white/50 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className={`text-sm font-medium ${step.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                {step.label}
              </p>
              <p className="text-xs text-white/40 truncate">{step.description}</p>
            </div>
          </Link>
        ))}
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-white/40 hover:text-white/60"
            onClick={dismiss}
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
