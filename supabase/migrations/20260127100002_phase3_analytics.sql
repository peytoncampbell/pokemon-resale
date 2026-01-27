-- ============================================
-- Phase 3: Advanced Analytics & Reporting
-- ============================================

-- Create price_history table for tracking market prices
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  card_id text NOT NULL,
  card_name text NOT NULL,
  market_price decimal(10,2) NOT NULL,
  source text DEFAULT 'tcgplayer',
  recorded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for price_history
CREATE POLICY "Members can view org price history"
  ON price_history FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert org price history"
  ON price_history FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_price_history_org_id ON price_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_price_history_card_id ON price_history(card_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at DESC);

-- Add platform column to sales for better analytics if it doesn't exist
-- Already exists in schema, just adding index
CREATE INDEX IF NOT EXISTS idx_sales_platform ON sales(platform);

-- Add index for condition-based analytics
CREATE INDEX IF NOT EXISTS idx_inventory_condition_status ON inventory(condition, status);

-- Create view for profit analysis by condition
CREATE OR REPLACE VIEW profit_by_condition AS
SELECT
  i.organization_id,
  i.condition,
  COUNT(DISTINCT i.id) as items_count,
  SUM(i.acquisition_cost) as total_cost,
  SUM(CASE WHEN s.id IS NOT NULL THEN s.sale_price ELSE 0 END) as total_revenue,
  SUM(CASE WHEN s.id IS NOT NULL THEN s.sale_price - s.fees - s.shipping_cost - i.acquisition_cost ELSE 0 END) as total_profit
FROM inventory i
LEFT JOIN sales s ON s.inventory_id = i.id
WHERE i.status = 'SOLD' OR i.status = 'IN_STOCK' OR i.status = 'LISTED'
GROUP BY i.organization_id, i.condition;

-- Create view for slow moving inventory (items older than 30 days without sale)
CREATE OR REPLACE VIEW slow_moving_inventory AS
SELECT
  i.*,
  EXTRACT(DAY FROM now() - i.created_at) as days_in_inventory
FROM inventory i
WHERE i.status IN ('IN_STOCK', 'LISTED')
  AND i.created_at < now() - interval '30 days';
