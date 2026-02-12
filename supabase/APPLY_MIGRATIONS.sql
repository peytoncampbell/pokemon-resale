-- BUNDLED MIGRATIONS (run in Supabase SQL Editor)
-- Generated 2026-02-12

-- ======= 20260211000000_add_price_updated_at.sql =======
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


-- ======= 20260211100000_convert_to_enum_types.sql =======
-- Convert TEXT columns to ENUM types for better type safety and validation
-- This migration converts: counterparty_type, transaction type, product_type, game_type

-- 1. Create ENUM types
CREATE TYPE counterparty_type_enum AS ENUM ('STORE', 'PERSON', 'ONLINE', 'OTHER');
CREATE TYPE transaction_type_enum AS ENUM ('BUY', 'SELL', 'TRADE');
CREATE TYPE product_type_enum AS ENUM ('card', 'sealed');
CREATE TYPE game_type_enum AS ENUM ('pokemon', 'onepiece');

-- 2. Convert transactions.counterparty_type (nullable)
ALTER TABLE transactions
  ALTER COLUMN counterparty_type TYPE counterparty_type_enum
  USING CASE
    WHEN counterparty_type IS NULL THEN NULL
    ELSE counterparty_type::counterparty_type_enum
  END;

-- 3. Convert transactions.type (non-nullable)
ALTER TABLE transactions
  ALTER COLUMN type TYPE transaction_type_enum
  USING type::transaction_type_enum;

-- 4. Convert inventory.product_type (non-nullable, default 'card')
ALTER TABLE inventory
  ALTER COLUMN product_type TYPE product_type_enum
  USING CASE
    WHEN product_type = 'card' OR product_type IS NULL THEN 'card'::product_type_enum
    WHEN product_type = 'sealed' THEN 'sealed'::product_type_enum
    ELSE 'card'::product_type_enum
  END;

-- Set default after conversion
ALTER TABLE inventory
  ALTER COLUMN product_type SET DEFAULT 'card'::product_type_enum;

-- 5. Convert inventory.game_type (non-nullable)
ALTER TABLE inventory
  ALTER COLUMN game_type TYPE game_type_enum
  USING CASE
    WHEN game_type = 'pokemon' OR game_type IS NULL THEN 'pokemon'::game_type_enum
    WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum
    ELSE 'pokemon'::game_type_enum
  END;

-- 6. Convert transaction_items.game_type (nullable)
ALTER TABLE transaction_items
  ALTER COLUMN game_type TYPE game_type_enum
  USING CASE
    WHEN game_type IS NULL THEN NULL
    WHEN game_type = 'pokemon' THEN 'pokemon'::game_type_enum
    WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum
    ELSE 'pokemon'::game_type_enum
  END;

-- 7. Convert price_snapshots.product_type (non-nullable, default 'card')
ALTER TABLE price_snapshots
  ALTER COLUMN product_type TYPE product_type_enum
  USING CASE
    WHEN product_type = 'card' OR product_type IS NULL THEN 'card'::product_type_enum
    WHEN product_type = 'sealed' THEN 'sealed'::product_type_enum
    ELSE 'card'::product_type_enum
  END;

-- Set default after conversion
ALTER TABLE price_snapshots
  ALTER COLUMN product_type SET DEFAULT 'card'::product_type_enum;

-- 8. Convert price_snapshots.game_type (non-nullable)
ALTER TABLE price_snapshots
  ALTER COLUMN game_type TYPE game_type_enum
  USING CASE
    WHEN game_type = 'pokemon' OR game_type IS NULL THEN 'pokemon'::game_type_enum
    WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum
    ELSE 'pokemon'::game_type_enum
  END;

-- 9. Convert tcg_cache.game_type (non-nullable)
ALTER TABLE tcg_cache
  ALTER COLUMN game_type TYPE game_type_enum
  USING CASE
    WHEN game_type = 'pokemon' OR game_type IS NULL THEN 'pokemon'::game_type_enum
    WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum
    ELSE 'pokemon'::game_type_enum
  END;

-- 10. Convert import_staging.product_type (nullable)
ALTER TABLE import_staging
  ALTER COLUMN product_type TYPE product_type_enum
  USING CASE
    WHEN product_type IS NULL THEN NULL
    WHEN product_type = 'card' THEN 'card'::product_type_enum
    WHEN product_type = 'sealed' THEN 'sealed'::product_type_enum
    ELSE 'card'::product_type_enum
  END;

