-- Migration: Add non-negative constraints to monetary columns
-- Created: 2026-02-02
-- Purpose: Ensure data integrity for financial values

-- Transactions table: cash_in, cash_out, fees must be non-negative
ALTER TABLE transactions
  ADD CONSTRAINT chk_transactions_cash_in_positive
    CHECK (cash_in >= 0),
  ADD CONSTRAINT chk_transactions_cash_out_positive
    CHECK (cash_out >= 0),
  ADD CONSTRAINT chk_transactions_fees_positive
    CHECK (fees >= 0);

-- Transaction items: unit_value and total_value must be non-negative
ALTER TABLE transaction_items
  ADD CONSTRAINT chk_transaction_items_unit_value_positive
    CHECK (unit_value >= 0),
  ADD CONSTRAINT chk_transaction_items_total_value_positive
    CHECK (total_value >= 0);

-- Business settings: all monetary values must be non-negative
ALTER TABLE business_settings
  ADD CONSTRAINT chk_business_settings_initial_investment_positive
    CHECK (initial_investment >= 0),
  ADD CONSTRAINT chk_business_settings_cash_reserves_positive
    CHECK (cash_reserves >= 0),
  ADD CONSTRAINT chk_business_settings_historical_cost_positive
    CHECK (historical_inventory_cost >= 0),
  ADD CONSTRAINT chk_business_settings_historical_revenue_positive
    CHECK (historical_revenue >= 0);

-- Inventory: acquisition_cost and quantity must be non-negative
ALTER TABLE inventory
  ADD CONSTRAINT chk_inventory_acquisition_cost_positive
    CHECK (acquisition_cost >= 0),
  ADD CONSTRAINT chk_inventory_quantity_positive
    CHECK (quantity >= 0);

COMMENT ON CONSTRAINT chk_transactions_cash_in_positive ON transactions
  IS 'Prevents negative cash inflows';
COMMENT ON CONSTRAINT chk_transactions_cash_out_positive ON transactions
  IS 'Prevents negative cash outflows';
COMMENT ON CONSTRAINT chk_transactions_fees_positive ON transactions
  IS 'Prevents negative fee values';
