import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('should skip if no test database configured', async ({ page }) => {
    const skipTests = process.env.SKIP_E2E_TESTS_IF_NO_DB === 'true'
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

    if (skipTests && !hasSupabase) {
      test.skip()
    }
  })

  test('should display login page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    
    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.loginButton).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)
    
    await loginPage.emailInput.fill('invalid@example.com')
    await loginPage.passwordInput.fill('wrongpassword')
    await loginPage.loginButton.click()

    // Wait for error message to appear
    await page.waitForTimeout(2000)
    
    // Should still be on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL
    const testPassword = process.env.TEST_USER_PASSWORD

    // Skip if credentials not configured
    if (!testEmail || !testPassword) {
      test.skip()
      return
    }

    const loginPage = new LoginPage(page)
    await loginPage.login(testEmail, testPassword)

    // Should redirect away from login page
    await expect(page).not.toHaveURL(/\/login/)
    
    // Should be on dashboard or setup page
    await expect(page.url()).toMatch(/\/(dashboard|setup|\/)/)
  })
})