-- 11. Convert import_staging.game_type (nullable)
ALTER TABLE import_staging
  ALTER COLUMN game_type TYPE game_type_enum
  USING CASE
    WHEN game_type IS NULL THEN NULL
    WHEN game_type = 'pokemon' THEN 'pokemon'::game_type_enum
    WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum
    ELSE 'pokemon'::game_type_enum
  END;

-- Add comments for documentation
COMMENT ON TYPE counterparty_type_enum IS 'Type of counterparty in a transaction';
COMMENT ON TYPE transaction_type_enum IS 'Type of transaction: BUY, SELL, or TRADE';
COMMENT ON TYPE product_type_enum IS 'Type of TCG product: card or sealed';
COMMENT ON TYPE game_type_enum IS 'Trading card game type: pokemon or onepiece';


-- ======= 20260211200000_add_role_based_permissions.sql =======
/*
  # Add Role-Based Permissions

  1. Changes to organization_members
    - Add `role` ENUM column (admin, editor, viewer)
    - Default: editor
    - Org creators should be admin

  2. Security
    - Update RLS policies to enforce role-based permissions at DB level
    - admin: full access (CRUD all, manage members, change settings, delete org)
    - editor: CRUD inventory, transactions, view reports
    - viewer: read-only access to inventory, transactions, reports
*/

-- Create role enum type
DO $$ BEGIN
  CREATE TYPE organization_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to organization_members
ALTER TABLE organization_members 
  ADD COLUMN IF NOT EXISTS role organization_role NOT NULL DEFAULT 'editor';

-- Update existing organization creators to be admins
UPDATE organization_members om
SET role = 'admin'
WHERE om.user_id IN (
  SELECT o.created_by 
  FROM organizations o 
  WHERE o.id = om.organization_id
    AND o.created_by IS NOT NULL
);

-- Create helper function to check user's role in an organization
CREATE OR REPLACE FUNCTION get_user_org_role(org_id uuid, check_user_id uuid)
RETURNS organization_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role organization_role;
BEGIN
  SELECT role INTO user_role
  FROM organization_members 
  WHERE organization_id = org_id 
    AND user_id = check_user_id;
  
  RETURN user_role;
END;
$$;

-- Create helper function to check if user has minimum role
CREATE OR REPLACE FUNCTION user_has_min_role(org_id uuid, check_user_id uuid, min_role organization_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role organization_role;
  role_hierarchy integer;
BEGIN
  user_role := get_user_org_role(org_id, check_user_id);
  
  IF user_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Role hierarchy: admin > editor > viewer
  -- admin = 3, editor = 2, viewer = 1
  role_hierarchy := CASE user_role
    WHEN 'admin' THEN 3
    WHEN 'editor' THEN 2
    WHEN 'viewer' THEN 1
    ELSE 0
  END;
  
  RETURN role_hierarchy >= CASE min_role
    WHEN 'admin' THEN 3
    WHEN 'editor' THEN 2
    WHEN 'viewer' THEN 1
    ELSE 0
  END;
END;
$$;

-- ============================================
-- Update RLS Policies for organizations table
-- ============================================

-- Only admins can update organization settings
DROP POLICY IF EXISTS "Members can update their organization" ON organizations;
CREATE POLICY "Admins can update organization settings"
  ON organizations FOR UPDATE
  TO authenticated
  USING (user_has_min_role(id, auth.uid(), 'admin'));

-- Only admins can delete organizations
CREATE POLICY "Admins can delete organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (user_has_min_role(id, auth.uid(), 'admin'));

-- ============================================
-- Update RLS Policies for organization_members table
-- ============================================

-- Only admins can add new members
DROP POLICY IF EXISTS "Members can add new members to their organization" ON organization_members;
CREATE POLICY "Admins can add new members"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is the creator of the organization (for first member)
    organization_id IN (
      SELECT id FROM organizations 
      WHERE created_by = auth.uid()
    )
    OR 
    -- Allow if user is an admin
    user_has_min_role(organization_id, auth.uid(), 'admin')
  );

-- Only admins can remove members
DROP POLICY IF EXISTS "Members can remove members from their organization" ON organization_members;
CREATE POLICY "Admins can remove members"
  ON organization_members FOR DELETE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'admin'));

-- Only admins can update member roles
CREATE POLICY "Admins can update member roles"
  ON organization_members FOR UPDATE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'admin'));

-- ============================================
-- Update RLS Policies for inventory table
-- ============================================

-- Viewers and above can view inventory (no change needed for SELECT)

-- Only editors and admins can insert inventory
DROP POLICY IF EXISTS "Members can insert org inventory" ON inventory;
CREATE POLICY "Editors and admins can insert inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (
    user_has_min_role(organization_id, auth.uid(), 'editor')
  );

