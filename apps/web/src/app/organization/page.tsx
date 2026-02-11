"use client"

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  useOrganization, 
  useOrganizationInvites,
  useUpdateOrganization,
  useRegenerateInviteCode,
  useDeleteInvite,
  useRemoveMember
} from '@/hooks/use-organization'
import { usePermissions, useOrganizationMembersWithRoles } from '@/hooks/use-permissions'
import { useAuthContext } from '@/components/providers/auth-provider'
import { InviteModal } from '@/components/organization/invite-modal'
import { 
  Building2, 
  Copy, 
  Check, 
  RefreshCw, 
  Users, 
  Mail, 
  Trash2,
  Loader2,
  UserPlus,
  Shield
} from 'lucide-react'

export default function OrganizationPage() {
  const { user } = useAuthContext()
  const { data: organization, isLoading: orgLoading } = useOrganization()
  const { data: members, isLoading: membersLoading } = useOrganizationMembersWithRoles()
  const { data: invites, isLoading: invitesLoading } = useOrganizationInvites()
  const { canManageSettings, canManageMembers, isAdmin, role } = usePermissions()
  
  const updateOrg = useUpdateOrganization()
  const regenerateCode = useRegenerateInviteCode()
  const deleteInvite = useDeleteInvite()
  const removeMember = useRemoveMember()
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const handleCopyCode = async () => {
    if (organization?.invite_code) {
      await navigator.clipboard.writeText(organization.invite_code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleUpdateName = async () => {
    if (newName.trim() && newName !== organization?.name) {
      await updateOrg.mutateAsync({ name: newName.trim() })
    }
    setIsEditingName(false)
  }

  const handleRegenerateCode = async () => {
    if (confirm('Are you sure? Existing invite links will stop working.')) {
      await regenerateCode.mutateAsync()
    }
  }

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (memberUserId === user?.id) {
      if (!confirm('Are you sure you want to leave this organization?')) return
    } else {
      if (!confirm('Are you sure you want to remove this member?')) return
    }
    await removeMember.mutateAsync(memberId)
  }

  if (orgLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-vision-blue" />
        </div>
      </MainLayout>
    )
  }

  if (!organization) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-white/60">No organization found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Organization Settings"
          description="Manage your team and organization settings"
          actions={
            canManageMembers ? (
              <Button onClick={() => setIsInviteModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            ) : undefined
          }
        />

        {/* Permission Notice for non-admins */}
        {!isAdmin && role && (
          <div className="rounded-xl border border-vision-blue/20 bg-vision-blue/10 p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-vision-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                Your role: {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
              <p className="text-sm text-white/60 mt-1">
                {role === 'editor' 
                  ? 'You can manage inventory and transactions, but cannot modify organization settings or manage members.'
                  : 'You have read-only access. Contact an admin to manage inventory or change settings.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-vision-blue" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Organization name"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleUpdateName}
                      disabled={updateOrg.isPending}
                    >
                      {updateOrg.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditingName(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-white">{organization.name}</p>
                    {canManageSettings && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          setNewName(organization.name)
                          setIsEditingName(true)
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Invite Code</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-lg tracking-widest text-white">
                    {organization.invite_code}
                  </code>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleCopyCode}
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-vision-green" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  {canManageSettings && (
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={handleRegenerateCode}
                      disabled={regenerateCode.isPending}
                      title="Generate new code"
                    >
                      <RefreshCw className={`h-4 w-4 ${regenerateCode.isPending ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-white/40">
                  Share this code with others to let them join your organization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-vision-green" />
                Members
                {members && <Badge variant="secondary">{members.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-vision-blue" />
                </div>
              ) : members && members.length > 0 ? (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vision-purple to-vision-pink flex items-center justify-center text-white font-semibold">
                          {member.user_id === user?.id ? 'You' : 'M'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">
                              {member.user_id === user?.id ? 'You' : `Member`}
                            </p>
                            <Badge 
                              variant={
                                member.role === 'admin' ? 'default' : 
                                member.role === 'editor' ? 'secondary' : 
                                'outline'
                              }
                              className="text-xs"
                            >
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {canManageMembers && members.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id, member.user_id)}
                          disabled={removeMember.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          aria-label="Remove member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-center py-4">No members found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Invites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-vision-orange" />
              Pending Invites
              {invites && invites.length > 0 && <Badge variant="warning">{invites.length}</Badge>}
            </CardTitle>
            <CardDescription className="text-white/60">
              Email invitations that have been sent but not yet accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitesLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-vision-blue" />
              </div>
            ) : invites && invites.length > 0 ? (
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div 
                    key={invite.id} 
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-vision-orange/20 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-vision-orange" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{invite.email}</p>
                        <p className="text-xs text-white/40">
                          Sent {new Date(invite.created_at).toLocaleDateString()} · 
                          Expires {new Date(invite.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {canManageMembers && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteInvite.mutateAsync(invite.id)}
                        disabled={deleteInvite.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        aria-label="Delete invite"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-center py-4">No pending invites</p>
            )}
          </CardContent>
        </Card>
      </div>

      <InviteModal 
        open={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)}
        inviteCode={organization.invite_code}
      />
    </MainLayout>
  )
}
