'use client'

interface PasswordStrengthIndicatorProps {
  password: string
}

function calculateStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  // Bonus for length
  if (password.length >= 12) score++

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-orange-500' }
  if (score <= 4) return { score: 3, label: 'Good', color: 'bg-yellow-500' }
  return { score: 4, label: 'Strong', color: 'bg-emerald-500' }
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const { score, label, color } = calculateStrength(password)

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`h-1 flex-1 rounded-full transition-colors ${
              segment <= score ? color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        score <= 1 ? 'text-red-400' :
        score === 2 ? 'text-orange-400' :
        score === 3 ? 'text-yellow-400' :
        'text-emerald-400'
      }`}>
        {label}
      </p>
    </div>
  )
}
