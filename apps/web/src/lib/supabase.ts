import { createClient } from '@supabase/supabase-js'

// Database types matching our schema
// To regenerate types from the database:
//   npm run db:types        - Generate from remote (requires SUPABASE_PROJECT_ID env var)
//   npm run db:types:local  - Generate from local Supabase instance
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
          joined_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'admin' | 'editor' | 'viewer'
          joined_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          joined_at?: string
        }
        Relationships: []
      }
      organization_invites: {
        Row: {
          id: string
          organization_id: string
          email: string
          status: 'PENDING' | 'ACCEPTED' | 'EXPIRED'
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED'
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED'
          created_at?: string
          expires_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          card_id: string
          card_name: string
          card_image: string | null
          set_name: string | null
          location: string
          condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          acquisition_cost: number
          quantity: number
          status: 'IN_STOCK' | 'LISTED' | 'SOLD' | 'SHIPPED'
          notes: string | null
          procurement_id: string | null
          game_type: 'pokemon' | 'onepiece'
          product_type: 'card' | 'sealed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          card_id: string
          card_name: string
          card_image?: string | null
          set_name?: string | null
          location?: string
          condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          acquisition_cost?: number
          quantity?: number
          status?: 'IN_STOCK' | 'LISTED' | 'SOLD' | 'SHIPPED'
          notes?: string | null
          procurement_id?: string | null
          game_type?: 'pokemon' | 'onepiece'
          product_type?: 'card' | 'sealed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          card_id?: string
          card_name?: string
          card_image?: string | null
          set_name?: string | null
          location?: string
          condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          acquisition_cost?: number
          quantity?: number
          status?: 'IN_STOCK' | 'LISTED' | 'SOLD' | 'SHIPPED'
          notes?: string | null
          procurement_id?: string | null
          game_type?: 'pokemon' | 'onepiece'
          product_type?: 'card' | 'sealed'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      procurements: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          supplier: string
          order_date: string
          subtotal: number
          shipping: number
          fees: number
          total: number
          status: 'PENDING' | 'RECEIVED' | 'CANCELLED'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          supplier: string
          order_date?: string
          subtotal?: number
          shipping?: number
          fees?: number
          total?: number
          status?: 'PENDING' | 'RECEIVED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          supplier?: string
          order_date?: string
          subtotal?: number
          shipping?: number
          fees?: number
          total?: number
          status?: 'PENDING' | 'RECEIVED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          inventory_id: string | null
          sale_price: number
          platform: string | null
          fees: number
          shipping_cost: number
          sold_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          inventory_id?: string | null
          sale_price: number
          platform?: string | null
          fees?: number
          shipping_cost?: number
          sold_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          inventory_id?: string | null
          sale_price?: number
          platform?: string | null
          fees?: number
          shipping_cost?: number
          sold_at?: string
          created_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          id: string
          organization_id: string
          name: string
          contact_name: string | null
          email: string | null
          phone: string | null
          website: string | null
          address: string | null
          rating: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: string | null
          rating?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          address?: string | null
          rating?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      procurement_expected_items: {
        Row: {
          id: string
          procurement_id: string
          card_id: string
          card_name: string
          card_image: string | null
          set_name: string | null
          expected_quantity: number
          received_quantity: number
          expected_cost: number | null
          notes: string | null
          status: 'PENDING' | 'RECEIVED' | 'PARTIAL' | 'MISSING'
          game_type: 'pokemon' | 'onepiece'
          created_at: string
        }
        Insert: {
          id?: string
          procurement_id: string
          card_id: string
          card_name: string
          card_image?: string | null
          set_name?: string | null
          expected_quantity?: number
          received_quantity?: number
          expected_cost?: number | null
          notes?: string | null
          status?: 'PENDING' | 'RECEIVED' | 'PARTIAL' | 'MISSING'
          game_type?: 'pokemon' | 'onepiece'
          created_at?: string
        }
        Update: {
          id?: string
          procurement_id?: string
          card_id?: string
          card_name?: string
          card_image?: string | null
          set_name?: string | null
          expected_quantity?: number
          received_quantity?: number
          expected_cost?: number | null
          notes?: string | null
          status?: 'PENDING' | 'RECEIVED' | 'PARTIAL' | 'MISSING'
          game_type?: 'pokemon' | 'onepiece'
          created_at?: string
        }
        Relationships: []
      }
      procurement_attachments: {
        Row: {
          id: string
          procurement_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          procurement_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          procurement_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          uploaded_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          type: 'BUY' | 'SELL' | 'TRADE'
          counterparty_name: string
          counterparty_type: 'STORE' | 'PERSON' | 'ONLINE' | 'OTHER' | null
          platform: string | null
          cash_out: number
          cash_in: number
          fees: number
          shipping_cost: number
          fee_metadata: Record<string, unknown>
          transaction_date: string
          status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          type: 'BUY' | 'SELL' | 'TRADE'
          counterparty_name: string
          counterparty_type?: 'STORE' | 'PERSON' | 'ONLINE' | 'OTHER' | null
          platform?: string | null
          cash_out?: number
          cash_in?: number
          fees?: number
          shipping_cost?: number
          fee_metadata?: Record<string, unknown>
          transaction_date?: string
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          type?: 'BUY' | 'SELL' | 'TRADE'
          counterparty_name?: string
          counterparty_type?: 'STORE' | 'PERSON' | 'ONLINE' | 'OTHER' | null
          platform?: string | null
          cash_out?: number
          cash_in?: number
          fees?: number
          shipping_cost?: number
          fee_metadata?: Record<string, unknown>
          transaction_date?: string
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      transaction_items: {
        Row: {
          id: string
          transaction_id: string
          direction: 'IN' | 'OUT'
          card_id: string
          card_name: string
          card_image: string | null
          set_name: string | null
          game_type: 'pokemon' | 'onepiece'
          condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          inventory_id: string | null
          quantity: number
          unit_value: number
          total_value: number
          location: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          direction: 'IN' | 'OUT'
          card_id: string
          card_name: string
          card_image?: string | null
          set_name?: string | null
          game_type?: 'pokemon' | 'onepiece'
          condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          inventory_id?: string | null
          quantity?: number
          unit_value?: number
          total_value?: number
          location?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          direction?: 'IN' | 'OUT'
          card_id?: string
          card_name?: string
          card_image?: string | null
          set_name?: string | null
          game_type?: 'pokemon' | 'onepiece'
          condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          inventory_id?: string | null
          quantity?: number
          unit_value?: number
          total_value?: number
          location?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          id: string
          organization_id: string
          card_id: string
          card_name: string
          market_price: number
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          card_id: string
          card_name: string
          market_price: number
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          card_id?: string
          card_name?: string
          market_price?: number
          source?: string
          created_at?: string
        }
        Relationships: []
      }
      tcg_cache: {
        Row: {
          id: string
          product_type: 'card' | 'sealed' | 'graded'
          game_type: 'pokemon' | 'onepiece'
          data: unknown
          source: 'justtcg' | 'tcgplayer' | 'ebay'
          created_at: string
          expires_at: string
        }
        Insert: {
          id: string
          product_type: 'card' | 'sealed' | 'graded'
          game_type: 'pokemon' | 'onepiece'
          data: unknown
          source: 'justtcg' | 'tcgplayer' | 'ebay'
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          product_type?: 'card' | 'sealed' | 'graded'
          game_type?: 'pokemon' | 'onepiece'
          data?: unknown
          source?: 'justtcg' | 'tcgplayer' | 'ebay'
          created_at?: string
          expires_at?: string
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          id: string
          organization_id: string
          initial_investment: number
          cash_reserves: number
          historical_inventory_cost: number
          historical_revenue: number
          historical_profit: number
          business_start_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          initial_investment?: number
          cash_reserves?: number
          historical_inventory_cost?: number
          historical_revenue?: number
          historical_profit?: number
          business_start_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          initial_investment?: number
          cash_reserves?: number
          historical_inventory_cost?: number
          historical_revenue?: number
          historical_profit?: number
          business_start_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'business_settings_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: true
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      price_alerts: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          card_id: string
          card_name: string
          card_image: string | null
          set_name: string | null
          condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          game_type: 'pokemon' | 'onepiece'
          alert_type: 'above' | 'below' | 'change_percent'
          target_price: number | null
          threshold_percent: number | null
          is_active: boolean
          is_triggered: boolean
          triggered_at: string | null
          triggered_price: number | null
          notify_in_app: boolean
          notify_email: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          card_id: string
          card_name: string
          card_image?: string | null
          set_name?: string | null
          condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          game_type?: 'pokemon' | 'onepiece'
          alert_type: 'above' | 'below' | 'change_percent'
          target_price?: number | null
          threshold_percent?: number | null
          is_active?: boolean
          is_triggered?: boolean
          triggered_at?: string | null
          triggered_price?: number | null
          notify_in_app?: boolean
          notify_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          card_id?: string
          card_name?: string
          card_image?: string | null
          set_name?: string | null
          condition?: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG'
          game_type?: 'pokemon' | 'onepiece'
          alert_type?: 'above' | 'below' | 'change_percent'
          target_price?: number | null
          threshold_percent?: number | null
          is_active?: boolean
          is_triggered?: boolean
          triggered_at?: string | null
          triggered_price?: number | null
          notify_in_app?: boolean
          notify_email?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          type: 'price_alert' | 'system' | 'report' | 'inventory'
          title: string
          message: string
          link: string | null
          is_read: boolean
          read_at: string | null
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          type: 'price_alert' | 'system' | 'report' | 'inventory'
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          read_at?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          type?: 'price_alert' | 'system' | 'report' | 'inventory'
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          read_at?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          name: string
          report_type: 'profit_loss' | 'inventory_valuation' | 'sales_by_platform' | 'sales_by_set' | 'inventory_aging' | 'tax_summary' | 'custom'
          config: Record<string, unknown>
          schedule_frequency: 'daily' | 'weekly' | 'monthly' | null
          schedule_day_of_week: number | null
          schedule_day_of_month: number | null
          schedule_email: string | null
          last_run_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          name: string
          report_type: 'profit_loss' | 'inventory_valuation' | 'sales_by_platform' | 'sales_by_set' | 'inventory_aging' | 'tax_summary' | 'custom'
          config?: Record<string, unknown>
          schedule_frequency?: 'daily' | 'weekly' | 'monthly' | null
          schedule_day_of_week?: number | null
          schedule_day_of_month?: number | null
          schedule_email?: string | null
          last_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          name?: string
          report_type?: 'profit_loss' | 'inventory_valuation' | 'sales_by_platform' | 'sales_by_set' | 'inventory_aging' | 'tax_summary' | 'custom'
          config?: Record<string, unknown>
          schedule_frequency?: 'daily' | 'weekly' | 'monthly' | null
          schedule_day_of_week?: number | null
          schedule_day_of_month?: number | null
          schedule_email?: string | null
          last_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      acquisition_lots: {
        Row: {
          id: string
          inventory_id: string
          organization_id: string
          quantity_total: number
          quantity_remaining: number
          unit_cost: number
          acquisition_date: string
          grading_cost: number
          procurement_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inventory_id: string
          organization_id: string
          quantity_total: number
          quantity_remaining: number
          unit_cost: number
          acquisition_date: string
          grading_cost?: number
          procurement_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inventory_id?: string
          organization_id?: string
          quantity_total?: number
          quantity_remaining?: number
          unit_cost?: number
          acquisition_date?: string
          grading_cost?: number
          procurement_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'acquisition_lots_inventory_id_fkey'
            columns: ['inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'acquisition_lots_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      import_staging: {
        Row: {
          id: string
          session_id: string
          organization_id: string
          row_number: number
          raw_data: Record<string, unknown>
          is_valid: boolean
          validation_errors: string[] | null
          normalized_data: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          organization_id: string
          row_number: number
          raw_data: Record<string, unknown>
          is_valid?: boolean
          validation_errors?: string[] | null
          normalized_data?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          organization_id?: string
          row_number?: number
          raw_data?: Record<string, unknown>
          is_valid?: boolean
          validation_errors?: string[] | null
          normalized_data?: Record<string, unknown> | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'import_staging_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_organization_by_invite_code: {
        Args: { code: string }
        Returns: { id: string; name: string }[]
      }
      join_organization_by_invite_code: {
        Args: { invite_code_input: string }
        Returns: { org_id: string; org_name: string }[]
      }
      get_organization_analytics: {
        Args: { org_id: string }
        Returns: {
          totalInventoryValue: number
          totalItems: number
          totalInvested: number
          itemsSold: number
          totalRevenue: number
          totalProfit: number
          pendingProcurements: number
          inventoryByStatus: {
            IN_STOCK: number
            LISTED: number
            SOLD: number
          }
          recentActivity: {
            date: string
            items_added: number
            value: number
          }[]
        }
      }
      consume_lots_fifo: {
        Args: { p_inventory_id: string; p_quantity: number }
        Returns: {
          lot_id: string
          quantity_consumed: number
          unit_cost: number
        }[]
      }
      validate_inventory_import: {
        Args: { p_session_id: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Create client - env vars are validated at runtime when auth/db calls are made
// The layout.tsx already checks for these before rendering the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper to validate Supabase is configured (call before making requests)
export function assertSupabaseConfigured(): void {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
}

// Type-safe table helpers
export type Tables = Database['public']['Tables']
export type TableName = keyof Tables

// Type exports
export type Organization = Tables['organizations']['Row']
export type OrganizationInsert = Tables['organizations']['Insert']
export type OrganizationMember = Tables['organization_members']['Row']
export type OrganizationMemberInsert = Tables['organization_members']['Insert']
export type OrganizationInvite = Tables['organization_invites']['Row']
export type OrganizationInviteInsert = Tables['organization_invites']['Insert']
export type InventoryItem = Tables['inventory']['Row']
export type InventoryInsert = Tables['inventory']['Insert']
export type InventoryUpdate = Tables['inventory']['Update']
export type Procurement = Tables['procurements']['Row']
export type ProcurementInsert = Tables['procurements']['Insert']
export type Sale = Tables['sales']['Row']
export type SaleInsert = Tables['sales']['Insert']
export type Supplier = Tables['suppliers']['Row']
export type SupplierInsert = Tables['suppliers']['Insert']
export type ProcurementExpectedItem = Tables['procurement_expected_items']['Row']
export type ProcurementExpectedItemInsert = Tables['procurement_expected_items']['Insert']
export type ProcurementAttachment = Tables['procurement_attachments']['Row']
export type ProcurementAttachmentInsert = Tables['procurement_attachments']['Insert']
export type Transaction = Tables['transactions']['Row']
export type TransactionInsert = Tables['transactions']['Insert']
export type TransactionUpdate = Tables['transactions']['Update']
export type TransactionItem = Tables['transaction_items']['Row']
export type TransactionItemInsert = Tables['transaction_items']['Insert']
export type BusinessSettings = Tables['business_settings']['Row']
export type BusinessSettingsInsert = Tables['business_settings']['Insert']
export type BusinessSettingsUpdate = Tables['business_settings']['Update']
export type AcquisitionLot = Tables['acquisition_lots']['Row']
export type AcquisitionLotInsert = Tables['acquisition_lots']['Insert']
export type AcquisitionLotUpdate = Tables['acquisition_lots']['Update']
export type ImportStaging = Tables['import_staging']['Row']
export type ImportStagingInsert = Tables['import_staging']['Insert']
export type ImportStagingUpdate = Tables['import_staging']['Update']

// Organization role type
export type OrganizationRole = 'admin' | 'editor' | 'viewer'
