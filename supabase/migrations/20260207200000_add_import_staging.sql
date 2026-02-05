/*
  # CSV Import Staging Table

  This migration creates the staging infrastructure for CSV/Excel bulk imports.
  Supports multi-step import workflow: parse -> validate -> preview -> insert.

  1. New Table: import_staging
     - Stores parsed CSV rows with session grouping
     - Tracks validation status and errors per row
     - Holds normalized data ready for bulk insert

  2. Function: validate_inventory_import
     - Validates all rows for a session
     - Checks required fields, data types, formats
     - Marks rows as valid/invalid with error messages

  3. Security
     - RLS policies scoped to organization membership
     - Auto-cleanup comment for rows older than 24 hours
*/

-- ============================================
-- Create import_staging table
-- ============================================

CREATE TABLE IF NOT EXISTS import_staging (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,                -- Groups all rows from one import
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  -- Raw data from CSV
  row_number integer NOT NULL,             -- Original row number (for error reporting)
  raw_data jsonb NOT NULL,                 -- Parsed CSV data as JSON

  -- Validation results
  is_valid boolean DEFAULT false,
  validation_errors text[],                -- Array of error messages

  -- Normalized data (if valid)
  normalized_data jsonb,                   -- Clean data ready for insert

  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE import_staging IS 'Staging table for CSV imports. Rows older than 24 hours are eligible for cleanup.';

-- ============================================
-- Indexes
-- ============================================

-- Primary lookup by session
CREATE INDEX idx_staging_session ON import_staging(session_id, row_number);

-- Organization-scoped queries
CREATE INDEX idx_staging_org ON import_staging(organization_id);

-- Cleanup by age
CREATE INDEX idx_staging_created_at ON import_staging(created_at);

-- ============================================
-- Validation Function
-- ============================================

CREATE OR REPLACE FUNCTION validate_inventory_import(p_session_id uuid)
RETURNS void AS $$
DECLARE
  v_row RECORD;
  v_errors text[];
  v_card_name text;
  v_quantity text;
  v_acquisition_cost text;
  v_acquisition_date text;
  v_condition text;
BEGIN
  -- Loop through all rows for this session
  FOR v_row IN
    SELECT * FROM import_staging
    WHERE session_id = p_session_id
  LOOP
    v_errors := ARRAY[]::text[];

    -- Extract fields from raw_data
    v_card_name := v_row.raw_data->>'card_name';
    v_quantity := v_row.raw_data->>'quantity';
    v_acquisition_cost := v_row.raw_data->>'acquisition_cost';
    v_acquisition_date := v_row.raw_data->>'acquisition_date';
    v_condition := v_row.raw_data->>'condition';

    -- ============================================
    -- Required field validation
    -- ============================================

    IF v_card_name IS NULL OR trim(v_card_name) = '' THEN
      v_errors := array_append(v_errors, 'Card name is required');
    END IF;

    IF v_quantity IS NULL OR trim(v_quantity) = '' THEN
      v_errors := array_append(v_errors, 'Quantity is required');
    ELSIF NOT v_quantity ~ '^[0-9]+$' THEN
      v_errors := array_append(v_errors, 'Quantity must be a positive integer');
    ELSIF v_quantity::integer <= 0 THEN
      v_errors := array_append(v_errors, 'Quantity must be greater than 0');
    END IF;

    IF v_acquisition_cost IS NULL OR trim(v_acquisition_cost) = '' THEN
      v_errors := array_append(v_errors, 'Acquisition cost is required');
    ELSIF NOT v_acquisition_cost ~ '^[0-9]+\.?[0-9]*$' THEN
      v_errors := array_append(v_errors, 'Acquisition cost must be a valid decimal number');
    ELSIF v_acquisition_cost::decimal < 0 THEN
      v_errors := array_append(v_errors, 'Acquisition cost cannot be negative');
    END IF;

    -- ============================================
    -- Optional field validation
    -- ============================================

    -- Date validation (if provided)
    IF v_acquisition_date IS NOT NULL AND trim(v_acquisition_date) <> '' THEN
      BEGIN
        PERFORM v_acquisition_date::date;
      EXCEPTION
        WHEN OTHERS THEN
          v_errors := array_append(v_errors, 'Acquisition date must be in YYYY-MM-DD format');
      END;
    END IF;

    -- Condition validation (if provided)
    IF v_condition IS NOT NULL AND trim(v_condition) <> '' THEN
      IF v_condition NOT IN ('NM', 'LP', 'MP', 'HP', 'DMG') THEN
        v_errors := array_append(v_errors, 'Condition must be one of: NM, LP, MP, HP, DMG');
      END IF;
    END IF;

    -- ============================================
    -- Update validation status
    -- ============================================

    IF array_length(v_errors, 1) IS NULL THEN
      -- Valid row: create normalized data
      UPDATE import_staging SET
        is_valid = true,
        validation_errors = NULL,
        normalized_data = jsonb_build_object(
          'card_name', trim(v_card_name),
          'quantity', v_quantity::integer,
          'acquisition_cost', v_acquisition_cost::decimal(10,2),
          'acquisition_date', COALESCE(
            CASE
              WHEN v_acquisition_date IS NOT NULL AND trim(v_acquisition_date) <> ''
              THEN v_acquisition_date::date
              ELSE CURRENT_DATE
            END,
            CURRENT_DATE
          ),
          'condition', COALESCE(NULLIF(trim(v_condition), ''), 'NM'),
          'card_id', COALESCE(v_row.raw_data->>'card_id', ''),
          'card_image', v_row.raw_data->>'card_image',
          'set_name', v_row.raw_data->>'set_name',
          'location', COALESCE(v_row.raw_data->>'location', 'BIN-01'),
          'game_type', COALESCE(v_row.raw_data->>'game_type', 'pokemon'),
          'product_type', COALESCE(v_row.raw_data->>'product_type', 'card'),
          'notes', v_row.raw_data->>'notes'
        )
      WHERE id = v_row.id;
    ELSE
      -- Invalid row: store errors
      UPDATE import_staging SET
        is_valid = false,
        validation_errors = v_errors,
        normalized_data = NULL
      WHERE id = v_row.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE import_staging ENABLE ROW LEVEL SECURITY;

-- Members can view staging rows for their organization
CREATE POLICY "Members can view org staging"
  ON import_staging FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members can insert staging rows for their organization
CREATE POLICY "Members can insert org staging"
  ON import_staging FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members can update staging rows for their organization
CREATE POLICY "Members can update org staging"
  ON import_staging FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Members can delete staging rows for their organization
CREATE POLICY "Members can delete org staging"
  ON import_staging FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Service role can do everything (for cleanup operations)
CREATE POLICY "Service role full access to staging"
  ON import_staging
  TO service_role
  USING (true)
  WITH CHECK (true);
