import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Organization, OrganizationMember, OrganizationInvite } from '@/lib/supabase'

export type { Organization, OrganizationMember, OrganizationInvite }

// Helper to get current user ID
async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

// Helper to get current user email
async function getCurrentUserEmail(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) throw new Error('Not authenticated')
  return user.email
}

// Generate an 8-character invite code
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Get current organization ID for the user
export async function getCurrentOrganizationId(): Promise<string | null> {
  const userId = await getCurrentUserId()
  
  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .single()
  
  if (error || !data) return null
  return data.organization_id
}

// Hook to get user's organization
export function useOrganization() {
  return useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      
      const { data: membership, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userId)
        .single()
      
      if (memberError || !membership) return null
      
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', membership.organization_id)
        .single()
      
      if (orgError) throw orgError
      
      return org as Organization
    },
  })
}

// Hook to get organization members
export function useOrganizationMembers() {
  return useQuery({
    queryKey: ['organization', 'members'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []
      
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', orgId)
        .order('joined_at', { ascending: true })
      
      if (error) throw error
      
      return data as OrganizationMember[]
    },
  })
}

// Hook to get organization invites
export function useOrganizationInvites() {
  return useQuery({
    queryKey: ['organization', 'invites'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []
      
      const { data, error } = await supabase
        .from('organization_invites')
        .select('*')
        .eq('organization_id', orgId)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return data as OrganizationInvite[]
    },
  })
}

// Hook to create an organization
export function useCreateOrganization() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (name: string) => {
      const userId = await getCurrentUserId()
      
      // Generate a unique invite code (retry if collision)
      let inviteCode = generateInviteCode()
      let attempts = 0
      const maxAttempts = 10
      
      // Create the organization
      let orgError: any = null
      let org: any = null
      
      while (attempts < maxAttempts) {
        const { data, error } = await supabase
          .from('organizations')
          .insert({
            name,
            invite_code: inviteCode,
            created_by: userId,
          })
          .select()
          .single()
        
        if (!error) {
          org = data
          break
        }
        
        // If it's a unique constraint violation, try a new code
        if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
          inviteCode = generateInviteCode()
          attempts++
          continue
        }
        
        orgError = error
        break
      }
      
      if (orgError) {
        console.error('Error creating organization:', orgError)
        throw new Error(orgError.message || 'Failed to create organization')
      }
      
      if (!org) {
        throw new Error('Failed to create organization after multiple attempts')
      }
      
      // Add creator as first member
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: userId,
        })
      
      if (memberError) {
        console.error('Error adding creator as member:', memberError)
        // Try to clean up the organization if member insert fails
        await supabase.from('organizations').delete().eq('id', org.id)
        throw new Error(memberError.message || 'Failed to add you as a member')
      }
      
      return org as Organization
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
  })
}

// Hook to join organization by invite code
export function useJoinOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      // Use the SECURITY DEFINER function that handles everything
      // This bypasses RLS issues for new users joining
      const { data, error } = await supabase
        .rpc('join_organization_by_invite_code', { invite_code_input: inviteCode })

      if (error) {
        // Parse the error message from the function
        if (error.message?.includes('Invalid invite code')) {
          throw new Error('Invalid invite code')
        }
        if (error.message?.includes('already a member')) {
          throw new Error('You are already a member of this organization')
        }
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('Failed to join organization')
      }

      return { id: data[0].org_id, name: data[0].org_name }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
  })
}

// Hook to create email invite
export function useCreateInvite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (email: string) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      // Check if invite already exists
      const { data: existing } = await supabase
        .from('organization_invites')
        .select('id')
        .eq('organization_id', orgId)
        .eq('email', email.toLowerCase())
        .eq('status', 'PENDING')
        .single()
      
      if (existing) throw new Error('An invite for this email already exists')
      
      const { data, error } = await supabase
        .from('organization_invites')
        .insert({
          organization_id: orgId,
          email: email.toLowerCase(),
        })
        .select()
        .single()
      
      if (error) throw error
      
      return data as OrganizationInvite
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'invites'] })
    },
  })
}

// Hook to accept an invite (called when user with pending invite logs in)
export function useAcceptInvite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const userId = await getCurrentUserId()
      
      // Get the invite
      const { data: invite, error: inviteError } = await supabase
        .from('organization_invites')
        .select('*')
        .eq('id', inviteId)
        .single()
      
      if (inviteError || !invite) throw new Error('Invite not found')
      
      // Add as member
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: invite.organization_id,
          user_id: userId,
        })
      
      if (memberError) throw memberError
      
      // Update invite status
      await supabase
        .from('organization_invites')
        .update({ status: 'ACCEPTED' })
        .eq('id', inviteId)
      
      return invite
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
  })
}

// Hook to check for pending invites for current user
export function usePendingInvites() {
  return useQuery({
    queryKey: ['organization', 'pending-invites'],
    queryFn: async () => {
      const email = await getCurrentUserEmail()
      
      const { data, error } = await supabase
        .from('organization_invites')
        .select('*, organizations(name)')
        .eq('email', email.toLowerCase())
        .eq('status', 'PENDING')
      
      if (error) throw error
      
      return data
    },
  })
}

// Hook to delete an invite
export function useDeleteInvite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from('organization_invites')
        .delete()
        .eq('id', inviteId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'invites'] })
    },
  })
}

// Hook to remove a member
export function useRemoveMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'members'] })
    },
  })
}

// Hook to update organization name
export function useUpdateOrganization() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const { data, error } = await supabase
        .from('organizations')
        .update({ name })
        .eq('id', orgId)
        .select()
        .single()
      
      if (error) throw error
      
      return data as Organization
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
  })
}

// Hook to regenerate invite code
export function useRegenerateInviteCode() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const { data, error } = await supabase
        .from('organizations')
        .update({ invite_code: generateInviteCode() })
        .eq('id', orgId)
        .select()
        .single()
      
      if (error) throw error
      
      return data as Organization
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
  })
}
