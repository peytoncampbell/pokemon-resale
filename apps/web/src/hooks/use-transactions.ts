import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  supabase,
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionItem,
  TransactionItemInsert,
  InventoryInsert,
} from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import { getCurrentUserId } from '@/lib/auth-helpers'

export type { Transaction, TransactionItem }

export type TransactionType = 'BUY' | 'SELL' | 'TRADE'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

export interface TransactionWithItems extends Transaction {
  transaction_items: TransactionItem[]
}

export interface TransactionFilters {
  type?: TransactionType
  status?: TransactionStatus
  startDate?: string
  endDate?: string
}

export interface TransactionStats {
  totalBuys: number
  totalSells: number
  totalTrades: number
  totalCashOut: number
  totalCashIn: number
  netCashFlow: number
}

// Item data for creating transactions
export interface TransactionItemData {
  direction: 'IN' | 'OUT'
  card_id: string
  card_name: string
  card_image?: string | null
  set_name?: string | null
  game_type?: 'pokemon' | 'onepiece'
  condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
  inventory_id?: string | null // Required for OUT items
  quantity?: number
  unit_value?: number
  location?: string
  notes?: string | null
}

export interface CreateTransactionData {
  type: TransactionType
  counterparty_name: string
  counterparty_type?: 'STORE' | 'PERSON' | 'ONLINE' | 'OTHER' | null
  platform?: string | null
  cash_out?: number
  cash_in?: number
  fees?: number
  transaction_date?: string
  status?: TransactionStatus
  notes?: string | null
  items: TransactionItemData[]
}

// List transactions with optional filters
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      let query = supabase
        .from('transactions')
        .select('*, transaction_items(*)')
        .eq('organization_id', orgId)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.startDate) {
        query = query.gte('transaction_date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('transaction_date', filters.endDate)
      }

      const { data, error } = await query

      if (error) throw error

      // Type assertion needed because Supabase types don't understand joins
      return data as unknown as TransactionWithItems[]
    },
  })
}

// Get single transaction with items
export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: async () => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data, error } = await supabase
        .from('transactions')
        .select('*, transaction_items(*)')
        .eq('id', id)
        .eq('organization_id', orgId)
        .single()

      if (error) throw error

      // Type assertion needed because Supabase types don't understand joins
      return data as unknown as TransactionWithItems
    },
    enabled: !!id,
  })
}

// Get transaction statistics
export function useTransactionStats() {
  return useQuery({
    queryKey: ['transactions', 'stats'],
    queryFn: async (): Promise<TransactionStats> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) {
        return {
          totalBuys: 0,
          totalSells: 0,
          totalTrades: 0,
          totalCashOut: 0,
          totalCashIn: 0,
          netCashFlow: 0,
        }
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('type, cash_out, cash_in, fees, status')
        .eq('organization_id', orgId)
        .eq('status', 'COMPLETED')

      if (error) throw error

      const stats = (data || []).reduce(
        (acc, t) => {
          if (t.type === 'BUY') acc.totalBuys++
          if (t.type === 'SELL') acc.totalSells++
          if (t.type === 'TRADE') acc.totalTrades++
          acc.totalCashOut += Number(t.cash_out) || 0
          acc.totalCashIn += Number(t.cash_in) || 0
          return acc
        },
        {
          totalBuys: 0,
          totalSells: 0,
          totalTrades: 0,
          totalCashOut: 0,
          totalCashIn: 0,
          netCashFlow: 0,
        }
      )

      stats.netCashFlow = stats.totalCashIn - stats.totalCashOut

      return stats
    },
  })
}

// Create a transaction with items and auto-manage inventory
export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      // 1. Create the transaction
      const transactionInsert: TransactionInsert = {
        organization_id: orgId,
        user_id: userId,
        type: data.type,
        counterparty_name: data.counterparty_name,
        counterparty_type: data.counterparty_type,
        platform: data.platform,
        cash_out: data.cash_out || 0,
        cash_in: data.cash_in || 0,
        fees: data.fees || 0,
        transaction_date: data.transaction_date,
        status: data.status || 'COMPLETED',
        notes: data.notes,
      }

      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert(transactionInsert)
        .select()
        .single()

      if (txError) throw txError

      // 2. Process items
      for (const item of data.items) {
        let inventoryId = item.inventory_id

        // For IN items, create new inventory entries
        if (item.direction === 'IN') {
          const inventoryInsert: InventoryInsert = {
            user_id: userId,
            organization_id: orgId,
            card_id: item.card_id,
            card_name: item.card_name,
            card_image: item.card_image || null,
            set_name: item.set_name || null,
            location: item.location || 'BIN-01',
            condition: item.condition || 'NM',
            acquisition_cost: item.unit_value || 0,
            quantity: item.quantity || 1,
            status: 'IN_STOCK',
            notes: item.notes || null,
            game_type: item.game_type || 'pokemon',
          }

          const { data: newInventory, error: invError } = await supabase
            .from('inventory')
            .insert(inventoryInsert)
            .select()
            .single()

          if (invError) throw invError

          inventoryId = newInventory.id
        }

        // For OUT items, mark inventory as SOLD
        if (item.direction === 'OUT' && item.inventory_id) {
          const { error: updateError } = await supabase
            .from('inventory')
            .update({ status: 'SOLD' })
            .eq('id', item.inventory_id)

          if (updateError) throw updateError
        }

        // Create transaction item
        const itemInsert: TransactionItemInsert = {
          transaction_id: transaction.id,
          direction: item.direction,
          card_id: item.card_id,
          card_name: item.card_name,
          card_image: item.card_image,
          set_name: item.set_name,
          game_type: item.game_type || 'pokemon',
          condition: item.condition || 'NM',
          inventory_id: inventoryId,
          quantity: item.quantity || 1,
          unit_value: item.unit_value || 0,
          total_value: (item.unit_value || 0) * (item.quantity || 1),
          location: item.location || 'BIN-01',
          notes: item.notes,
        }

        const { error: itemError } = await supabase
          .from('transaction_items')
          .insert(itemInsert)

        if (itemError) throw itemError
      }

      return transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

// Update transaction metadata (not items)
export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: TransactionUpdate & { id: string }) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data: result, error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (error) throw error

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

// Delete transaction and revert inventory changes
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      // 1. Get transaction with items
      const { data: transaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*, transaction_items(*)')
        .eq('id', id)
        .eq('organization_id', orgId)
        .single()

      if (fetchError) throw fetchError

      // Type assertion needed because Supabase types don't understand joins
      const typedTransaction = transaction as unknown as TransactionWithItems
      const items = typedTransaction.transaction_items

      // 2. Revert inventory changes
      for (const item of items) {
        if (item.direction === 'OUT' && item.inventory_id) {
          // Revert OUT items back to IN_STOCK
          await supabase
            .from('inventory')
            .update({ status: 'IN_STOCK' })
            .eq('id', item.inventory_id)
        }

        if (item.direction === 'IN' && item.inventory_id) {
          // Delete inventory items that were created by this transaction
          await supabase
            .from('inventory')
            .delete()
            .eq('id', item.inventory_id)
        }
      }

      // 3. Delete transaction (cascade deletes transaction_items)
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('organization_id', orgId)

      if (deleteError) throw deleteError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}
