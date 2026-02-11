import { Page, Locator } from '@playwright/test'

export class InventoryPage {
  readonly page: Page
  readonly addButton: Locator
  readonly searchInput: Locator
  readonly cardResults: Locator
  readonly addToInventoryButton: Locator
  readonly quantityInput: Locator
  readonly costInput: Locator
  readonly locationInput: Locator
  readonly saveButton: Locator
  readonly inventoryItems: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = page.locator('button:has-text("Add Card")')
    this.searchInput = page.locator('input[placeholder*="Search"]').first()
    this.cardResults = page.locator('[data-testid="card-result"]').or(page.locator('.card-result'))
    this.addToInventoryButton = page.locator('button:has-text("Add to Inventory")').first()
    this.quantityInput = page.locator('input[type="number"]').filter({ hasText: /quantity/i }).or(page.locator('#quantity'))
    this.costInput = page.locator('input[type="number"]').filter({ hasText: /cost/i }).or(page.locator('#cost'))
    this.locationInput = page.locator('input[placeholder*="location"]').or(page.locator('#location'))
    this.saveButton = page.locator('button:has-text("Save")').or(page.locator('button:has-text("Add")')).last()
    this.inventoryItems = page.locator('[data-testid="inventory-item"]').or(page.locator('.inventory-card'))
  }

  async goto() {
    await this.page.goto('/inventory')
  }

  async clickAddCard() {
    await this.addButton.click()
  }

  async searchCard(cardName: string) {
    await this.searchInput.fill(cardName)
    await this.page.waitForTimeout(1000) // Wait for debounced search
  }

  async selectFirstCard() {
    await this.cardResults.first().click()
  }

  async addCardToInventory(options: {
    quantity?: number
    cost?: number
    location?: string
  }) {
    // Wait for modal/form to be visible
    await this.page.waitForTimeout(500)

    if (options.quantity) {
      await this.quantityInput.fill(options.quantity.toString())
    }
    if (options.cost) {
      await this.costInput.fill(options.cost.toString())
    }
    if (options.location) {
      await this.locationInput.fill(options.location)
    }
    
    await this.saveButton.click()
    // Wait for the item to be added
    await this.page.waitForTimeout(1000)
  }

  async getInventoryItemCount() {
    return await this.inventoryItems.count()
  }

  async searchAndAddCard(cardName: string, options: {
    quantity?: number
    cost?: number
    location?: string
  }) {
    await this.clickAddCard()
    await this.searchCard(cardName)
    await this.selectFirstCard()
    await this.addCardToInventory(options)
  }
}
