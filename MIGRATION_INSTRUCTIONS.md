# Supabase Migrations Guide

## How Supabase Migrations Work

Supabase migrations are SQL files that modify your database schema. They work in two ways:

1. **Individual Migration Files**: Timestamped files (e.g., `20251205223611_create_inventory_table.sql`) that Supabase CLI applies in chronological order
2. **Manual SQL Execution**: You can run SQL directly in the Supabase dashboard SQL Editor

### Migration File Naming Convention

Migration files follow the pattern: `YYYYMMDDHHMMSS_description.sql`
- The timestamp ensures migrations run in the correct order
- Supabase tracks which migrations have been applied

---

## Your Migration Files

You have the following migrations in order:

1. **`20251205223611_create_inventory_table.sql`** - Creates the inventory table
2. **`20260126000000_add_auth_procurements_sales.sql`** - Adds authentication, procurements, and sales tables
3. **`20260127000000_add_organizations.sql`** - Adds multi-user organization support
4. **`20260127100000_phase1_inventory_enhancements.sql`** - Adds indexes for inventory
5. **`20260127100001_phase2_suppliers.sql`** - Adds suppliers, expected items, and attachments
6. **`20260127100002_phase3_analytics.sql`** - Adds analytics tables and views

**`COMPLETE_SETUP.sql`** - Combines all migrations above for fresh database setup

---

## Option 1: Fresh Database Setup (Recommended for New Projects)

If you're setting up a **brand new database** or want to start fresh:

### Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/migrations/COMPLETE_SETUP.sql` in your editor
5. Copy the **entire contents** of the file
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This will create all tables, policies, indexes, and views in one go.

### Using Supabase CLI

```bash
# Navigate to your project root
cd c:\Users\pcampbell\personal\resale\pokemon-resale

# Link your project (first time only)
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations
npx supabase db push
```

To find your project ref:
- Go to your Supabase dashboard
- Settings → General
- Look for "Reference ID"

---

## Option 2: Applying Individual Migrations (For Existing Databases)

If you already have some tables and want to apply migrations incrementally:

### Using Supabase Dashboard

1. Go to **SQL Editor** in Supabase dashboard
2. Open the migration file you want to apply (e.g., `20260127100001_phase2_suppliers.sql`)
3. Copy and paste the contents into SQL Editor
4. Click **Run**

**Important**: Apply migrations in chronological order! Check which migrations you've already run by looking at your database tables.

### Using Supabase CLI

```bash
# Make sure you're linked
npx supabase link --project-ref YOUR_PROJECT_REF

# Push all pending migrations
npx supabase db push

# Or reset and apply all migrations (⚠️ WARNING: This will drop all data!)
npx supabase db reset
```

---

## Option 3: Local Development with Supabase CLI

For local development, you can run Supabase locally:

```bash
# Start local Supabase (requires Docker)
npx supabase start

# Apply migrations to local database
npx supabase db push

# Stop local Supabase
npx supabase stop
```

---

## What Each Migration Does

### Migration 1: Inventory Table
- Creates `inventory` table for Pokemon cards
- Sets up basic RLS policies
- Adds indexes for status, location, and created_at

### Migration 2: Auth, Procurements, Sales
- Creates `procurements` table (purchase orders)
- Creates `sales` table (sales records)
- Adds `user_id` and `condition` to inventory
- Updates RLS policies for user-based access

### Migration 3: Organizations
- Creates `organizations`, `organization_members`, and `organization_invites` tables
- Adds `organization_id` to inventory, procurements, and sales
- Updates RLS policies for organization-based access
- Migrates existing user data to personal organizations

### Migration 4: Phase 1 - Inventory Enhancements
- Adds indexes for duplicate detection and condition filtering

### Migration 5: Phase 2 - Suppliers
- Creates `suppliers` table
- Creates `procurement_expected_items` table
- Creates `procurement_attachments` table
- Adds `supplier_id` to procurements
- Sets up RLS policies for all new tables

### Migration 6: Phase 3 - Analytics
- Creates `price_history` table
- Creates `profit_by_condition` view
- Creates `slow_moving_inventory` view
- Adds indexes for analytics queries

---

## Verification

After applying migrations, verify they worked:

1. Go to **Table Editor** in Supabase dashboard
2. Check that all expected tables exist:
   - `inventory`
   - `procurements`
   - `sales`
   - `organizations`
   - `organization_members`
   - `organization_invites`
   - `suppliers`
   - `procurement_expected_items`
   - `procurement_attachments`
   - `price_history`
3. Check **Database → Views** for:
   - `profit_by_condition`
   - `slow_moving_inventory`
4. Verify columns exist (e.g., `organization_id` on inventory, procurements, sales)

---

## Checking Migration Status

### Using Supabase Dashboard
1. Go to **Database → Migrations**
2. You'll see which migrations have been applied

### Using Supabase CLI
```bash
# Check migration status
npx supabase migration list

# See current database schema
npx supabase db diff
```

---

## Important Notes

- **Always backup your database** before running migrations on production
- Migrations are **idempotent** (safe to run multiple times) thanks to `IF NOT EXISTS` clauses
- The `COMPLETE_SETUP.sql` file is a convenience file - it's not tracked by Supabase CLI
- Individual migration files are what Supabase CLI uses
- If you've already run some migrations, don't use `COMPLETE_SETUP.sql` - use individual files instead

---

## Troubleshooting

### Migration fails with "relation already exists"
- The table/column already exists - this is usually fine due to `IF NOT EXISTS`
- Check if the migration partially ran

### RLS policy errors
- Policies might already exist - the migrations use `IF NOT EXISTS` where possible
- You may need to drop existing policies first if they conflict

### Organization migration issues
- If you have existing data, the migration will create organizations for each user
- Check the `organizations` table to see auto-created orgs

---

## Best Practices

1. **Test migrations locally first** using `supabase start`
2. **Review SQL before running** - especially on production
3. **Backup your database** before major migrations
4. **Apply migrations in order** - don't skip any
5. **Use Supabase CLI** for consistency across environments
6. **Commit migration files** to version control
