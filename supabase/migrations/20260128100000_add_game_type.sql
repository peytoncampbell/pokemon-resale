-- Add game_type column to inventory (defaults to 'pokemon' for existing rows)
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS game_type text NOT NULL DEFAULT 'pokemon'
  CHECK (game_type IN ('pokemon', 'onepiece'));

-- Add game_type column to procurement_expected_items
ALTER TABLE procurement_expected_items ADD COLUMN IF NOT EXISTS game_type text NOT NULL DEFAULT 'pokemon'
  CHECK (game_type IN ('pokemon', 'onepiece'));

-- Index for filtering by game type
CREATE INDEX IF NOT EXISTS inventory_game_type_idx ON inventory(game_type);
