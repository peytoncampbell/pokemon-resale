/*
  # Add Business Settings Table

  This migration creates a business_settings table to store organization-level
  historical business data that existed before tracking with the app, including:
  - Initial investment amount
  - Current cash reserves
  - Historical inventory costs
  - Historical revenue and profit

  1. New Tables
    - `business_settings` - One record per organization for business financials

  2. Security
    - RLS policies based on organization membership (matching existing pattern)
*/

-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Capital tracking
  initial_investment decimal(12,2) DEFAULT 0, -- Total money put into the business
  cash_reserves decimal(12,2) DEFAULT 0,       -- Current cash on hand

  -- Historical data (before using this app)
  historical_inventory_cost decimal(12,2) DEFAULT 0, -- Cost of inventory before tracking
  historical_revenue decimal(12,2) DEFAULT 0,        -- Revenue earned before tracking
  historical_profit decimal(12,2) DEFAULT 0,         -- Profit earned before tracking

  -- Business info
  business_start_date date,
  notes text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for business_settings table
-- ============================================

CREATE POLICY "Members can view org business settings"
  ON business_settings FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert org business settings"
  ON business_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update org business settings"
  ON business_settings FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete org business settings"
  ON business_settings FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_business_settings_org_id ON business_settings(organization_id);

-- ============================================
-- Trigger to update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_business_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_business_settings_updated_at();
