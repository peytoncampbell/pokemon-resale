-- SAFE MIGRATIONS v2 - uses udt_name to detect column types
-- Run in Supabase SQL Editor

-- ======= 1. Add price_updated_at to inventory =======
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS price_updated_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_inventory_price_updated ON inventory(price_updated_at) WHERE status IN ('IN_STOCK', 'LISTED');

-- ======= 2. Add role column to organization_members =======
DO $$ BEGIN
  CREATE TYPE organization_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE organization_members ADD COLUMN role organization_role NOT NULL DEFAULT 'editor';
EXCEPTION WHEN duplicate_column THEN null;
END $$;

UPDATE organization_members om
SET role = 'admin'
WHERE om.user_id IN (
  SELECT o.created_by FROM organizations o WHERE o.id = om.organization_id
) AND om.role != 'admin';

-- ======= 3. Enum types (create if missing) =======
DO $$ BEGIN CREATE TYPE counterparty_type_enum AS ENUM ('STORE', 'PERSON', 'ONLINE', 'OTHER'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE transaction_type_enum AS ENUM ('BUY', 'SELL', 'TRADE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE product_type_enum AS ENUM ('card', 'sealed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE game_type_enum AS ENUM ('pokemon', 'onepiece'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ======= 4. Convert columns ONLY if udt_name is NOT already the enum =======

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='counterparty_type' AND udt_name != 'counterparty_type_enum') THEN
    ALTER TABLE transactions ALTER COLUMN counterparty_type DROP DEFAULT;
    ALTER TABLE transactions ALTER COLUMN counterparty_type TYPE counterparty_type_enum USING counterparty_type::text::counterparty_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='type' AND udt_name != 'transaction_type_enum') THEN
    ALTER TABLE transactions ALTER COLUMN type TYPE transaction_type_enum USING type::text::transaction_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='product_type' AND udt_name != 'product_type_enum') THEN
    ALTER TABLE inventory ALTER COLUMN product_type DROP DEFAULT;
    ALTER TABLE inventory ALTER COLUMN product_type TYPE product_type_enum USING product_type::text::product_type_enum;
    ALTER TABLE inventory ALTER COLUMN product_type SET DEFAULT 'card'::product_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='game_type' AND udt_name != 'game_type_enum') THEN
    ALTER TABLE inventory ALTER COLUMN game_type TYPE game_type_enum USING game_type::text::game_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transaction_items' AND column_name='game_type' AND udt_name != 'game_type_enum') THEN
    ALTER TABLE transaction_items ALTER COLUMN game_type TYPE game_type_enum USING game_type::text::game_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_snapshots' AND column_name='product_type' AND udt_name != 'product_type_enum') THEN
    ALTER TABLE price_snapshots ALTER COLUMN product_type DROP DEFAULT;
    ALTER TABLE price_snapshots ALTER COLUMN product_type TYPE product_type_enum USING product_type::text::product_type_enum;
    ALTER TABLE price_snapshots ALTER COLUMN product_type SET DEFAULT 'card'::product_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_snapshots' AND column_name='game_type' AND udt_name != 'game_type_enum') THEN
    ALTER TABLE price_snapshots ALTER COLUMN game_type TYPE game_type_enum USING game_type::text::game_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tcg_cache' AND column_name='game_type' AND udt_name != 'game_type_enum') THEN
    ALTER TABLE tcg_cache ALTER COLUMN game_type TYPE game_type_enum USING game_type::text::game_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='import_staging' AND column_name='product_type' AND udt_name != 'product_type_enum') THEN
    ALTER TABLE import_staging ALTER COLUMN product_type TYPE product_type_enum USING product_type::text::product_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='import_staging' AND column_name='game_type' AND udt_name != 'game_type_enum') THEN
    ALTER TABLE import_staging ALTER COLUMN game_type TYPE game_type_enum USING game_type::text::game_type_enum;
  END IF;
END $$;
