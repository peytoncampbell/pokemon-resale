-- ============================================
-- Diagnostic: Check organization creation setup
-- ============================================
-- Run this to verify your RLS policies are set up correctly

-- 1. Check if organizations table exists and has correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'organizations'
ORDER BY ordinal_position;

-- 2. Check if organization_members table exists
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'organization_members'
ORDER BY ordinal_position;

-- 3. List all RLS policies on organizations table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'organizations';

-- 4. List all RLS policies on organization_members table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'organization_members';

-- 5. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('organizations', 'organization_members');

-- 6. Test query: Check if you can see organizations (should return empty or your orgs)
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
SELECT id, name, invite_code, created_by 
FROM organizations 
LIMIT 5;
