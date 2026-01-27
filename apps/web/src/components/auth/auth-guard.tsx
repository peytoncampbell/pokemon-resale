"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/auth-provider'
import { useOrganization } from '@/hooks/use-organization'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireOrganization?: boolean
}

export function AuthGuard({ children, requireOrganization = true }: AuthGuardProps) {
  const { user, loading: authLoading } = useAuthContext()
  const { data: organization, isLoading: orgLoading } = useOrganization()
  const router = useRouter()

  const loading = authLoading || (user && requireOrganization && orgLoading)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!authLoading && user && requireOrganization && !orgLoading && !organization) {
      router.push('/setup')
    }
  }, [user, authLoading, organization, orgLoading, requireOrganization, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-vision-blue" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireOrganization && !organization) {
    return null
  }

  return <>{children}</>
}
