-- Add price_updated_at column to inventory table
-- Tracks when market prices were last refreshed from external APIs

ALTER TABLE inventory
ADD COLUMN IF NOT EXISTS price_updated_at TIMESTAMPTZ;

-- Add index for efficient queries on stale prices
CREATE INDEX IF NOT EXISTS idx_inventory_price_updated
  ON inventory(price_updated_at)
  WHERE status IN ('IN_STOCK', 'LISTED');

-- Comment for documentation
COMMENT ON COLUMN inventory.price_updated_at IS 'Timestamp of last market price update from JustTCG API';
