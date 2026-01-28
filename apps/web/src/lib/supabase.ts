import { createClient } from '@supabase/supabase-js'

// Database types matching our schema - MUST be defined before createClient
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
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          joined_at?: string
        }
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
          status: 'IN_STOCK' | 'LISTED' | 'SOLD'
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
          status?: 'IN_STOCK' | 'LISTED' | 'SOLD'
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
          status?: 'IN_STOCK' | 'LISTED' | 'SOLD'
          notes?: string | null
          procurement_id?: string | null
          game_type?: 'pokemon' | 'onepiece'
          product_type?: 'card' | 'sealed'
          created_at?: string
          updated_at?: string
        }
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
          transaction_date?: string
          status?: 'PENDING' | 'COMPLETED' | 'CANCELLED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Create client AFTER Database type is defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Type exports
export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row']
export type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert']
export type OrganizationInvite = Database['public']['Tables']['organization_invites']['Row']
export type OrganizationInviteInsert = Database['public']['Tables']['organization_invites']['Insert']
export type InventoryItem = Database['public']['Tables']['inventory']['Row']
export type InventoryInsert = Database['public']['Tables']['inventory']['Insert']
export type Procurement = Database['public']['Tables']['procurements']['Row']
export type ProcurementInsert = Database['public']['Tables']['procurements']['Insert']
export type Sale = Database['public']['Tables']['sales']['Row']
export type SaleInsert = Database['public']['Tables']['sales']['Insert']
export type Supplier = Database['public']['Tables']['suppliers']['Row']
export type SupplierInsert = Database['public']['Tables']['suppliers']['Insert']
export type ProcurementExpectedItem = Database['public']['Tables']['procurement_expected_items']['Row']
export type ProcurementExpectedItemInsert = Database['public']['Tables']['procurement_expected_items']['Insert']
export type ProcurementAttachment = Database['public']['Tables']['procurement_attachments']['Row']
export type ProcurementAttachmentInsert = Database['public']['Tables']['procurement_attachments']['Insert']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']
export type TransactionItem = Database['public']['Tables']['transaction_items']['Row']
export type TransactionItemInsert = Database['public']['Tables']['transaction_items']['Insert']