-- Only editors and admins can update inventory
DROP POLICY IF EXISTS "Members can update org inventory" ON inventory;
CREATE POLICY "Editors and admins can update inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'editor'));

-- Only editors and admins can delete inventory
DROP POLICY IF EXISTS "Members can delete org inventory" ON inventory;
CREATE POLICY "Editors and admins can delete inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'editor'));

-- ============================================
-- Update RLS Policies for transactions table (if exists)
-- ============================================

-- Check if transactions table exists and update policies
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions') THEN
    -- Only editors and admins can insert transactions
    EXECUTE 'DROP POLICY IF EXISTS "Members can insert org transactions" ON transactions';
    EXECUTE 'CREATE POLICY "Editors and admins can insert transactions"
      ON transactions FOR INSERT
      TO authenticated
      WITH CHECK (
        user_has_min_role(organization_id, auth.uid(), ''editor'')
      )';

    -- Only editors and admins can update transactions
    EXECUTE 'DROP POLICY IF EXISTS "Members can update org transactions" ON transactions';
    EXECUTE 'CREATE POLICY "Editors and admins can update transactions"
      ON transactions FOR UPDATE
      TO authenticated
      USING (user_has_min_role(organization_id, auth.uid(), ''editor''))';

    -- Only editors and admins can delete transactions
    EXECUTE 'DROP POLICY IF EXISTS "Members can delete org transactions" ON transactions';
    EXECUTE 'CREATE POLICY "Editors and admins can delete transactions"
      ON transactions FOR DELETE
      TO authenticated
      USING (user_has_min_role(organization_id, auth.uid(), ''editor''))';
  END IF;
END $$;

-- ============================================
-- Update RLS Policies for organization_invites table
-- ============================================

-- Only admins can create invites
DROP POLICY IF EXISTS "Members can create invites for their organization" ON organization_invites;
CREATE POLICY "Admins can create invites"
  ON organization_invites FOR INSERT
  TO authenticated
  WITH CHECK (
    user_has_min_role(organization_id, auth.uid(), 'admin')
  );

-- Only admins can delete invites
DROP POLICY IF EXISTS "Members can delete invites for their organization" ON organization_invites;
CREATE POLICY "Admins can delete invites"
  ON organization_invites FOR DELETE
  TO authenticated
  USING (
    user_has_min_role(organization_id, auth.uid(), 'admin')
  );

-- Only admins can update invites (except users accepting their own)
DROP POLICY IF EXISTS "Members can update invites for their organization" ON organization_invites;
CREATE POLICY "Admins can update invites or users can accept their own"
  ON organization_invites FOR UPDATE
  TO authenticated
  USING (
    user_has_min_role(organization_id, auth.uid(), 'admin')
    OR
    -- Allow users to accept their own invites
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- ============================================
-- Update RLS Policies for procurements table
-- ============================================

-- Only editors and admins can insert procurements
DROP POLICY IF EXISTS "Members can insert org procurements" ON procurements;
CREATE POLICY "Editors and admins can insert procurements"
  ON procurements FOR INSERT
  TO authenticated
  WITH CHECK (
    user_has_min_role(organization_id, auth.uid(), 'editor')
  );

-- Only editors and admins can update procurements
DROP POLICY IF EXISTS "Members can update org procurements" ON procurements;
CREATE POLICY "Editors and admins can update procurements"
  ON procurements FOR UPDATE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'editor'));

-- Only editors and admins can delete procurements
DROP POLICY IF EXISTS "Members can delete org procurements" ON procurements;
CREATE POLICY "Editors and admins can delete procurements"
  ON procurements FOR DELETE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'editor'));

-- ============================================
-- Update RLS Policies for sales table
-- ============================================

-- Only editors and admins can insert sales
DROP POLICY IF EXISTS "Members can insert org sales" ON sales;
CREATE POLICY "Editors and admins can insert sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (
    user_has_min_role(organization_id, auth.uid(), 'editor')
  );

-- Only editors and admins can update sales
DROP POLICY IF EXISTS "Members can update org sales" ON sales;
CREATE POLICY "Editors and admins can update sales"
  ON sales FOR UPDATE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'editor'));

-- Only editors and admins can delete sales
DROP POLICY IF EXISTS "Members can delete org sales" ON sales;
CREATE POLICY "Editors and admins can delete sales"
  ON sales FOR DELETE
  TO authenticated
  USING (user_has_min_role(organization_id, auth.uid(), 'editor'));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON organization_members(organization_id, user_id, role);

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION get_user_org_role(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_min_role(uuid, uuid, organization_role) TO authenticated;



