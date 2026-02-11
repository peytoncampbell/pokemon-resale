import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, OrganizationRole, OrganizationMember } from '@/lib/supabase'
import { getCurrentUserId } from '@/lib/auth-helpers'
import { getCurrentOrganizationId } from '@/hooks/use-organization'

/**
 * Permission matrix:
 * - admin: full access (CRUD all, manage members, change settings, delete org)
 * - editor: CRUD inventory, transactions, view reports
 * - viewer: read-only access to inventory, transactions, reports
 */

interface UserPermissions {
  role: OrganizationRole | null
  isLoading: boolean
  
  // Permission checks
  canEdit: boolean            // Can create/update/delete inventory and transactions
  canManageMembers: boolean   // Can add/remove members and manage invites
  canManageSettings: boolean  // Can update organization settings
  canDeleteOrg: boolean       // Can delete the organization
  canViewReports: boolean     // Can view reports (all roles)
  isAdmin: boolean
  isEditor: boolean
  isViewer: boolean
}

// Hook to get current user's role in their organization
export function usePermissions(): UserPermissions {
  const { data, isLoading } = useQuery({
    queryKey: ['organization', 'user-role'],
    queryFn: async () => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      
      if (!orgId) return null
      
      const { data: member, error } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', userId)
        .single()
      
      if (error || !member) return null
      
      return member.role as OrganizationRole
    },
  })

  const role = data ?? null
  
  return {
    role,
    isLoading,
    
    // Permission checks
    canEdit: role === 'admin' || role === 'editor',
    canManageMembers: role === 'admin',
    canManageSettings: role === 'admin',
    canDeleteOrg: role === 'admin',
    canViewReports: role !== null, // All roles can view reports
    
    // Role checks
    isAdmin: role === 'admin',
    isEditor: role === 'editor',
    isViewer: role === 'viewer',
  }
}

// Hook to get all organization members with their roles
export function useOrganizationMembersWithRoles() {
  return useQuery({
    queryKey: ['organization', 'members', 'with-roles'],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data, error } = await supabase
        .from('organization_members')
        .select('id, organization_id, user_id, role, joined_at')
        .eq('organization_id', orgId)
        .order('joined_at', { ascending: true })

      if (error) throw error

      return data as OrganizationMember[]
    },
  })
}

// Hook to update a member's role (admin only)
export function useUpdateMemberRole() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: OrganizationRole }) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')
      
      const { data, error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('id', memberId)
        .eq('organization_id', orgId) // Security: ensure member belongs to user's org
        .select()
        .single()
      
      if (error) throw error
      
      return data as OrganizationMember
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', 'members'] })
      queryClient.invalidateQueries({ queryKey: ['organization', 'members', 'with-roles'] })
      queryClient.invalidateQueries({ queryKey: ['organization', 'user-role'] })
    },
  })
}

// Hook to check if a specific user has a minimum role
export function useUserHasMinRole(minRole: OrganizationRole) {
  const { role } = usePermissions()
  
  if (!role) return false
  
  const roleHierarchy: Record<OrganizationRole, number> = {
    admin: 3,
    editor: 2,
    viewer: 1,
  }
  
  return roleHierarchy[role] >= roleHierarchy[minRole]
}
