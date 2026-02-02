-- Migration: Add missing indexes for performance optimization
-- Created: 2026-02-02
-- Purpose: Index unindexed foreign keys and frequently queried columns

-- Index for organizations.created_by (used in RLS policies)
CREATE INDEX IF NOT EXISTS idx_organizations_created_by
  ON organizations(created_by);

-- Index for organization_invites.email (used in email lookup/RLS)
CREATE INDEX IF NOT EXISTS idx_organization_invites_email
  ON organization_invites(email);

-- Index for transactions.platform (used in analytics queries)
CREATE INDEX IF NOT EXISTS idx_transactions_platform
  ON transactions(platform);

-- Index for price_history.source (used in analytics queries)
CREATE INDEX IF NOT EXISTS idx_price_history_source
  ON price_history(source);

-- Index for procurement_attachments.uploaded_by (foreign key without index)
CREATE INDEX IF NOT EXISTS idx_procurement_attachments_uploaded_by
  ON procurement_attachments(uploaded_by);

-- Index for transactions.counterparty_name (used in reporting/search)
CREATE INDEX IF NOT EXISTS idx_transactions_counterparty_name
  ON transactions(counterparty_name);

-- Composite index for inventory duplicate detection (card_id + organization_id)
-- Note: Only create if not already covered by existing indexes
CREATE INDEX IF NOT EXISTS idx_inventory_card_org
  ON inventory(organization_id, card_id);

COMMENT ON INDEX idx_organizations_created_by IS 'Optimization: speeds up RLS policy checks';
COMMENT ON INDEX idx_organization_invites_email IS 'Optimization: speeds up invite lookup by email';
COMMENT ON INDEX idx_transactions_platform IS 'Optimization: speeds up platform-based analytics';
