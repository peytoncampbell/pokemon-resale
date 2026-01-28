/*
  # Complete Database Setup
  This file combines all migrations in the correct order.
  Run this if you're setting up a fresh database or haven't run any migrations yet.
*/

-- ============================================
-- Migration 1: Create Inventory Table
-- ============================================

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text NOT NULL,
  card_name text NOT NULL,
  card_image text,
  set_name text,
  location text NOT NULL DEFAULT 'BIN-01',
  acquisition_cost decimal(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'LISTED', 'SOLD')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Temporary public policies (will be replaced in next migration)
CREATE POLICY IF NOT EXISTS "Allow public read access"
  ON inventory
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert access"
  ON inventory
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public update access"
  ON inventory
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public delete access"
  ON inventory
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS inventory_status_idx ON inventory(status);
CREATE INDEX IF NOT EXISTS inventory_location_idx ON inventory(location);
CREATE INDEX IF NOT EXISTS inventory_created_at_idx ON inventory(created_at DESC);
CREATE INDEX IF NOT EXISTS inventory_game_type_idx ON inventory(game_type);

-- ============================================
-- Migration 2: Add Authentication, Procurements, and Sales
-- ============================================

-- Create procurements table first (inventory references it)
CREATE TABLE IF NOT EXISTS procurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier text NOT NULL,
  order_date date DEFAULT CURRENT_DATE,
  subtotal decimal(10,2) DEFAULT 0,
  shipping decimal(10,2) DEFAULT 0,
  fees decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECEIVED', 'CANCELLED')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to inventory
