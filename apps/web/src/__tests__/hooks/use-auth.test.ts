import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'

// Mock supabase
const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: () => mockOnAuthStateChange(),
      signInWithPassword: (params: { email: string; password: string }) => mockSignInWithPassword(params),
      signUp: (params: { email: string; password: string }) => mockSignUp(params),
      signOut: () => mockSignOut(),
    },
  },
}))

describe('useAuth', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  }

  const mockSession = {
    access_token: 'mock-token',
    refresh_token: 'mock-refresh',
    user: mockUser,
    expires_at: Date.now() + 3600,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should load existing session on mount', async () => {
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.session).toEqual(mockSession)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle no session on mount', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should sign in successfully', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    let signInResult
    await act(async () => {
      signInResult = await result.current.signIn('test@example.com', 'password123')
    })

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(signInResult).toEqual({ user: mockUser, session: mockSession })
  })

  it('should throw error on sign in failure', async () => {
    const mockError = new Error('Invalid credentials')
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.signIn('test@example.com', 'wrongpassword')
      })
    ).rejects.toThrow('Invalid credentials')
  })

  it('should sign up successfully', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    let signUpResult
    await act(async () => {
      signUpResult = await result.current.signUp('new@example.com', 'password123')
    })

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password123',
    })
    expect(signUpResult).toEqual({ user: mockUser, session: mockSession })
  })

  it('should throw error on sign up failure', async () => {
    const mockError = new Error('Email already exists')
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.signUp('existing@example.com', 'password123')
      })
    ).rejects.toThrow('Email already exists')
  })

  it('should sign out successfully', async () => {
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null })
    mockSignOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('should throw error on sign out failure', async () => {
    const mockError = new Error('Sign out failed')
    mockSignOut.mockResolvedValue({ error: mockError })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.signOut()
      })
    ).rejects.toThrow('Sign out failed')
  })

  it('should unsubscribe from auth changes on unmount', async () => {
    const mockUnsubscribe = vi.fn()
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })

    const { unmount } = renderHook(() => useAuth())

    unmount()

    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
