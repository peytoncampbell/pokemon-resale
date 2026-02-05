/*
  # Fee Calculation Triggers & Inventory Status Workflow

  This migration adds automatic fee calculation for sales transactions and
  enforces valid inventory status transitions.

  1. Enhancements to transactions table
     - Add platform CHECK constraint for valid platforms
     - Add fee_metadata JSONB to store fee calculation details

  2. Fee Calculation Trigger
     - Auto-calculates fees based on platform:
       - TCGPlayer: 10.75% + $0.30
       - eBay: 13.6% + $0.40
       - Direct: $0
     - Stores calculation metadata for audit trail

  3. Inventory Status Workflow
     - Adds 'SHIPPED' as terminal state
     - Enforces valid state transitions:
       - IN_STOCK -> LISTED, SOLD
       - LISTED -> IN_STOCK, SOLD
       - SOLD -> SHIPPED, IN_STOCK (cancellation)
       - SHIPPED -> (none - terminal)
*/

-- ============================================
-- Enhance transactions table
-- ============================================

-- Add platform constraint (platform column already exists as TEXT)
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_platform_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_platform_check
  CHECK (platform IS NULL OR platform IN ('TCGPlayer', 'eBay', 'Direct', 'Other'));

-- Add shipping_cost if not exists (may already exist from previous migrations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions'
    AND column_name = 'shipping_cost'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_cost decimal(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add fee_metadata for storing fee calculation details
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS fee_metadata jsonb DEFAULT '{}';

-- ============================================
-- Fee Calculation Trigger Function
-- ============================================

CREATE OR REPLACE FUNCTION calculate_transaction_fees()
RETURNS TRIGGER AS $$
DECLARE
  v_fee_rate decimal;
  v_fixed_fee decimal;
BEGIN
  -- Only auto-calculate for SELL transactions
  IF NEW.type <> 'SELL' THEN
    RETURN NEW;
  END IF;

  -- Only auto-calculate if fees are 0 or NULL (allow manual override)
  IF NEW.fees IS NOT NULL AND NEW.fees > 0 THEN
    RETURN NEW;
  END IF;

  -- Calculate fees based on platform
  IF NEW.platform = 'TCGPlayer' THEN
    -- TCGPlayer: 10.75% commission + $0.30 transaction fee
    v_fee_rate := 0.1075;
    v_fixed_fee := 0.30;
    NEW.fees := (NEW.cash_in * v_fee_rate) + v_fixed_fee;
    NEW.fee_metadata := jsonb_build_object(
      'platform', 'TCGPlayer',
      'rate', v_fee_rate,
      'fixed_fee', v_fixed_fee,
      'calculated_at', now()
    );

  ELSIF NEW.platform = 'eBay' THEN
    -- eBay: 13.6% final value fee + $0.40 per order
    v_fee_rate := 0.136;
    v_fixed_fee := 0.40;
    NEW.fees := (NEW.cash_in * v_fee_rate) + v_fixed_fee;
    NEW.fee_metadata := jsonb_build_object(
      'platform', 'eBay',
      'rate', v_fee_rate,
      'fixed_fee', v_fixed_fee,
      'calculated_at', now()
    );

  ELSIF NEW.platform = 'Direct' OR NEW.platform IS NULL THEN
    -- Direct sale: no platform fees
    NEW.fees := 0;
    NEW.fee_metadata := jsonb_build_object(
      'platform', COALESCE(NEW.platform, 'Direct'),
      'rate', 0,
      'fixed_fee', 0,
      'calculated_at', now()
    );

  ELSE
    -- Unknown platform: default to 0 fees but log warning
    RAISE WARNING 'Unknown platform: %, defaulting to 0 fees', NEW.platform;
    NEW.fees := 0;
    NEW.fee_metadata := jsonb_build_object(
      'platform', NEW.platform,
      'rate', 0,
      'fixed_fee', 0,
      'warning', 'Unknown platform',
      'calculated_at', now()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on transactions
CREATE TRIGGER trigger_calculate_fees
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  WHEN (NEW.type = 'SELL')
  EXECUTE FUNCTION calculate_transaction_fees();

-- ============================================
-- Inventory Status Workflow
-- ============================================

-- Update inventory status constraint to include SHIPPED
ALTER TABLE inventory
  DROP CONSTRAINT IF EXISTS inventory_status_check;

ALTER TABLE inventory
  ADD CONSTRAINT inventory_status_check
  CHECK (status IN ('IN_STOCK', 'LISTED', 'SOLD', 'SHIPPED'));

-- Create status transition validation function
CREATE OR REPLACE FUNCTION validate_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow any status on INSERT (initial state)
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- If status hasn't changed, allow (no-op)
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Validate transitions based on current status
  CASE OLD.status
    WHEN 'IN_STOCK' THEN
      -- IN_STOCK can go to LISTED or SOLD
      IF NEW.status NOT IN ('LISTED', 'SOLD') THEN
        RAISE EXCEPTION 'Invalid status transition from IN_STOCK to %. Allowed: LISTED, SOLD', NEW.status;
      END IF;

    WHEN 'LISTED' THEN
      -- LISTED can go to IN_STOCK (delisted) or SOLD
      IF NEW.status NOT IN ('IN_STOCK', 'SOLD') THEN
        RAISE EXCEPTION 'Invalid status transition from LISTED to %. Allowed: IN_STOCK, SOLD', NEW.status;
      END IF;

    WHEN 'SOLD' THEN
      -- SOLD can go to SHIPPED or back to IN_STOCK (cancellation - rare)
      IF NEW.status NOT IN ('SHIPPED', 'IN_STOCK') THEN
        RAISE EXCEPTION 'Invalid status transition from SOLD to %. Allowed: SHIPPED, IN_STOCK', NEW.status;
      END IF;

    WHEN 'SHIPPED' THEN
      -- SHIPPED is terminal state - cannot transition
      RAISE EXCEPTION 'Cannot change status from SHIPPED (terminal state). Attempted: %', NEW.status;

    ELSE
      -- Unknown old status
      RAISE EXCEPTION 'Unknown status: %', OLD.status;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status validation
CREATE TRIGGER trigger_validate_status
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION validate_status_transition();
