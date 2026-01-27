-- ============================================
-- Phase 1: Core Inventory Enhancements
-- ============================================

-- Add index for duplicate detection (card_id + organization_id)
CREATE INDEX IF NOT EXISTS idx_inventory_card_id_org ON inventory(card_id, organization_id);

-- Add index for faster filtering by condition
CREATE INDEX IF NOT EXISTS idx_inventory_condition ON inventory(condition);
