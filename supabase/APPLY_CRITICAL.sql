-- Critical fixes only: price_updated_at + organization role column

ALTER TABLE inventory ADD COLUMN IF NOT EXISTS price_updated_at TIMESTAMPTZ;

DO $$ BEGIN
  CREATE TYPE organization_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE organization_members ADD COLUMN role organization_role NOT NULL DEFAULT 'editor';
EXCEPTION WHEN duplicate_column THEN null;
END $$;

UPDATE organization_members om
SET role = 'admin'
WHERE om.user_id IN (
  SELECT o.created_by FROM organizations o WHERE o.id = om.organization_id
) AND om.role != 'admin';
