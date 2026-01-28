-- ============================================
-- Test Organization Creation
-- ============================================
-- This script helps test if organization creation works
-- Run this in Supabase SQL Editor while logged in as a test user

-- Step 1: Get your current user ID
-- Replace this with your actual user ID (you can find it in auth.users table)
DO $$
DECLARE
  test_user_id uuid;
  test_org_id uuid;
  test_invite_code text;
BEGIN
  -- Get the first authenticated user (or replace with your user ID)
  SELECT id INTO test_user_id 
  FROM auth.users 
  LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create a user first.';
  END IF;
  
  RAISE NOTICE 'Testing with user ID: %', test_user_id;
  
  -- Generate a test invite code
  test_invite_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
  
  -- Step 2: Try to create an organization (simulating what the app does)
  BEGIN
    INSERT INTO organizations (name, invite_code, created_by)
    VALUES ('Test Organization ' || extract(epoch from now()), test_invite_code, test_user_id)
    RETURNING id INTO test_org_id;
    
    RAISE NOTICE 'SUCCESS: Organization created with ID: %', test_org_id;
    
    -- Step 3: Try to add the creator as a member
    BEGIN
      INSERT INTO organization_members (organization_id, user_id)
      VALUES (test_org_id, test_user_id);
      
      RAISE NOTICE 'SUCCESS: Creator added as member';
      
      -- Clean up test data
      DELETE FROM organization_members WHERE organization_id = test_org_id;
      DELETE FROM organizations WHERE id = test_org_id;
      RAISE NOTICE 'Test data cleaned up';
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'ERROR adding member: % - %', SQLSTATE, SQLERRM;
      -- Clean up organization if member insert failed
      DELETE FROM organizations WHERE id = test_org_id;
      RAISE;
    END;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR creating organization: % - %', SQLSTATE, SQLERRM;
    RAISE;
  END;
  
END $$;

-- ============================================
-- Manual Test (Alternative)
-- ============================================
-- If the above doesn't work, try this step by step:

-- 1. Get your user ID
-- SELECT id, email FROM auth.users;

-- 2. Create organization manually (replace YOUR_USER_ID)
/*
INSERT INTO organizations (name, invite_code, created_by)
VALUES ('My Test Org', 'TEST1234', 'YOUR_USER_ID')
RETURNING id;
*/

-- 3. Add yourself as member (replace YOUR_USER_ID and ORG_ID)
/*
INSERT INTO organization_members (organization_id, user_id)
VALUES ('ORG_ID', 'YOUR_USER_ID');
*/

-- 4. Check if it worked
/*
SELECT o.*, om.user_id 
FROM organizations o
LEFT JOIN organization_members om ON om.organization_id = o.id
WHERE o.created_by = 'YOUR_USER_ID';
*/
