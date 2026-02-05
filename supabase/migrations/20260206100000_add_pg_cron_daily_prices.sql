-- Daily Price Scraping with pg_cron
-- Schedules automated price updates at 2 AM UTC daily
-- Requires pg_cron and pg_net extensions

-- IMPORTANT SETUP REQUIREMENTS:
-- 1. Enable extensions in Supabase Dashboard first:
--    - Go to Database > Extensions
--    - Enable "pg_cron" extension
--    - Enable "pg_net" extension
--
-- 2. Configure app settings (run these commands in SQL Editor manually):
--    ALTER DATABASE postgres SET app.settings.project_url = 'https://your-app.vercel.app';
--    ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
--
--    IMPORTANT: These ALTER DATABASE statements MUST be run manually in the SQL editor.
--    Do NOT store service role keys in version control.
--
-- 3. Alternative: Use Supabase Vault for secure secret storage (if available):
--    - Store service_role_key in vault.decrypted_secrets
--    - Reference it in the cron job below

-- Enable required extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily price scraping at 2 AM UTC
SELECT cron.schedule(
  'daily-price-scraping',
  '0 2 * * *',  -- Cron expression: minute hour day month dayofweek
  $$
  SELECT
    net.http_post(
      url := current_setting('app.settings.project_url', true) || '/api/cron/daily-price-update',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := '{"source": "cron"}'::jsonb
    ) AS request_id;
  $$
);

-- Schedule weekly cleanup of old price snapshots (keep last 90 days)
SELECT cron.schedule(
  'cleanup-old-price-snapshots',
  '0 3 * * 0',  -- Weekly on Sunday at 3 AM UTC
  $$
  DELETE FROM price_snapshots WHERE recorded_at < NOW() - INTERVAL '90 days';
  $$
);

-- Verify cron jobs are scheduled
-- You can check scheduled jobs with:
-- SELECT * FROM cron.job;

-- To unschedule a job (if needed for debugging):
-- SELECT cron.unschedule('daily-price-scraping');
-- SELECT cron.unschedule('cleanup-old-price-snapshots');
