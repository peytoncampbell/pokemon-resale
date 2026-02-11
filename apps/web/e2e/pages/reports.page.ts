import { Page, Locator } from '@playwright/test'

export class ReportsPage {
  readonly page: Page
  readonly profitLossTab: Locator
  readonly inventoryValuationTab: Locator
  readonly salesByPlatformTab: Locator
  readonly taxSummaryTab: Locator
  readonly reportContent: Locator
  readonly exportButton: Locator

  constructor(page: Page) {
    this.page = page
    this.profitLossTab = page.locator('button:has-text("P&L")').or(page.locator('button:has-text("Profit"))'))
    this.inventoryValuationTab = page.locator('button:has-text("Inventory")').or(page.locator('[data-testid="inventory-tab"]'))
    this.salesByPlatformTab = page.locator('button:has-text("Platform")').or(page.locator('[data-testid="platform-tab"]'))
    this.taxSummaryTab = page.locator('button:has-text("Tax")').or(page.locator('[data-testid="tax-tab"]'))
    this.reportContent = page.locator('[data-testid="report-content"]').or(page.locator('.report-content'))
    this.exportButton = page.locator('button:has-text("Export")').or(page.locator('[data-testid="export-button"]'))
  }

  async goto() {
    await this.page.goto('/reports')
  }

  async viewProfitLoss() {
    await this.profitLossTab.click()
    await this.page.waitForTimeout(500)
  }

  async viewInventoryValuation() {
    await this.inventoryValuationTab.click()
    await this.page.waitForTimeout(500)
  }

  async viewSalesByPlatform() {
    await this.salesByPlatformTab.click()
    await this.page.waitForTimeout(500)
  }

  async viewTaxSummary() {
    await this.taxSummaryTab.click()
    await this.page.waitForTimeout(500)
  }

  async isReportVisible() {
    return await this.reportContent.isVisible()
  }

  async exportReport() {
    await this.exportButton.click()
  }
}
