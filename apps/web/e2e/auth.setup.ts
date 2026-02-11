import { test as setup } from '@playwright/test'
import { LoginPage } from './pages/login.page'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const testEmail = process.env.TEST_USER_EMAIL
  const testPassword = process.env.TEST_USER_PASSWORD

  // Skip if no test credentials configured
  if (!testEmail || !testPassword) {
    console.log('⚠️  Skipping auth setup: TEST_USER_EMAIL and TEST_USER_PASSWORD not configured in .env.test')
    return
  }

  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(testEmail, testPassword)

  // Wait for successful login (should redirect away from /login)
  await page.waitForTimeout(3000)

  // Save authenticated state
  await page.context().storageState({ path: authFile })
})
