-- Price Snapshots Table
-- Stores historical price data scraped from TCGPlayer and eBay
-- Time-series design for tracking price changes over time

CREATE TABLE IF NOT EXISTS price_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'card' CHECK (product_type IN ('card', 'sealed')),
  game_type TEXT NOT NULL,
  market_price DECIMAL(10,2),
  low_price DECIMAL(10,2),
  source TEXT NOT NULL CHECK (source IN ('tcgplayer', 'ebay')),
  condition TEXT DEFAULT 'NM',
  raw_data JSONB,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time-series indexes for efficient queries
-- Primary lookup: find latest price for a specific card
CREATE INDEX IF NOT EXISTS idx_price_snapshots_card_time
  ON price_snapshots(card_id, recorded_at DESC);

-- Game-filtered queries: get recent prices for a specific game
CREATE INDEX IF NOT EXISTS idx_price_snapshots_game_time
  ON price_snapshots(game_type, recorded_at DESC);

-- Source filtering: query by scraper source
CREATE INDEX IF NOT EXISTS idx_price_snapshots_source
  ON price_snapshots(source);

-- Latest prices view
-- Returns most recent price snapshot for each card with freshness status
CREATE VIEW latest_prices AS
SELECT DISTINCT ON (card_id)
  card_id,
  card_name,
  product_type,
  game_type,
  market_price,
  low_price,
  source,
  condition,
  recorded_at,
  EXTRACT(EPOCH FROM (NOW() - recorded_at)) / 3600 AS hours_old,
  CASE
    WHEN recorded_at > NOW() - INTERVAL '48 hours' THEN 'fresh'
    WHEN recorded_at > NOW() - INTERVAL '7 days' THEN 'stale'
    ELSE 'very_stale'
  END AS freshness
FROM price_snapshots
ORDER BY card_id, recorded_at DESC;

-- Deduplication constraint
-- Prevents multiple snapshots for the same card/source/condition on the same day
CREATE UNIQUE INDEX IF NOT EXISTS idx_price_snapshots_dedup
  ON price_snapshots(card_id, source, condition, (recorded_at::date));

-- Row Level Security
ALTER TABLE price_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all price data (prices are public, not user-specific)
CREATE POLICY "Allow authenticated users to read price snapshots"
  ON price_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service_role can insert price data (scrapers run server-side)
CREATE POLICY "Allow service_role to insert price snapshots"
  ON price_snapshots
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- No UPDATE or DELETE policies for regular users (immutable time-series data)
-- Service role can still modify via direct SQL if needed for data correction
