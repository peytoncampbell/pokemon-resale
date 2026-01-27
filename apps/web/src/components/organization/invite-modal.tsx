"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateInvite } from '@/hooks/use-organization'
import { Copy, Check, Mail, Link2, Loader2, X } from 'lucide-react'

interface InviteModalProps {
  open: boolean
  onClose: () => void
  inviteCode: string
}

type InviteMethod = 'code' | 'email'

export function InviteModal({ open, onClose, inviteCode }: InviteModalProps) {
  const [method, setMethod] = useState<InviteMethod>('code')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  
  const createInvite = useCreateInvite()

  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/join?code=${inviteCode}` 
    : ''

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      await createInvite.mutateAsync(email.trim())
      setSuccess(`Invite sent to ${email}`)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite')
    }
  }

  const handleClose = () => {
    setEmail('')
    setError(null)
    setSuccess(null)
    setMethod('code')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-vision-navy/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Invite Team Member</CardTitle>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-white/60">
            Choose how you want to invite someone to your organization
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Method Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setMethod('code')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                method === 'code'
                  ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Link2 className="h-4 w-4" />
              Invite Code
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                method === 'email'
                  ? 'bg-gradient-to-r from-vision-blue to-vision-cyan text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Mail className="h-4 w-4" />
              Email Invite
            </button>
          </div>

          {method === 'code' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Invite Code</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-lg tracking-widest text-white text-center">
                    {inviteCode}
                  </code>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-vision-green" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Invite Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleCopyLink}
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-vision-green" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-white/40 text-center">
                Share the code or link with others to let them join your organization
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendInvite} className="space-y-4">
              {error && (
                <div className="rounded-xl p-3 text-sm bg-red-500/10 text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl p-3 text-sm bg-vision-green/10 text-vision-green border border-vision-green/20">
                  {success}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={createInvite.isPending}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={createInvite.isPending}
              >
                {createInvite.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invite
                  </>
                )}
              </Button>

              <p className="text-xs text-white/40 text-center">
                The invitee will need to sign up or log in to accept the invite
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
