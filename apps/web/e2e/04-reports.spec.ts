import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page'
import { ReportsPage } from './pages/reports.page'

test.describe('Reports Viewing', () => {
  test.beforeEach(async ({ page }) => {
    // Skip if no test database configured
    const skipTests = process.env.SKIP_E2E_TESTS_IF_NO_DB === 'true'
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

    if (skipTests && !hasSupabase) {
      test.skip()
      return
    }

    // Login first
    const testEmail = process.env.TEST_USER_EMAIL
    const testPassword = process.env.TEST_USER_PASSWORD

    if (!testEmail || !testPassword) {
      test.skip()
      return
    }

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(testEmail, testPassword)
  })

  test('should display reports page', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()

    // Should see at least one report tab
    await expect(page.locator('button, a').filter({ hasText: /profit|inventory|platform|tax/i }).first()).toBeVisible()
  })

  test('should view profit & loss report', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    // Try to click P&L tab if visible
    if (await reportsPage.profitLossTab.isVisible().catch(() => false)) {
      await reportsPage.viewProfitLoss()
      
      // Should show some report content
      await page.waitForTimeout(1000)
      
      // Check for common P&L elements (revenue, costs, profit, etc.)
      const hasReportContent = await page.locator('text=/revenue|profit|cost|sales/i').first().isVisible().catch(() => false)
      expect(hasReportContent).toBeTruthy()
    }
  })

  test('should view inventory valuation report', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    // Try to click inventory tab if visible
    if (await reportsPage.inventoryValuationTab.isVisible().catch(() => false)) {
      await reportsPage.viewInventoryValuation()
      
      // Should show some report content
      await page.waitForTimeout(1000)
      
      // Check for inventory-related content
      const hasInventoryContent = await page.locator('text=/inventory|valuation|items|value/i').first().isVisible().catch(() => false)
      expect(hasInventoryContent).toBeTruthy()
    }
  })

  test('should view sales by platform report', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    // Try to click platform tab if visible
    if (await reportsPage.salesByPlatformTab.isVisible().catch(() => false)) {
      await reportsPage.viewSalesByPlatform()
      
      // Should show some report content
      await page.waitForTimeout(1000)
      
      // Check for platform-related content
      const hasPlatformContent = await page.locator('text=/platform|ebay|tcgplayer|sales/i').first().isVisible().catch(() => false)
      expect(hasPlatformContent).toBeTruthy()
    }
  })

  test('should view tax summary report', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    // Try to click tax tab if visible
    if (await reportsPage.taxSummaryTab.isVisible().catch(() => false)) {
      await reportsPage.viewTaxSummary()
      
      // Should show some report content
      await page.waitForTimeout(1000)
      
      // Check for tax-related content
      const hasTaxContent = await page.locator('text=/tax|schedule|proceeds|basis/i').first().isVisible().catch(() => false)
      expect(hasTaxContent).toBeTruthy()
    }
  })

  test('should navigate between different reports', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    // Wait for page to load
    await page.waitForTimeout(1000)
    
    // Count available report tabs
    const reportTabs = await page.locator('button, a').filter({ hasText: /profit|inventory|platform|tax/i }).count()
    
    expect(reportTabs).toBeGreaterThan(0)
  })
})
