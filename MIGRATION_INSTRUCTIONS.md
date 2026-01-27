# Applying the Database Migrations

## ⚠️ Important: Migration Order

If you're setting up a **fresh database** or haven't run any migrations yet, use the **COMPLETE_SETUP.sql** file which includes all migrations in the correct order.

If you've already run the first two migrations, use the individual organization migration file.

---

## Option 1: Fresh Database Setup (Recommended for New Projects)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/migrations/COMPLETE_SETUP.sql` in your editor
5. Copy the **entire contents** of the file
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This will create:
- `inventory` table
- `procurements` table
- `sales` table
- `organizations` table
- `organization_members` table
- `organization_invites` table
- All RLS policies
- All indexes

---

## Option 2: Adding Organizations to Existing Database

If you've already run the first two migrations (`20251205223611_create_inventory_table.sql` and `20260126000000_add_auth_procurements_sales.sql`):

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/migrations/20260127000000_add_organizations.sql` in your editor
5. Copy the **entire contents** of the file
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

The migration will:
- Create the new organization tables
- Add `organization_id` columns to existing tables
- Update all RLS policies
- Migrate existing user data to personal organizations

## Option 2: Using Supabase CLI

If you want to use the CLI for future migrations:

### Step 1: Link your project

```bash
cd apps/web
npx supabase link --project-ref YOUR_PROJECT_REF
```

To find your project ref:
- Go to your Supabase dashboard
- Settings → General
- Look for "Reference ID"

### Step 2: Apply migration

```bash
npx supabase db push
```

## Verification

After applying the migration, verify it worked:

1. Go to **Table Editor** in Supabase dashboard
2. You should see three new tables:
   - `organizations`
   - `organization_members`
   - `organization_invites`
3. Check that `inventory`, `procurements`, and `sales` tables now have an `organization_id` column

## Important Notes

- The migration automatically creates organizations for existing users
- Each existing user's data will be moved to their own personal organization
- Users will need to create/join an organization on first login after migration
