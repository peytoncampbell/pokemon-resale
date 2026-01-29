/*
  # Fix Join Organization by Invite Code

  The current RLS policy prevents new users from joining organizations with an invite code
  because they are neither the creator nor an existing member.

  Solution: Create a SECURITY DEFINER function that handles the join operation,
  bypassing RLS while still validating the invite code.
*/

-- Create a function to join an organization by invite code
-- This bypasses RLS but validates the invite code
CREATE OR REPLACE FUNCTION join_organization_by_invite_code(invite_code_input text)
RETURNS TABLE(org_id uuid, org_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_org_id uuid;
  found_org_name text;
  current_user_id uuid;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Find organization by invite code
  SELECT o.id, o.name INTO found_org_id, found_org_name
  FROM organizations o
  WHERE o.invite_code = upper(invite_code_input);

  IF found_org_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;

  -- Check if already a member
  IF EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = found_org_id
      AND om.user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You are already a member of this organization';
  END IF;

  -- Add user as member (bypasses RLS because SECURITY DEFINER)
  INSERT INTO organization_members (organization_id, user_id)
  VALUES (found_org_id, current_user_id);

  -- Return the organization info
  org_id := found_org_id;
  org_name := found_org_name;
  RETURN NEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_organization_by_invite_code(text) TO authenticated;
