-- Phase 2: Price Alerts and Notifications Tables
-- Migration: Add price_alerts and notifications tables

-- ============================================================================
-- Price Alerts Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Card identification
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_image TEXT,
  set_name TEXT,
  condition TEXT DEFAULT 'NM' CHECK (condition IN ('NM', 'LP', 'MP', 'HP', 'DMG')),
  game_type TEXT DEFAULT 'pokemon' CHECK (game_type IN ('pokemon', 'onepiece')),

  -- Alert configuration
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below', 'change_percent')),
  target_price DECIMAL(10,2),
  threshold_percent DECIMAL(5,2),

  -- State
  is_active BOOLEAN DEFAULT true,
  is_triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  triggered_price DECIMAL(10,2),

  -- Notification preferences
  notify_in_app BOOLEAN DEFAULT true,
  notify_email BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for price_alerts
CREATE INDEX IF NOT EXISTS idx_price_alerts_org ON price_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_card ON price_alerts(card_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- RLS for price_alerts
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view alerts for their organization
CREATE POLICY "Users can view org price alerts"
ON price_alerts FOR SELECT
USING (organization_id IN (
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
));

-- Policy: Users can create alerts for their organization
CREATE POLICY "Users can create price alerts"
ON price_alerts FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
  AND user_id = auth.uid()
);

-- Policy: Users can update their own alerts
CREATE POLICY "Users can update own price alerts"
ON price_alerts FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own alerts
CREATE POLICY "Users can delete own price alerts"
ON price_alerts FOR DELETE
USING (user_id = auth.uid());

-- ============================================================================
-- Notifications Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Notification content
  type TEXT NOT NULL CHECK (type IN ('price_alert', 'system', 'report', 'inventory')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- Optional link to related page

  -- State
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Additional data
  metadata JSONB DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_org ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
USING (user_id = auth.uid());

-- Policy: System can create notifications (via service role)
-- Note: INSERT by regular users would require a function to validate

-- ============================================================================
-- Saved Reports Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Report configuration
  name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'profit_loss',
    'inventory_valuation',
    'sales_by_platform',
    'sales_by_set',
    'inventory_aging',
    'tax_summary',
    'custom'
  )),
  config JSONB NOT NULL DEFAULT '{}', -- Columns, filters, grouping, etc.

  -- Scheduling (optional)
  schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly')),
  schedule_day_of_week INTEGER CHECK (schedule_day_of_week >= 0 AND schedule_day_of_week <= 6),
  schedule_day_of_month INTEGER CHECK (schedule_day_of_month >= 1 AND schedule_day_of_month <= 31),
  schedule_email TEXT,
  last_run_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for saved_reports
CREATE INDEX IF NOT EXISTS idx_saved_reports_org ON saved_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_user ON saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_type ON saved_reports(report_type);

-- RLS for saved_reports
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view reports for their organization
CREATE POLICY "Users can view org reports"
ON saved_reports FOR SELECT
USING (organization_id IN (
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
));

-- Policy: Users can create reports for their organization
CREATE POLICY "Users can create reports"
ON saved_reports FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
  AND user_id = auth.uid()
);

-- Policy: Users can update their own reports
CREATE POLICY "Users can update own reports"
ON saved_reports FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own reports
CREATE POLICY "Users can delete own reports"
ON saved_reports FOR DELETE
USING (user_id = auth.uid());

-- ============================================================================
-- Update Supabase Types
-- ============================================================================

COMMENT ON TABLE price_alerts IS 'User-defined price alerts for cards';
COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON TABLE saved_reports IS 'Saved report configurations and schedules';
