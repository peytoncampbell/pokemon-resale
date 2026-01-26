/*
  # Add Authentication, Procurements, and Sales

  1. Changes to inventory table
    - Add `user_id` column (references auth.users)
    - Add `condition` column (NM, LP, MP, HP, DMG)
    - Add `procurement_id` column (references procurements)

  2. New Tables
    - `procurements` - Track purchase orders
    - `sales` - Track sold items

  3. Security
    - Update RLS policies to filter by user_id
*/

-- Create procurements table first (inventory references it)
CREATE TABLE IF NOT EXISTS procurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier text NOT NULL,
  order_date date DEFAULT CURRENT_DATE,
  subtotal decimal(10,2) DEFAULT 0,
  shipping decimal(10,2) DEFAULT 0,
  fees decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECEIVED', 'CANCELLED')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to inventory
ALTER TABLE inventory 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS condition text DEFAULT 'NM' CHECK (condition IN ('NM', 'LP', 'MP', 'HP', 'DMG')),
  ADD COLUMN IF NOT EXISTS procurement_id uuid REFERENCES procurements(id) ON DELETE SET NULL;

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  inventory_id uuid REFERENCES inventory(id) ON DELETE SET NULL,
  sale_price decimal(10,2) NOT NULL,
  platform text,
  fees decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  sold_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Drop old public policies on inventory
DROP POLICY IF EXISTS "Allow public read access" ON inventory;
DROP POLICY IF EXISTS "Allow public insert access" ON inventory;
DROP POLICY IF EXISTS "Allow public update access" ON inventory;
DROP POLICY IF EXISTS "Allow public delete access" ON inventory;

-- Create user-based policies for inventory
CREATE POLICY "Users can view own inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for procurements
CREATE POLICY "Users can view own procurements"
  ON procurements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own procurements"
  ON procurements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own procurements"
  ON procurements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own procurements"
  ON procurements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for sales
CREATE POLICY "Users can view own sales"
  ON sales FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales"
  ON sales FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales"
  ON sales FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for new tables and columns
CREATE INDEX IF NOT EXISTS inventory_user_id_idx ON inventory(user_id);
CREATE INDEX IF NOT EXISTS inventory_condition_idx ON inventory(condition);
CREATE INDEX IF NOT EXISTS inventory_procurement_id_idx ON inventory(procurement_id);

CREATE INDEX IF NOT EXISTS procurements_user_id_idx ON procurements(user_id);
CREATE INDEX IF NOT EXISTS procurements_status_idx ON procurements(status);
CREATE INDEX IF NOT EXISTS procurements_order_date_idx ON procurements(order_date DESC);

CREATE INDEX IF NOT EXISTS sales_user_id_idx ON sales(user_id);
CREATE INDEX IF NOT EXISTS sales_inventory_id_idx ON sales(inventory_id);
CREATE INDEX IF NOT EXISTS sales_sold_at_idx ON sales(sold_at DESC);
