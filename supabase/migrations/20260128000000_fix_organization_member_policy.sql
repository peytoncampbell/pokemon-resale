-- ============================================
-- Fix: Organization RLS policies - chicken-and-egg problem & recursion
-- ============================================
-- Problem: When creating an org and inserting the first member,
-- the organization_members INSERT policy queries organizations,
-- which has a SELECT policy that requires membership.
-- But the user isn't a member yet, so the chain fails.
--
-- Fix 1: Allow org creators to see/update their org via created_by check
-- Fix 2: Use SECURITY DEFINER function for org_members DELETE policy

-- Create the SECURITY DEFINER function if it doesn't exist yet
CREATE OR REPLACE FUNCTION check_organization_membership(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
      AND user_id = check_user_id
  );
END;
$$;

-- ============================================
-- Fix 1: organizations SELECT policy
-- ============================================
DROP POLICY IF EXISTS "Users can view organizations they are members of" ON organizations;

CREATE POLICY "Users can view organizations they are members of"
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

-- ============================================
-- Fix 2: organizations UPDATE policy
-- ============================================
DROP POLICY IF EXISTS "Members can update their organization" ON organizations;

CREATE POLICY "Members can update their organization"
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

-- ============================================
-- Fix 3: organization_members SELECT policy (use SECURITY DEFINER)
-- ============================================
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;

CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  TO authenticated
  USING (
    check_organization_membership(organization_id, auth.uid())
  );

-- ============================================
-- Fix 4: organization_members INSERT policy (use SECURITY DEFINER)
-- ============================================
DROP POLICY IF EXISTS "Members can add new members to their organization" ON organization_members;

CREATE POLICY "Members can add new members to their organization"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is the creator of the organization (for first member)
    organization_id IN (
      SELECT id FROM organizations
      WHERE created_by = auth.uid()
    )
    OR
    -- Allow if user is already a member (using function to avoid recursion)
    check_organization_membership(organization_id, auth.uid())
  );

-- ============================================
-- Fix 5: organization_members DELETE policy (use SECURITY DEFINER)
-- ============================================
DROP POLICY IF EXISTS "Members can remove members from their organization" ON organization_members;

CREATE POLICY "Members can remove members from their organization"
  ON organization_members FOR DELETE
  TO authenticated
  USING (
    check_organization_membership(organization_id, auth.uid())
  );
