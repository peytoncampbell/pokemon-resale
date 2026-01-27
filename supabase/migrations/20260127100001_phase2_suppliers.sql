-- ============================================
-- Phase 2: Supplier & Procurement Intelligence
-- ============================================

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  website text,
  address text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create procurement_expected_items table
CREATE TABLE IF NOT EXISTS procurement_expected_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id uuid REFERENCES procurements(id) ON DELETE CASCADE NOT NULL,
  card_id text NOT NULL,
  card_name text NOT NULL,
  card_image text,
  set_name text,
  expected_quantity integer NOT NULL DEFAULT 1,
  received_quantity integer NOT NULL DEFAULT 0,
  expected_cost decimal(10,2),
  notes text,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECEIVED', 'PARTIAL', 'MISSING')),
  created_at timestamptz DEFAULT now()
);

-- Create procurement_attachments table
CREATE TABLE IF NOT EXISTS procurement_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id uuid REFERENCES procurements(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Add supplier_id to procurements table
ALTER TABLE procurements
  ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_expected_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suppliers
CREATE POLICY "Members can view org suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert org suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update org suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete org suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for procurement_expected_items
CREATE POLICY "Members can view expected items"
  ON procurement_expected_items FOR SELECT
  TO authenticated
  USING (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can insert expected items"
  ON procurement_expected_items FOR INSERT
  TO authenticated
  WITH CHECK (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can update expected items"
  ON procurement_expected_items FOR UPDATE
  TO authenticated
  USING (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can delete expected items"
  ON procurement_expected_items FOR DELETE
  TO authenticated
  USING (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for procurement_attachments
CREATE POLICY "Members can view attachments"
  ON procurement_attachments FOR SELECT
  TO authenticated
  USING (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can insert attachments"
  ON procurement_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can delete attachments"
  ON procurement_attachments FOR DELETE
  TO authenticated
  USING (
    procurement_id IN (
      SELECT p.id FROM procurements p
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_suppliers_org_id ON suppliers(organization_id);
CREATE INDEX IF NOT EXISTS idx_procurement_expected_items_procurement_id ON procurement_expected_items(procurement_id);
CREATE INDEX IF NOT EXISTS idx_procurement_attachments_procurement_id ON procurement_attachments(procurement_id);
CREATE INDEX IF NOT EXISTS idx_procurements_supplier_id ON procurements(supplier_id);
