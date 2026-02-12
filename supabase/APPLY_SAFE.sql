-- SAFE MIGRATIONS - skips already-applied changes
-- Run in Supabase SQL Editor

-- ======= 1. Add price_updated_at to inventory =======
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS price_updated_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_inventory_price_updated ON inventory(price_updated_at) WHERE status IN ('IN_STOCK', 'LISTED');

-- ======= 2. Add role column to organization_members =======
DO $$ BEGIN
  CREATE TYPE organization_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Only add role if it doesn't exist
DO $$ BEGIN
  ALTER TABLE organization_members ADD COLUMN role organization_role NOT NULL DEFAULT 'editor';
EXCEPTION WHEN duplicate_column THEN null;
END $$;

-- Set existing org creators as admins
UPDATE organization_members om
SET role = 'admin'
WHERE om.user_id IN (
  SELECT o.created_by FROM organizations o WHERE o.id = om.organization_id
) AND om.role != 'admin';

-- ======= 3. Enum conversions (skip if already converted) =======

-- Create enum types if they don't exist
DO $$ BEGIN CREATE TYPE counterparty_type_enum AS ENUM ('STORE', 'PERSON', 'ONLINE', 'OTHER'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE transaction_type_enum AS ENUM ('BUY', 'SELL', 'TRADE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE product_type_enum AS ENUM ('card', 'sealed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE game_type_enum AS ENUM ('pokemon', 'onepiece'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Convert columns only if they're still TEXT type
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='counterparty_type' AND data_type='text') THEN
    ALTER TABLE transactions ALTER COLUMN counterparty_type TYPE counterparty_type_enum USING CASE WHEN counterparty_type IS NULL THEN NULL ELSE counterparty_type::counterparty_type_enum END;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='type' AND data_type='text') THEN
    ALTER TABLE transactions ALTER COLUMN type TYPE transaction_type_enum USING type::transaction_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='product_type' AND data_type='text') THEN
    ALTER TABLE inventory ALTER COLUMN product_type TYPE product_type_enum USING CASE WHEN product_type = 'card' OR product_type IS NULL THEN 'card'::product_type_enum WHEN product_type = 'sealed' THEN 'sealed'::product_type_enum ELSE 'card'::product_type_enum END;
    ALTER TABLE inventory ALTER COLUMN product_type SET DEFAULT 'card'::product_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventory' AND column_name='game_type' AND data_type='text') THEN
    ALTER TABLE inventory ALTER COLUMN game_type TYPE game_type_enum USING CASE WHEN game_type = 'pokemon' OR game_type IS NULL THEN 'pokemon'::game_type_enum WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum ELSE 'pokemon'::game_type_enum END;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transaction_items' AND column_name='game_type' AND data_type='text') THEN
    ALTER TABLE transaction_items ALTER COLUMN game_type TYPE game_type_enum USING CASE WHEN game_type IS NULL THEN NULL WHEN game_type = 'pokemon' THEN 'pokemon'::game_type_enum WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum ELSE 'pokemon'::game_type_enum END;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_snapshots' AND column_name='product_type' AND data_type='text') THEN
    ALTER TABLE price_snapshots ALTER COLUMN product_type TYPE product_type_enum USING CASE WHEN product_type = 'card' OR product_type IS NULL THEN 'card'::product_type_enum WHEN product_type = 'sealed' THEN 'sealed'::product_type_enum ELSE 'card'::product_type_enum END;
    ALTER TABLE price_snapshots ALTER COLUMN product_type SET DEFAULT 'card'::product_type_enum;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_snapshots' AND column_name='game_type' AND data_type='text') THEN
    ALTER TABLE price_snapshots ALTER COLUMN game_type TYPE game_type_enum USING CASE WHEN game_type = 'pokemon' OR game_type IS NULL THEN 'pokemon'::game_type_enum WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum ELSE 'pokemon'::game_type_enum END;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tcg_cache' AND column_name='game_type' AND data_type='text') THEN
    ALTER TABLE tcg_cache ALTER COLUMN game_type TYPE game_type_enum USING CASE WHEN game_type = 'pokemon' OR game_type IS NULL THEN 'pokemon'::game_type_enum WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum ELSE 'pokemon'::game_type_enum END;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='import_staging' AND column_name='product_type' AND data_type='text') THEN
    ALTER TABLE import_staging ALTER COLUMN product_type TYPE product_type_enum USING CASE WHEN product_type IS NULL THEN NULL WHEN product_type = 'card' THEN 'card'::product_type_enum WHEN product_type = 'sealed' THEN 'sealed'::product_type_enum ELSE 'card'::product_type_enum END;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='import_staging' AND column_name='game_type' AND data_type='text') THEN
    ALTER TABLE import_staging ALTER COLUMN game_type TYPE game_type_enum USING CASE WHEN game_type IS NULL THEN NULL WHEN game_type = 'pokemon' THEN 'pokemon'::game_type_enum WHEN game_type = 'onepiece' THEN 'onepiece'::game_type_enum ELSE 'pokemon'::game_type_enum END;
  END IF;
END $$;
