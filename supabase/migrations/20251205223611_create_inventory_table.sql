/*
  # Create Pokemon Inventory Table

  1. New Tables
    - `inventory`
      - `id` (uuid, primary key) - Unique inventory item ID
      - `card_id` (text) - Pokemon TCG API card ID
      - `card_name` (text) - Card name for quick display
      - `card_image` (text) - Card image URL from API
      - `set_name` (text) - Set name (e.g., "Base Set")
      - `location` (text) - Storage location (e.g., "BIN-01")
      - `acquisition_cost` (decimal) - Purchase price in CAD
      - `quantity` (integer) - Number of cards
      - `status` (text) - IN_STOCK, LISTED, or SOLD
      - `notes` (text, optional) - Additional notes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `inventory` table
    - Add policy for public access (simplified for MVP)
*/

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text NOT NULL,
  card_name text NOT NULL,
  card_image text,
  set_name text,
  location text NOT NULL DEFAULT 'BIN-01',
  acquisition_cost decimal(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'LISTED', 'SOLD')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON inventory
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON inventory
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON inventory
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON inventory
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS inventory_status_idx ON inventory(status);
CREATE INDEX IF NOT EXISTS inventory_location_idx ON inventory(location);
CREATE INDEX IF NOT EXISTS inventory_created_at_idx ON inventory(created_at DESC);
