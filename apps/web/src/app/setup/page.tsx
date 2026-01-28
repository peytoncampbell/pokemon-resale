"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateOrganization, useJoinOrganization, useOrganization } from '@/hooks/use-organization'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Building2, Users, ArrowRight, Loader2 } from 'lucide-react'

type SetupMode = 'choose' | 'create' | 'join'

export default function SetupPage() {
  const { data: existingOrg, isLoading: orgLoading } = useOrganization()
  const [mode, setMode] = useState<SetupMode>('choose')
  const [orgName, setOrgName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { user, loading: authLoading } = useAuthContext()
  const createOrg = useCreateOrganization()
  const joinOrg = useJoinOrganization()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // Redirect to dashboard if already has organization
  useEffect(() => {
    if (!orgLoading && existingOrg) {
      router.push('/')
    }
  }, [orgLoading, existingOrg, router])

  // Show loading while checking auth/org status
  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vision-blue" />
      </div>
    )
  }

  // Don't render if no user or already has org (redirect will happen)
  if (!user || existingOrg) {
    return null
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!orgName.trim()) {
      setError('Please enter an organization name')
      return
    }

    try {
      await createOrg.mutateAsync(orgName.trim())
      router.push('/')
    } catch (err: any) {
      console.error('Organization creation error:', err)
      // Show the actual error message from Supabase
      const errorMessage = err?.message || err?.error?.message || 'Failed to create organization'
      setError(errorMessage)
    }
  }

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code')
      return
    }

    try {
      await joinOrg.mutateAsync(inviteCode.trim())
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join organization')
    }
  }

  if (mode === 'choose') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl icon-bg-blue flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-vision-blue/30">
                P
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Pokemon Resale</h1>
            <p className="text-white/60">
              {user?.email ? `Signed in as ${user.email}` : 'Get started by creating or joining an organization'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card 
              className="cursor-pointer hover:shadow-lg hover:shadow-vision-blue/10 transition-all group"
              onClick={() => setMode('create')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl icon-bg-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Organization</h3>
                <p className="text-white/60 text-sm mb-4">
                  Start a new business and invite your team members to collaborate
                </p>
                <Button variant="outline" className="w-full group-hover:bg-white/10">
                  Create New <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg hover:shadow-vision-green/10 transition-all group"
              onClick={() => setMode('join')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl icon-bg-green flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Join Organization</h3>
                <p className="text-white/60 text-sm mb-4">
                  Enter an invite code to join an existing team
                </p>
                <Button variant="outline" className="w-full group-hover:bg-white/10">
                  Join Existing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Create Organization</CardTitle>
            <CardDescription className="text-white/60">
              Give your business a name. You can change this later.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateOrg}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-xl p-3 text-sm bg-red-500/10 text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  placeholder="My Pokemon Business"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={createOrg.isPending}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode('choose')}
                  disabled={createOrg.isPending}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={createOrg.isPending}
                  className="flex-1"
                >
                  {createOrg.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Organization'
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Join Organization</CardTitle>
            <CardDescription className="text-white/60">
              Enter the invite code you received from your team
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleJoinOrg}>
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
                  disabled={joinOrg.isPending}
                  className="uppercase tracking-widest text-center text-lg"
                  maxLength={8}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode('choose')}
                  disabled={joinOrg.isPending}
                  className="flex-1"
                >
                  Back
                </Button>
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
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    )
  }

  return null
}