ALTER TABLE inventory 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS condition text DEFAULT 'NM' CHECK (condition IN ('NM', 'LP', 'MP', 'HP', 'DMG')),
  ADD COLUMN IF NOT EXISTS procurement_id uuid REFERENCES procurements(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS game_type text NOT NULL DEFAULT 'pokemon' CHECK (game_type IN ('pokemon', 'onepiece'));

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  inventory_id uuid REFERENCES inventory(id) ON DELETE SET NULL,
  sale_price decimal(10,2) NOT NULL,
  platform text,
  fees decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  sold_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Drop old public policies on inventory
DROP POLICY IF EXISTS "Allow public read access" ON inventory;
DROP POLICY IF EXISTS "Allow public insert access" ON inventory;
DROP POLICY IF EXISTS "Allow public update access" ON inventory;
DROP POLICY IF EXISTS "Allow public delete access" ON inventory;

-- Create user-based policies for inventory
CREATE POLICY IF NOT EXISTS "Users can view own inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for procurements
CREATE POLICY IF NOT EXISTS "Users can view own procurements"
  ON procurements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own procurements"
  ON procurements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own procurements"
  ON procurements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own procurements"
  ON procurements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for sales
CREATE POLICY IF NOT EXISTS "Users can view own sales"
  ON sales FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own sales"
  ON sales FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own sales"
  ON sales FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for new tables and columns
CREATE INDEX IF NOT EXISTS inventory_user_id_idx ON inventory(user_id);
CREATE INDEX IF NOT EXISTS inventory_condition_idx ON inventory(condition);
CREATE INDEX IF NOT EXISTS inventory_procurement_id_idx ON inventory(procurement_id);

CREATE INDEX IF NOT EXISTS procurements_user_id_idx ON procurements(user_id);
CREATE INDEX IF NOT EXISTS procurements_status_idx ON procurements(status);
CREATE INDEX IF NOT EXISTS procurements_order_date_idx ON procurements(order_date DESC);

CREATE INDEX IF NOT EXISTS sales_user_id_idx ON sales(user_id);
CREATE INDEX IF NOT EXISTS sales_inventory_id_idx ON sales(inventory_id);
CREATE INDEX IF NOT EXISTS sales_sold_at_idx ON sales(sold_at DESC);

-- ============================================
-- Migration 3: Add Organizations for Multi-User Support
-- ============================================

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Create organization_invites table
CREATE TABLE IF NOT EXISTS organization_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Add organization_id to existing tables
ALTER TABLE inventory 
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE procurements 
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE sales 
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations table
CREATE POLICY IF NOT EXISTS "Users can view organizations they are members of"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    -- Allow creators to see their org (needed before membership is inserted)
    created_by = auth.uid()
    OR
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY IF NOT EXISTS "Members can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Create a security definer function to check membership without triggering RLS recursion
-- This must be created BEFORE the policies that use it
CREATE OR REPLACE FUNCTION check_organization_membership(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- This function bypasses RLS, so we can check membership safely
  RETURN EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
      AND user_id = check_user_id
  );
END;
$$;

-- RLS Policies for organization_members table
CREATE POLICY IF NOT EXISTS "Users can view members of their organizations"
  ON organization_members FOR SELECT
  TO authenticated
  USING (
    -- Use the function to check membership without recursion
    check_organization_membership(organization_id, auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Members can add new members to their organization"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is the creator of the organization (for first member)
    -- This check comes first and doesn't query organization_members
    organization_id IN (
      SELECT id FROM organizations 
      WHERE created_by = auth.uid()
    )
    OR 
    -- Allow if user is already a member (using function to avoid recursion)
    check_organization_membership(organization_id, auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Members can remove members from their organization"
  ON organization_members FOR DELETE
  TO authenticated
  USING (
    check_organization_membership(organization_id, auth.uid())
  );

-- RLS Policies for organization_invites table
CREATE POLICY IF NOT EXISTS "Members can view invites for their organization"
  ON organization_invites FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Allow users to see invites sent to their email
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Members can create invites for their organization"
  ON organization_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can update invites for their organization"
  ON organization_invites FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Allow users to accept their own invites
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Members can delete invites for their organization"
  ON organization_invites FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Update RLS Policies for inventory table
DROP POLICY IF EXISTS "Users can view own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can insert own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can update own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can delete own inventory" ON inventory;

CREATE POLICY IF NOT EXISTS "Members can view org inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can insert org inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can update org inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can delete org inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Update RLS Policies for procurements table
DROP POLICY IF EXISTS "Users can view own procurements" ON procurements;
DROP POLICY IF EXISTS "Users can insert own procurements" ON procurements;
DROP POLICY IF EXISTS "Users can update own procurements" ON procurements;
DROP POLICY IF EXISTS "Users can delete own procurements" ON procurements;

CREATE POLICY IF NOT EXISTS "Members can view org procurements"
  ON procurements FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can insert org procurements"
  ON procurements FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can update org procurements"
  ON procurements FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can delete org procurements"
  ON procurements FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Update RLS Policies for sales table
DROP POLICY IF EXISTS "Users can view own sales" ON sales;
DROP POLICY IF EXISTS "Users can insert own sales" ON sales;
DROP POLICY IF EXISTS "Users can update own sales" ON sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON sales;

CREATE POLICY IF NOT EXISTS "Members can view org sales"
  ON sales FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can insert org sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can update org sales"
  ON sales FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Members can delete org sales"
  ON sales FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create a function to generate invite codes
CREATE OR REPLACE FUNCTION generate_invite_code() RETURNS text AS $$
BEGIN
  RETURN upper(substr(md5(random()::text), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Migrate existing users: create an organization for each user with data
DO $$
DECLARE
  user_record RECORD;
  new_org_id uuid;
  user_email text;
BEGIN
  -- Find all unique user_ids that have inventory, procurements, or sales
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM (
      SELECT user_id FROM inventory WHERE user_id IS NOT NULL
      UNION
      SELECT user_id FROM procurements WHERE user_id IS NOT NULL
      UNION
      SELECT user_id FROM sales WHERE user_id IS NOT NULL
    ) AS all_users
  LOOP
    -- Get user email for org name
    SELECT email INTO user_email FROM auth.users WHERE id = user_record.user_id;
    
    -- Create organization for this user
    INSERT INTO organizations (name, invite_code, created_by)
    VALUES (
      COALESCE(split_part(user_email, '@', 1), 'My') || '''s Business',
      generate_invite_code(),
      user_record.user_id
    )
    RETURNING id INTO new_org_id;
    
    -- Add user as member
    INSERT INTO organization_members (organization_id, user_id)
    VALUES (new_org_id, user_record.user_id);
    
    -- Update their inventory
    UPDATE inventory 
    SET organization_id = new_org_id 
    WHERE user_id = user_record.user_id;
    
    -- Update their procurements
    UPDATE procurements 
    SET organization_id = new_org_id 
    WHERE user_id = user_record.user_id;
    
    -- Update their sales
    UPDATE sales 
    SET organization_id = new_org_id 
    WHERE user_id = user_record.user_id;
  END LOOP;
END $$;

-- Create indexes for faster organization lookups
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_org_id ON inventory(organization_id);
CREATE INDEX IF NOT EXISTS idx_procurements_org_id ON procurements(organization_id);
CREATE INDEX IF NOT EXISTS idx_sales_org_id ON sales(organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_invite_code ON organizations(invite_code);

-- Function to find organization by invite code (public access for joining)
CREATE OR REPLACE FUNCTION get_organization_by_invite_code(code text)
RETURNS TABLE(id uuid, name text) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.name
  FROM organizations o
  WHERE o.invite_code = upper(code);
END;
$$ LANGUAGE plpgsql;
