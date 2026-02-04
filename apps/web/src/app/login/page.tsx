"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator'

type ViewMode = 'signin' | 'signup' | 'forgot'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('signin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuthContext()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (viewMode === 'forgot') {
        await resetPassword(email)
        setError('Check your email for a password reset link!')
      } else if (viewMode === 'signup') {
        await signUp(email, password)
        setError('Check your email to confirm your account!')
      } else {
        await signIn(email, password)
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const switchView = (mode: ViewMode) => {
    setViewMode(mode)
    setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl icon-bg-blue text-white font-bold text-xl shadow-lg shadow-vision-blue/30">
              P
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-white">
            {viewMode === 'forgot'
              ? 'Reset your password'
              : viewMode === 'signup'
                ? 'Create an account'
                : 'Welcome back'}
          </CardTitle>
          <CardDescription className="text-center text-white/60">
            {viewMode === 'forgot'
              ? 'Enter your email and we\'ll send you a reset link'
              : viewMode === 'signup'
                ? 'Enter your email to create your account'
                : 'Enter your credentials to access your inventory'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className={`rounded-xl p-3 text-sm ${
                error.includes('Check your email')
                  ? 'bg-vision-green/10 text-vision-green border border-vision-green/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {viewMode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
                {viewMode === 'signup' && <PasswordStrengthIndicator password={password} />}
              </div>
            )}
            {viewMode === 'signup' && (
              <div className="flex items-start gap-2">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-vision-blue focus:ring-vision-blue"
                  disabled={loading}
                />
                <Label htmlFor="agree-terms" className="text-sm text-white/60 leading-tight">
                  I agree to the{' '}
                  <a href="/terms" className="text-vision-blue hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-vision-blue hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                </Label>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || (viewMode === 'signup' && !agreeToTerms)}
            >
              {loading
                ? 'Loading...'
                : viewMode === 'forgot'
                  ? 'Send Reset Link'
                  : viewMode === 'signup'
                    ? 'Sign Up'
                    : 'Sign In'}
            </Button>

            {viewMode === 'signin' && (
              <button
                type="button"
                className="text-sm text-white/50 hover:text-white/80 transition-colors"
                onClick={() => switchView('forgot')}
                disabled={loading}
              >
                Forgot password?
              </button>
            )}

            {viewMode === 'forgot' && (
              <button
                type="button"
                className="text-sm text-white/50 hover:text-white/80 transition-colors"
                onClick={() => switchView('signin')}
                disabled={loading}
              >
                Back to sign in
              </button>
            )}

            {viewMode !== 'forgot' && (
              <>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-white/40">or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </>
            )}

            {viewMode !== 'forgot' && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => switchView(viewMode === 'signup' ? 'signin' : 'signup')}
                disabled={loading}
              >
                {viewMode === 'signup'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
