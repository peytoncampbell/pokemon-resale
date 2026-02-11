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
