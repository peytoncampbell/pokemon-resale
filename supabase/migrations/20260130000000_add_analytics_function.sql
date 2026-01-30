-- Analytics aggregation function to reduce client-side processing
-- This function calculates all analytics metrics in a single database call

CREATE OR REPLACE FUNCTION get_organization_analytics(org_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  inv_stats RECORD;
  sales_stats RECORD;
  pending_count INT;
  recent_activity JSON;
BEGIN
  -- Get inventory statistics
  SELECT
    COALESCE(SUM(CASE WHEN status IN ('IN_STOCK', 'LISTED') THEN acquisition_cost * quantity ELSE 0 END), 0) as total_inventory_value,
    COALESCE(SUM(CASE WHEN status IN ('IN_STOCK', 'LISTED') THEN quantity ELSE 0 END), 0) as total_items,
    COALESCE(SUM(acquisition_cost * quantity), 0) as total_invested,
    COALESCE(SUM(CASE WHEN status = 'SOLD' THEN 1 ELSE 0 END), 0) as items_sold,
    COALESCE(SUM(CASE WHEN status = 'IN_STOCK' THEN quantity ELSE 0 END), 0) as in_stock_count,
    COALESCE(SUM(CASE WHEN status = 'LISTED' THEN quantity ELSE 0 END), 0) as listed_count,
    COALESCE(SUM(CASE WHEN status = 'SOLD' THEN quantity ELSE 0 END), 0) as sold_count
  INTO inv_stats
  FROM inventory
  WHERE organization_id = org_id;

  -- Get sales statistics
  SELECT
    COALESCE(SUM(sale_price), 0) as total_revenue,
    COALESCE(SUM(fees + shipping_cost), 0) as total_fees
  INTO sales_stats
  FROM sales
  WHERE organization_id = org_id;

  -- Get pending procurements count
  SELECT COUNT(*)
  INTO pending_count
  FROM procurements
  WHERE organization_id = org_id AND status = 'PENDING';

  -- Get recent activity (last 7 days)
  SELECT COALESCE(json_agg(daily_stats ORDER BY date), '[]'::json)
  INTO recent_activity
  FROM (
    SELECT
      DATE(created_at) as date,
      SUM(quantity) as items_added,
      SUM(acquisition_cost * quantity) as value
    FROM inventory
    WHERE organization_id = org_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(created_at)
  ) daily_stats;

  -- Calculate profit (revenue - cost of sold items - fees)
  -- Note: This is a simplified calculation

  result := json_build_object(
    'totalInventoryValue', inv_stats.total_inventory_value,
    'totalItems', inv_stats.total_items,
    'totalInvested', inv_stats.total_invested,
    'itemsSold', inv_stats.items_sold,
    'totalRevenue', sales_stats.total_revenue,
    'totalProfit', sales_stats.total_revenue - sales_stats.total_fees,
    'pendingProcurements', pending_count,
    'inventoryByStatus', json_build_object(
      'IN_STOCK', inv_stats.in_stock_count,
      'LISTED', inv_stats.listed_count,
      'SOLD', inv_stats.sold_count
    ),
    'recentActivity', recent_activity
  );

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_organization_analytics(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_organization_analytics IS 'Calculates organization analytics metrics in a single database call for better performance';
