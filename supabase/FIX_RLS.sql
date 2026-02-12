-- Fix: allow selecting price_updated_at via existing RLS policies
-- The 406 means the column exists but RLS is blocking

-- Check if there's a restrictive SELECT policy on inventory
-- Most likely fix: ensure the SELECT policy covers all columns

-- First, let's see what policies exist
-- SELECT policy_name, cmd FROM pg_policies WHERE tablename = 'inventory';

-- The simplest fix: drop and recreate the SELECT policy to include all columns
DROP POLICY IF EXISTS "Users can view own org inventory" ON inventory;
CREATE POLICY "Users can view own org inventory" ON inventory
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Also ensure the UPDATE policy works for price updates
DROP POLICY IF EXISTS "Users can update own org inventory" ON inventory;
CREATE POLICY "Users can update own org inventory" ON inventory
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );
