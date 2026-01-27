"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ReferralStats {
  invited: number
  bonus: number
}

interface ReferralCardProps {
  stats?: ReferralStats
  score?: number
  title?: string
}

export function ReferralCard({ 
  stats = { invited: 145, bonus: 1465 },
  score = 9.3,
  title = "Referral Tracking"
}: ReferralCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <div className="flex items-start justify-between">
          {/* Stats */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/60 mb-1">Invited</p>
              <p className="text-2xl font-bold text-white">{stats.invited} people</p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">Bonus</p>
              <p className="text-2xl font-bold text-white">{stats.bonus.toLocaleString()}</p>
            </div>
          </div>

          {/* Safety Score */}
          <div className="relative">
            <div className="w-32 h-32 relative">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {/* Background arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="235 80"
                />
                {/* Progress arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#referralGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 10) * 235} 315`}
                />
                <defs>
                  <linearGradient id="referralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#01B574" />
                    <stop offset="100%" stopColor="#00E5FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-white/60">Safety</span>
                <span className="text-3xl font-bold text-white">{score}</span>
                <span className="text-xs text-white/60">Total Score</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
