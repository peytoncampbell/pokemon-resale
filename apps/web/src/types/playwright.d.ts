// Type declarations for playwright packages used in server-side scraping

declare module '@sparticuz/chromium' {
  const chromium: {
    args: string[]
    defaultViewport: { width: number; height: number }
    executablePath: (path?: string) => Promise<string>
    headless: boolean | 'shell'
  }
  export default chromium
}

declare module 'playwright-core' {
  export interface Browser {
    close(): Promise<void>
    newPage(): Promise<Page>
    newContext(options?: BrowserContextOptions): Promise<BrowserContext>
  }

  export interface BrowserContext {
    close(): Promise<void>
    newPage(): Promise<Page>
  }

  export interface BrowserContextOptions {
    userAgent?: string
    viewport?: { width: number; height: number }
  }

  export interface Page {
    goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number }): Promise<void>
    content(): Promise<string>
    close(): Promise<void>
    waitForSelector(selector: string, options?: { timeout?: number }): Promise<ElementHandle | null>
    waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle', options?: { timeout?: number }): Promise<void>
    waitForTimeout(timeout: number): Promise<void>
    screenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer>
    $(selector: string): Promise<ElementHandle | null>
    $$(selector: string): Promise<ElementHandle[]>
    evaluate<T>(fn: string | (() => T)): Promise<T>
    evaluate<T, A>(fn: (arg: A) => T, arg: A): Promise<T>
  }

  export interface ElementHandle {
    textContent(): Promise<string | null>
    getAttribute(name: string): Promise<string | null>
    $(selector: string): Promise<ElementHandle | null>
    $$(selector: string): Promise<ElementHandle[]>
  }

  export const chromium: {
    launch(options?: {
      executablePath?: string
      args?: string[]
      headless?: boolean | 'shell'
    }): Promise<Browser>
  }
}
