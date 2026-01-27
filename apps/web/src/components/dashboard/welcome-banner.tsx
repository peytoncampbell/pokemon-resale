"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useAuthContext } from "@/components/providers/auth-provider"

export function WelcomeBanner() {
  const { user } = useAuthContext()
  
  // Get first name from email or use a default
  const firstName = user?.email?.split('@')[0] || 'User'
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-[#0075FF] via-[#00A3FF] to-[#00E5FF]">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="p-8 space-y-3">
            <p className="text-white/80 text-sm">Welcome back,</p>
            <h2 className="text-3xl font-bold text-white">{displayName}</h2>
            <p className="text-white/70 text-sm max-w-xs">
              Glad to see you again! Track your Pokemon card inventory and monitor your sales.
            </p>
            <button className="flex items-center gap-2 text-white text-sm font-medium hover:gap-3 transition-all mt-4 group">
              Tap to record
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Decorative Pokemon-style illustration */}
          <div className="relative w-64 h-48 hidden md:block">
            {/* Abstract decorative shapes */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-80">
                {/* Pokeball-inspired design */}
                <defs>
                  <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Main circle */}
                <circle cx="100" cy="100" r="80" fill="url(#ballGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" filter="url(#glow)" />
                
                {/* Center line */}
                <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                
                {/* Center button */}
                <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
                <circle cx="100" cy="100" r="10" fill="white" />
                
                {/* Sparkles */}
                <circle cx="60" cy="60" r="4" fill="rgba(255,255,255,0.8)" />
                <circle cx="140" cy="50" r="3" fill="rgba(255,255,255,0.6)" />
                <circle cx="150" cy="140" r="5" fill="rgba(255,255,255,0.7)" />
              </svg>
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-4 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-12 right-8 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100" />
            <div className="absolute bottom-8 right-16 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
