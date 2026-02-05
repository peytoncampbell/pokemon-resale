/**
 * P&L (Profit & Loss) Calculation Utilities
 *
 * Client-side helpers for fee estimation, profit calculation, and formatting.
 * These complement the database triggers and functions for P&L tracking.
 */

import type {
  Platform,
  FeeEstimate,
  ConsumedLot,
  ItemPnL,
  InventoryStatus,
} from './types';

// ============================================
// Fee Calculation
// ============================================

/**
 * Calculate platform fees for a sale
 * Matches the fee calculation logic in database triggers
 */
export function calculateFeeEstimate(
  salePrice: number,
  platform: Platform
): FeeEstimate {
  let feeRate = 0;
  let fixedFee = 0;

  switch (platform) {
    case 'TCGPlayer':
      feeRate = 0.1075; // 10.75%
      fixedFee = 0.30;
      break;
    case 'eBay':
      feeRate = 0.136; // 13.6%
      fixedFee = 0.40;
      break;
    case 'Direct':
    case 'Other':
      feeRate = 0;
      fixedFee = 0;
      break;
  }

  const totalFees = salePrice * feeRate + fixedFee;
  const netProceeds = salePrice - totalFees;

  return {
    platform,
    sale_price: salePrice,
    fee_rate: feeRate,
    fixed_fee: fixedFee,
    total_fees: Number(totalFees.toFixed(2)),
    net_proceeds: Number(netProceeds.toFixed(2)),
  };
}

// ============================================
// Profit Calculation
// ============================================

/**
 * Calculate realized profit from a sale using FIFO lot consumption
 */
export function calculateRealizedProfit(
  salePrice: number,
  consumedLots: ConsumedLot[],
  fees: number,
  shippingCost: number = 0
): {
  cost_basis: number;
  gross_profit: number;
  net_profit: number;
  roi_percentage: number;
} {
  // Sum up cost basis from all consumed lots
  const costBasis = consumedLots.reduce((sum, lot) => {
    return sum + lot.quantity_consumed * lot.unit_cost;
  }, 0);

  const grossProfit = salePrice - costBasis;
  const netProfit = grossProfit - fees - shippingCost;
  const roiPercentage = costBasis > 0 ? (netProfit / costBasis) * 100 : 0;

  return {
    cost_basis: Number(costBasis.toFixed(2)),
    gross_profit: Number(grossProfit.toFixed(2)),
    net_profit: Number(netProfit.toFixed(2)),
    roi_percentage: Number(roiPercentage.toFixed(2)),
  };
}

/**
 * Calculate unrealized gain for unsold inventory
 */
export function calculateUnrealizedGain(
  costBasis: number,
  currentMarketPrice: number | null,
  quantity: number
): {
  current_market_value: number | null;
  unrealized_gain: number | null;
  gain_percentage: number | null;
} {
  if (currentMarketPrice === null || currentMarketPrice === undefined) {
    return {
      current_market_value: null,
      unrealized_gain: null,
      gain_percentage: null,
    };
  }

  const marketValue = currentMarketPrice * quantity;
  const unrealizedGain = marketValue - costBasis;
  const gainPercentage = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;

  return {
    current_market_value: Number(marketValue.toFixed(2)),
    unrealized_gain: Number(unrealizedGain.toFixed(2)),
    gain_percentage: Number(gainPercentage.toFixed(2)),
  };
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(profit: number, costBasis: number): number {
  if (costBasis === 0) return 0;
  return Number(((profit / costBasis) * 100).toFixed(2));
}

// ============================================
// Status Transition Validation
// ============================================

const VALID_TRANSITIONS: Record<InventoryStatus, InventoryStatus[]> = {
  IN_STOCK: ['LISTED', 'SOLD'],
  LISTED: ['IN_STOCK', 'SOLD'],
  SOLD: ['SHIPPED', 'IN_STOCK'], // IN_STOCK for cancellations
  SHIPPED: [], // Terminal state
};

/**
 * Check if a status transition is valid
 * Mirrors the database trigger logic for client-side validation
 */
export function isValidStatusTransition(
  fromStatus: InventoryStatus,
  toStatus: InventoryStatus
): boolean {
  if (fromStatus === toStatus) return true; // No change
  const allowedTransitions = VALID_TRANSITIONS[fromStatus] || [];
  return allowedTransitions.includes(toStatus);
}

/**
 * Get allowed next statuses for current status
 */
export function getAllowedStatusTransitions(
  currentStatus: InventoryStatus
): InventoryStatus[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}

// ============================================
// Formatting Utilities
// ============================================

/**
 * Format a P&L value with proper sign and color class
 */
export function formatPnL(value: number): {
  formatted: string;
  colorClass: string;
  isPositive: boolean;
} {
  const isPositive = value >= 0;
  const formatted = `${isPositive ? '+' : ''}$${Math.abs(value).toFixed(2)}`;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return { formatted, colorClass, isPositive };
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number): {
  formatted: string;
  colorClass: string;
  isPositive: boolean;
} {
  const isPositive = value >= 0;
  const formatted = `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return { formatted, colorClass, isPositive };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Calculate average cost per unit from lots
 */
export function calculateAverageCost(
  quantity: number,
  costBasis: number
): number {
  if (quantity === 0) return 0;
  return Number((costBasis / quantity).toFixed(2));
}
