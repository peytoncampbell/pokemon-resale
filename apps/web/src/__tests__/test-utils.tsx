import { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface WrapperProps {
  children: ReactNode
}

function TestWrapper({ children }: WrapperProps) {
  const queryClient = createTestQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

// Custom render that wraps with providers
function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: TestWrapper, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }

// Mock data factories
export const mockInventoryItem = (overrides = {}) => ({
  id: 'test-id-1',
  user_id: 'user-1',
  organization_id: 'org-1',
  card_id: 'card-1',
  card_name: 'Charizard',
  card_image: 'https://example.com/charizard.png',
  set_name: 'Base Set',
  location: 'BIN-01',
  condition: 'NM' as const,
  acquisition_cost: 100,
  quantity: 1,
  status: 'IN_STOCK' as const,
  notes: null,
  procurement_id: null,
  game_type: 'pokemon' as const,
  product_type: 'card' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const mockTransaction = (overrides = {}) => ({
  id: 'txn-1',
  organization_id: 'org-1',
  user_id: 'user-1',
  type: 'BUY' as const,
  counterparty_name: 'Test Store',
  counterparty_type: 'STORE' as const,
  platform: null,
  cash_out: 100,
  cash_in: 0,
  fees: 0,
  transaction_date: new Date().toISOString(),
  status: 'COMPLETED' as const,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const mockOrganization = (overrides = {}) => ({
  id: 'org-1',
  name: 'Test Organization',
  invite_code: 'TESTCODE',
  created_by: 'user-1',
  created_at: new Date().toISOString(),
  ...overrides,
})

export const mockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  ...overrides,
})
