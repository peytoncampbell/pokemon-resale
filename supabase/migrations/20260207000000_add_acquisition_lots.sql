/*
  # Add FIFO Acquisition Lots Tracking

  This migration creates the lot-based inventory tracking system for accurate
  FIFO (First In, First Out) cost basis calculation.

  1. New Table: acquisition_lots
     - Tracks each purchase/acquisition as a separate lot
     - Maintains quantity_total (original) and quantity_remaining (unsold)
     - Links to inventory items for grouping
     - Supports FIFO ordering via acquisition_date

  2. Function: consume_lots_fifo
     - Atomically consumes lots in FIFO order when selling
     - Uses row-level locking (SELECT ... FOR UPDATE) to prevent race conditions
     - Returns which lots were consumed and at what cost basis

  3. Security
     - RLS policies scoped to organization membership
*/

-- ============================================
-- Create acquisition_lots table
-- ============================================

CREATE TABLE IF NOT EXISTS acquisition_lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES inventory(id) ON DELETE CASCADE NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  -- Lot quantity tracking
  quantity_total integer NOT NULL,          -- Original lot size
  quantity_remaining integer NOT NULL,      -- How many unsold
  unit_cost decimal(10,2) NOT NULL,         -- Cost basis per unit

  -- FIFO ordering
  acquisition_date date NOT NULL,           -- Date acquired (for FIFO)

  -- Optional enhancements
  grading_cost decimal(10,2) DEFAULT 0,     -- Per-unit grading cost (if applicable)
  procurement_id uuid REFERENCES procurements(id) ON DELETE SET NULL,

  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CHECK (quantity_remaining >= 0),
  CHECK (quantity_remaining <= quantity_total),
  CHECK (unit_cost >= 0),
  CHECK (grading_cost >= 0)
);

-- ============================================
-- Indexes for FIFO performance
-- ============================================

-- Critical index for FIFO lot consumption (oldest first, with remaining inventory)
CREATE INDEX idx_lots_fifo
  ON acquisition_lots(inventory_id, acquisition_date ASC, created_at ASC)
  WHERE quantity_remaining > 0;

-- Organization-scoped queries
CREATE INDEX idx_lots_org ON acquisition_lots(organization_id);

-- Inventory lookup
CREATE INDEX idx_lots_inventory ON acquisition_lots(inventory_id);

-- ============================================
-- FIFO Lot Consumption Function
-- ============================================

CREATE OR REPLACE FUNCTION consume_lots_fifo(
  p_inventory_id uuid,
  p_quantity integer
)
RETURNS TABLE(lot_id uuid, quantity_consumed integer, unit_cost decimal) AS $$
DECLARE
  v_remaining integer := p_quantity;
  v_lot RECORD;
  v_consume_qty integer;
BEGIN
  -- Validate input
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive, got %', p_quantity;
  END IF;

  -- Loop through lots in FIFO order (oldest first)
  FOR v_lot IN
    SELECT id, quantity_remaining, acquisition_lots.unit_cost
    FROM acquisition_lots
    WHERE inventory_id = p_inventory_id
      AND quantity_remaining > 0
    ORDER BY acquisition_date ASC, created_at ASC
    FOR UPDATE  -- Row-level lock to prevent concurrent consumption
  LOOP
    -- Calculate how much to consume from this lot
    IF v_lot.quantity_remaining >= v_remaining THEN
      -- This lot has enough to fulfill the remaining quantity
      v_consume_qty := v_remaining;
    ELSE
      -- Consume the entire lot and continue
      v_consume_qty := v_lot.quantity_remaining;
    END IF;

    -- Update lot quantity
    UPDATE acquisition_lots
    SET quantity_remaining = quantity_remaining - v_consume_qty,
        updated_at = now()
    WHERE id = v_lot.id;

    -- Return consumption record
    RETURN QUERY SELECT v_lot.id, v_consume_qty, v_lot.unit_cost;

    -- Decrease remaining needed
    v_remaining := v_remaining - v_consume_qty;

    -- Exit if fulfilled
    EXIT WHEN v_remaining = 0;
  END LOOP;

  -- Check if we had insufficient inventory
  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'Insufficient inventory for item %. Requested: %, Available: %',
      p_inventory_id, p_quantity, p_quantity - v_remaining;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE acquisition_lots ENABLE ROW LEVEL SECURITY;

-- Members can view lots for their organization
CREATE POLICY "Members can view org lots"
  ON acquisition_lots FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members can insert lots for their organization
CREATE POLICY "Members can insert org lots"
  ON acquisition_lots FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members can update lots for their organization
CREATE POLICY "Members can update org lots"
  ON acquisition_lots FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members can delete lots for their organization
CREATE POLICY "Members can delete org lots"
  ON acquisition_lots FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Service role can do everything (for batch operations)
CREATE POLICY "Service role full access to lots"
  ON acquisition_lots
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Trigger for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER acquisition_lots_updated_at
  BEFORE UPDATE ON acquisition_lots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
