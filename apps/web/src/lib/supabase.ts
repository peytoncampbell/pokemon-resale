import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      Organizations: {
        Row: {
          Id: string
          Name: string
          Plan: string
          CreatedAt: string
        }
      }
      Cards: {
        Row: {
          Id: string
          SetCode: string
          Number: string
          Name: string
          Rarity: string
          AttributesJson: string | null
          CreatedAt: string
        }
      }
      Locations: {
        Row: {
          Id: string
          OrgId: string
          Name: string
          Type: string
          CreatedAt: string
        }
      }
      InventoryItems: {
        Row: {
          Id: string
          OrgId: string
          CardId: string
          Condition: string
          Grade: string | null
          AcquisitionCost: number
          LocationId: string
          Status: string
          PhotosJson: string | null
          CreatedAt: string
        }
      }
      Listings: {
        Row: {
          Id: string
          OrgId: string
          InventoryItemId: string
          Price: number
          Currency: string
          Status: string
          Channel: string
          CreatedAt: string
        }
      }
      ProcurementOrders: {
        Row: {
          Id: string
          OrgId: string
          Supplier: string
          Status: string
          Subtotal: number
          Shipping: number
          Fees: number
          Total: number
          Notes: string | null
          CreatedAt: string
        }
      }
    }
  }
}
