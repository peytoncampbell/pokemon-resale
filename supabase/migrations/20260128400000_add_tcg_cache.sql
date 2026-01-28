-- TCG Cache Table
-- Stores cached data from external sources (TCGPlayer, eBay) to reduce API calls

CREATE TABLE IF NOT EXISTS tcg_cache (
  id TEXT PRIMARY KEY,
  product_type TEXT NOT NULL CHECK (product_type IN ('card', 'sealed', 'graded')),
  game_type TEXT NOT NULL CHECK (game_type IN ('pokemon', 'onepiece')),
  data JSONB NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('justtcg', 'tcgplayer', 'ebay')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Index for cache lookups
CREATE INDEX IF NOT EXISTS idx_tcg_cache_lookup
  ON tcg_cache(product_type, game_type, expires_at);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_tcg_cache_expires
  ON tcg_cache(expires_at);

-- No RLS needed - this is a system table not tied to user data
-- Service role key should be used for cache operations
