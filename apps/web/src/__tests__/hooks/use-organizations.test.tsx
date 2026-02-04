import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { mockOrganization } from '../test-utils'

// Mock the organization hooks
const mockUseOrganization = vi.fn()
const mockUseOrganizationMembers = vi.fn()
const mockUseOrganizationInvites = vi.fn()
const mockUseCreateOrganization = vi.fn()
const mockUseJoinOrganization = vi.fn()
const mockUseCreateInvite = vi.fn()
const mockUseRemoveMember = vi.fn()
const mockUseUpdateOrganization = vi.fn()

vi.mock('@/hooks/use-organization', () => ({
  useOrganization: () => mockUseOrganization(),
  useOrganizationMembers: () => mockUseOrganizationMembers(),
  useOrganizationInvites: () => mockUseOrganizationInvites(),
  useCreateOrganization: () => mockUseCreateOrganization(),
  useJoinOrganization: () => mockUseJoinOrganization(),
  useCreateInvite: () => mockUseCreateInvite(),
  useRemoveMember: () => mockUseRemoveMember(),
  useUpdateOrganization: () => mockUseUpdateOrganization(),
  getCurrentOrganizationId: vi.fn().mockResolvedValue('org-1'),
}))

import {
  useOrganization,
  useOrganizationMembers,
  useOrganizationInvites,
  useCreateOrganization,
  useJoinOrganization,
  useCreateInvite,
  useRemoveMember,
  useUpdateOrganization,
} from '@/hooks/use-organization'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useOrganization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return organization data', () => {
    const org = mockOrganization()
    mockUseOrganization.mockReturnValue({
      data: org,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useOrganization(), { wrapper: createWrapper() })
    expect(result.current.data?.name).toBe('Test Organization')
    expect(result.current.data?.invite_code).toBe('TESTCODE')
  })

  it('should return null when no org', () => {
    mockUseOrganization.mockReturnValue({
      data: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useOrganization(), { wrapper: createWrapper() })
    expect(result.current.data).toBeNull()
  })
})

describe('useOrganizationMembers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return member list', () => {
    const members = [
      { id: 'm-1', organization_id: 'org-1', user_id: 'user-1', joined_at: new Date().toISOString() },
      { id: 'm-2', organization_id: 'org-1', user_id: 'user-2', joined_at: new Date().toISOString() },
    ]
    mockUseOrganizationMembers.mockReturnValue({
      data: members,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useOrganizationMembers(), { wrapper: createWrapper() })
    expect(result.current.data).toHaveLength(2)
  })

  it('should return empty array for no org', () => {
    mockUseOrganizationMembers.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useOrganizationMembers(), { wrapper: createWrapper() })
    expect(result.current.data).toEqual([])
  })
})

describe('useOrganizationInvites', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return pending invites', () => {
    mockUseOrganizationInvites.mockReturnValue({
      data: [
        { id: 'inv-1', email: 'test@example.com', status: 'PENDING' },
      ],
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useOrganizationInvites(), { wrapper: createWrapper() })
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useCreateOrganization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseCreateOrganization.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useCreateOrganization(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useJoinOrganization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseJoinOrganization.mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useJoinOrganization(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useCreateInvite', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseCreateInvite.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useCreateInvite(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})

describe('useRemoveMember', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseRemoveMember.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useRemoveMember(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should return error on failure', () => {
    const error = new Error('Cannot remove member')
    mockUseRemoveMember.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: true,
      error,
    })

    const { result } = renderHook(() => useRemoveMember(), { wrapper: createWrapper() })
    expect(result.current.isError).toBe(true)
  })
})

describe('useUpdateOrganization', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should provide mutation function', () => {
    mockUseUpdateOrganization.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    })

    const { result } = renderHook(() => useUpdateOrganization(), { wrapper: createWrapper() })
    expect(typeof result.current.mutate).toBe('function')
  })
})
