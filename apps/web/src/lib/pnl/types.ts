/**
 * P&L (Profit & Loss) Type Definitions
 *
 * These types align with the database schema for lot-based FIFO accounting,
 * transaction tracking, and import staging.
 */

// ============================================
// Enums and Constants
// ============================================

export type InventoryStatus = 'IN_STOCK' | 'LISTED' | 'SOLD' | 'SHIPPED';

export type Platform = 'TCGPlayer' | 'eBay' | 'Direct' | 'Other';

export type Condition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export type GameType = 'pokemon' | 'onepiece';

export type ProductType = 'card' | 'sealed';

// ============================================
// Acquisition Lot Tracking
// ============================================

export interface AcquisitionLot {
  id: string;
  inventory_id: string;
  organization_id: string;
  quantity_total: number;
  quantity_remaining: number;
  unit_cost: number;
  acquisition_date: string; // ISO date string (YYYY-MM-DD)
  grading_cost?: number;
  procurement_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsumedLot {
  lot_id: string;
  quantity_consumed: number;
  unit_cost: number;
}

// ============================================
// Transaction & Sales
// ============================================

export interface SaleRecordInput {
  inventory_id: string;
  quantity: number;
  sale_price: number; // Total sale price (quantity * unit_price)
  platform: Platform;
  shipping_cost?: number;
  fees?: number; // If not provided, will be auto-calculated by trigger
}

export interface ItemPnL {
  inventory_id: string;
  card_name: string;
  quantity_sold: number;
  sale_price: number;
  cost_basis: number; // From FIFO lot consumption
  fees: number;
  shipping_cost: number;
  gross_profit: number; // sale_price - cost_basis
  net_profit: number; // gross_profit - fees - shipping_cost
  roi_percentage: number; // (net_profit / cost_basis) * 100
  lots_consumed: ConsumedLot[];
}

// ============================================
// P&L Summary & Analytics
// ============================================

export interface PnLSummary {
  realized_profit: RealizedProfit;
  unrealized_gains: UnrealizedGain[];
  total_invested: number;
  total_revenue: number;
  total_fees: number;
  total_shipping_costs: number;
  net_profit: number;
  roi_percentage: number;
}

export interface RealizedProfit {
  total_sales: number;
  total_cost_basis: number;
  total_fees: number;
  total_shipping: number;
  gross_profit: number;
  net_profit: number;
  items_sold: number;
  average_roi: number;
}

export interface UnrealizedGain {
  inventory_id: string;
  card_name: string;
  card_image?: string | null;
  set_name?: string | null;
  condition: Condition;
  quantity: number;
  cost_basis: number; // From remaining lots
  current_market_price: number | null;
  current_market_value: number | null; // quantity * market_price
  unrealized_gain: number | null; // market_value - cost_basis
  gain_percentage: number | null; // (unrealized_gain / cost_basis) * 100
  oldest_acquisition_date: string | null; // For aging analysis
}

// ============================================
// Fee Estimation
// ============================================

export interface FeeEstimate {
  platform: Platform;
  sale_price: number;
  fee_rate: number;
  fixed_fee: number;
  total_fees: number;
  net_proceeds: number; // sale_price - total_fees
}

// ============================================
// CSV Import Staging
// ============================================

export interface ImportSession {
  session_id: string;
  organization_id: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  created_at: string;
}

export interface ImportRow {
  id: string;
  session_id: string;
  row_number: number;
  raw_data: Record<string, unknown>;
  is_valid: boolean;
  validation_errors: string[] | null;
  normalized_data: ImportRowNormalized | null;
  created_at: string;
}

export interface ImportRowNormalized {
  card_name: string;
  quantity: number;
  acquisition_cost: number;
  acquisition_date: string; // ISO date
  condition: Condition;
  card_id?: string;
  card_image?: string;
  set_name?: string;
  location?: string;
  game_type?: GameType;
  product_type?: ProductType;
  notes?: string;
}

// ============================================
// Fee Metadata (stored with transactions)
// ============================================

export interface FeeMetadata {
  platform: string;
  rate: number;
  fixed_fee: number;
  calculated_at: string;
  warning?: string;
}
