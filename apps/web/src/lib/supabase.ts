import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Database types matching our schema
export type Database = {
  public: {
    Tables: {
      inventory: {
        Row: {
          id: string
          user_id: string
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
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
          created_at?: string
          updated_at?: string
        }
      }
      procurements: {
        Row: {
          id: string
          user_id: string
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
          inventory_id?: string | null
          sale_price?: number
          platform?: string | null
          fees?: number
          shipping_cost?: number
          sold_at?: string
          created_at?: string
        }
      }
    }
  }
}

export type InventoryItem = Database['public']['Tables']['inventory']['Row']
export type InventoryInsert = Database['public']['Tables']['inventory']['Insert']
export type Procurement = Database['public']['Tables']['procurements']['Row']
export type ProcurementInsert = Database['public']['Tables']['procurements']['Insert']
export type Sale = Database['public']['Tables']['sales']['Row']
export type SaleInsert = Database['public']['Tables']['sales']['Insert']
