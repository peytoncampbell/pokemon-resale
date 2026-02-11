import { Page, Locator } from '@playwright/test'

export class TransactionsPage {
  readonly page: Page
  readonly recordSaleButton: Locator
  readonly selectItemButton: Locator
  readonly salePriceInput: Locator
  readonly platformSelect: Locator
  readonly counterpartyInput: Locator
  readonly submitButton: Locator
  readonly transactionItems: Locator

  constructor(page: Page) {
    this.page = page
    this.recordSaleButton = page.locator('button:has-text("Record Sale")').or(page.locator('button:has-text("Sell")')).first()
    this.selectItemButton = page.locator('button:has-text("Select Item")').or(page.locator('[data-testid="select-item"]'))
    this.salePriceInput = page.locator('input[name="salePrice"]').or(page.locator('input[placeholder*="price"]'))
    this.platformSelect = page.locator('select[name="platform"]').or(page.locator('#platform'))
    this.counterpartyInput = page.locator('input[name="counterparty"]').or(page.locator('input[placeholder*="buyer"]'))
    this.submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Submit")'))
    this.transactionItems = page.locator('[data-testid="transaction-item"]').or(page.locator('.transaction-row'))
  }

  async goto() {
    await this.page.goto('/transactions')
  }

  async recordSale(options: {
    itemIndex?: number
    salePrice: number
    platform?: string
    counterparty?: string
  }) {
    await this.recordSaleButton.click()
    
    // Wait for modal/form
    await this.page.waitForTimeout(500)

    // Select item if needed
    if (options.itemIndex !== undefined) {
      await this.selectItemButton.click()
      await this.page.locator(`[data-testid="inventory-item-${options.itemIndex}"]`).or(this.page.locator('.inventory-item').nth(options.itemIndex)).click()
    }

    // Fill in sale details
    await this.salePriceInput.fill(options.salePrice.toString())
    
    if (options.platform) {
      await this.platformSelect.selectOption(options.platform)
    }
    
    if (options.counterparty) {
      await this.counterpartyInput.fill(options.counterparty)
    }

    await this.submitButton.click()
    
    // Wait for the transaction to be recorded
    await this.page.waitForTimeout(1000)
  }

  async getTransactionCount() {
    return await this.transactionItems.count()
  }
}
