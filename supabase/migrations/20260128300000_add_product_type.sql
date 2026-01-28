-- Add product_type column to inventory table
-- This column distinguishes between cards and sealed products (booster boxes, ETBs, etc.)

ALTER TABLE inventory
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'card'
CHECK (product_type IN ('card', 'sealed'));
