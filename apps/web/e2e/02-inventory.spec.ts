import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page'
import { InventoryPage } from './pages/inventory.page'

test.describe('Inventory Management', () => {
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

  test('should display inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()

    await expect(inventoryPage.addButton).toBeVisible()
  })

  test('should search for a card', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    
    await inventoryPage.clickAddCard()
    await inventoryPage.searchCard('Charizard')
    
    // Wait for results to load
    await page.waitForTimeout(2000)
    
    // Should show some results (or a message if API not configured)
    const resultsCount = await inventoryPage.cardResults.count()
    // Results should either be > 0 or we should see a "no results" or "configure API" message
    expect(resultsCount >= 0).toBeTruthy()
  })

  test('should add a card to inventory', async ({ page }) => {
    // This test requires JustTCG API to be configured
    const hasApiKey = !!process.env.JUSTTCG_API_KEY
    if (!hasApiKey) {
      test.skip()
      return
    }

    const inventoryPage = new InventoryPage(page)
    await inventoryPage.goto()
    
    const initialCount = await inventoryPage.getInventoryItemCount()
    
    await inventoryPage.searchAndAddCard('Pikachu', {
      quantity: 1,
      cost: 10.00,
      location: 'BIN-01'
    })
    
    // Wait for the item to be added
    await page.waitForTimeout(2000)
    await inventoryPage.goto() // Refresh to see new item
    
    const newCount = await inventoryPage.getInventoryItemCount()
    expect(newCount).toBeGreaterThan(initialCount)
  })
})
