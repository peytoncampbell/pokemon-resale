"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useJoinOrganization, useOrganization } from '@/hooks/use-organization'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Loader2, Users } from 'lucide-react'

export default function JoinPage() {
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get('code')
  
  const [inviteCode, setInviteCode] = useState(codeFromUrl?.toUpperCase() || '')
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { user, loading: authLoading } = useAuthContext()
  const { data: existingOrg, isLoading: orgLoading } = useOrganization()
  const joinOrg = useJoinOrganization()

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      // Store the invite code to use after login
      if (inviteCode) {
        sessionStorage.setItem('pendingInviteCode', inviteCode)
      }
      router.push('/login')
    }
  }, [authLoading, user, inviteCode, router])

  // If user already has an organization, show a message
  useEffect(() => {
    if (existingOrg && !orgLoading) {
      setError('You are already a member of an organization. You can only be part of one organization at a time.')
    }
  }, [existingOrg, orgLoading])

  // Check for pending invite code from before login
  useEffect(() => {
    if (user && !inviteCode) {
      const pending = sessionStorage.getItem('pendingInviteCode')
      if (pending) {
        setInviteCode(pending.toUpperCase())
        sessionStorage.removeItem('pendingInviteCode')
      }
    }
  }, [user, inviteCode])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code')
      return
    }

    if (existingOrg) {
      setError('You are already a member of an organization')
      return
    }

    try {
      await joinOrg.mutateAsync(inviteCode.trim())
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join organization')
    }
  }

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vision-blue" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl icon-bg-green flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Join Organization</CardTitle>
          <CardDescription className="text-white/60">
            Enter the invite code to join a team
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleJoin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-xl p-3 text-sm bg-red-500/10 text-red-400 border border-red-500/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                placeholder="ABCD1234"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                disabled={joinOrg.isPending || !!existingOrg}
                className="uppercase tracking-widest text-center text-lg"
                maxLength={8}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(existingOrg ? '/' : '/setup')}
                disabled={joinOrg.isPending}
                className="flex-1"
              >
                {existingOrg ? 'Go to Dashboard' : 'Back'}
              </Button>
              {!existingOrg && (
                <Button 
                  type="submit" 
                  disabled={joinOrg.isPending}
                  className="flex-1"
                >
                  {joinOrg.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join Organization'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
