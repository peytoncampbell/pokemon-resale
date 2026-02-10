-- Allow authenticated users to insert price snapshots
-- API routes verify auth before calling savePriceSnapshot
CREATE POLICY "Allow authenticated users to insert price snapshots"
  ON price_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
