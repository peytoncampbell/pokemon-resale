/*
  # Add Transactions System

  This migration creates a unified transactions system that replaces separate
  procurement and sales tracking with a single, flexible model supporting:
  - BUY transactions (cash out, creates inventory)
  - SELL transactions (cash in, marks inventory as SOLD)
  - TRADE transactions (give items + receive items, optional cash either way)

  1. New Tables
    - `transactions` - Main transaction records
    - `transaction_items` - Items involved in each transaction (IN or OUT direction)

  2. Security
    - RLS policies based on organization membership (matching existing pattern)

  3. Inventory Integration
    - transaction_items links to inventory via inventory_id for OUT items
    - Creating transactions auto-manages inventory status
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Transaction type: BUY (acquiring cards), SELL (selling cards), TRADE (exchange)
  type text NOT NULL CHECK (type IN ('BUY', 'SELL', 'TRADE')),

  -- Counterparty info
  counterparty_name text NOT NULL,
  counterparty_type text CHECK (counterparty_type IN ('STORE', 'PERSON', 'ONLINE', 'OTHER')),
  platform text, -- eBay, TCGPlayer, Local Store, etc.

  -- Money flow
  cash_out decimal(10,2) DEFAULT 0, -- Money paid out (for BUY, or cash added in TRADE)
  cash_in decimal(10,2) DEFAULT 0,  -- Money received (for SELL, or cash received in TRADE)
  fees decimal(10,2) DEFAULT 0,     -- Platform fees, shipping, etc.

  -- Metadata
  transaction_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
  notes text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,

  -- Direction: IN (receiving cards) or OUT (giving cards)
  direction text NOT NULL CHECK (direction IN ('IN', 'OUT')),

  -- Card info (stored for historical record even if inventory changes)
  card_id text NOT NULL,
  card_name text NOT NULL,
  card_image text,
  set_name text,
  game_type text DEFAULT 'pokemon' CHECK (game_type IN ('pokemon', 'onepiece')),
  condition text DEFAULT 'NM' CHECK (condition IN ('NM', 'LP', 'MP', 'HP', 'DMG')),

  -- Link to inventory (for OUT items, references existing inventory)
  -- For IN items, a new inventory record is created and linked here
  inventory_id uuid REFERENCES inventory(id) ON DELETE SET NULL,

  -- Quantity and value
  quantity integer DEFAULT 1,
  unit_value decimal(10,2) DEFAULT 0,
  total_value decimal(10,2) DEFAULT 0,

  -- Storage location (for IN items, where they'll be stored)
  location text DEFAULT 'BIN-01',

  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for transactions table
-- ============================================

CREATE POLICY "Members can view org transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert org transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update org transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete org transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- RLS Policies for transaction_items table
-- ============================================

CREATE POLICY "Members can view transaction items"
  ON transaction_items FOR SELECT
  TO authenticated
  USING (
    transaction_id IN (
      SELECT t.id FROM transactions t
      WHERE t.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can insert transaction items"
  ON transaction_items FOR INSERT
  TO authenticated
  WITH CHECK (
    transaction_id IN (
      SELECT t.id FROM transactions t
      WHERE t.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can update transaction items"
  ON transaction_items FOR UPDATE
  TO authenticated
  USING (
    transaction_id IN (
      SELECT t.id FROM transactions t
      WHERE t.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can delete transaction items"
  ON transaction_items FOR DELETE
  TO authenticated
  USING (
    transaction_id IN (
      SELECT t.id FROM transactions t
      WHERE t.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_transactions_org_id ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_direction ON transaction_items(direction);
CREATE INDEX IF NOT EXISTS idx_transaction_items_inventory_id ON transaction_items(inventory_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_card_id ON transaction_items(card_id);

-- ============================================
-- Trigger to update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();
