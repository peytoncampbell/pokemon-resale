// TCGPlayer Scraper using Playwright
// Scrapes card pricing directly from TCGPlayer search results

import type { GameType } from './types'

// TCGPlayer game URL segments
export const TCGPLAYER_GAMES: Record<GameType, string> = {
  pokemon: 'pokemon',
  onepiece: 'one-piece-card-game',
}

// Card data scraped from TCGPlayer
export interface TCGPlayerCard {
  productId: string
  name: string
  setName: string
  number: string | null
  rarity: string | null
  imageUrl: string
  marketPrice: number | null
  lowPrice: number | null
  productUrl: string
}

// Search options
export interface TCGPlayerSearchOptions {
  query?: string
  setName?: string
  gameType: GameType
  page?: number
  productType?: 'Cards' | 'Sealed Products'
}

/**
 * Build TCGPlayer search URL
 */
export function buildTCGPlayerUrl(options: TCGPlayerSearchOptions): string {
  const game = TCGPLAYER_GAMES[options.gameType]
  const base = `https://www.tcgplayer.com/search/${game}/product`
  const url = new URL(base)

  url.searchParams.set('productLineName', game)
  url.searchParams.set('view', 'grid')
  url.searchParams.set('ProductTypeName', options.productType || 'Cards')

  if (options.query) {
    url.searchParams.set('q', options.query)
  }

  if (options.setName) {
    url.searchParams.set('setName', options.setName)
  }

  if (options.page && options.page > 1) {
    url.searchParams.set('page', String(options.page))
  }

  return url.toString()
}

/**
 * Parse card data from TCGPlayer page
 * This runs in the browser context via Playwright
 * Updated with flexible selectors that discover the DOM structure
 */
export function getParseScript(): string {
  return `
    (() => {
      const cards = [];

      // Try multiple selector patterns for product cards
      const selectors = [
        '[data-testid="search-result"]',
        '.search-result',
        '[class*="product-card"]',
        '[class*="ProductCard"]',
        'article[class*="product"]',
        '.listing-item',
        '[data-testid*="product"]',
      ];

      let productCards = [];
      for (const sel of selectors) {
        const found = document.querySelectorAll(sel);
        if (found.length > 0) {
          productCards = Array.from(found);
          console.log('Found ' + found.length + ' products with selector: ' + sel);
          break;
        }
      }

      // If no products found, try finding any links to /product/
      if (productCards.length === 0) {
        const productLinks = document.querySelectorAll('a[href*="/product/"]');
        console.log('Found ' + productLinks.length + ' product links');

        // Get unique parent containers
        const seen = new Set();
        productLinks.forEach(link => {
          // Walk up to find a reasonable container (3-5 levels up)
          let container = link.parentElement;
          for (let i = 0; i < 4 && container; i++) {
            container = container.parentElement;
          }
          if (container && !seen.has(container)) {
            seen.add(container);
            productCards.push(container);
          }
        });
      }

      productCards.forEach(card => {
        try {
          // Product ID from any link containing /product/
          const link = card.querySelector('a[href*="/product/"]');
          const href = link?.getAttribute('href') || '';
          const productIdMatch = href.match(/\\/product\\/(\\d+)/);
          const productId = productIdMatch ? productIdMatch[1] : null;

          if (!productId) return;

          // Find name - try multiple approaches
          let name = '';
          const nameSelectors = [
            '[data-testid*="title"]',
            '[class*="title"]',
            '[class*="Title"]',
            '[class*="name"]',
            '[class*="Name"]',
            'h2', 'h3', 'h4',
            '.product-card__title',
          ];
          for (const sel of nameSelectors) {
            const el = card.querySelector(sel);
            if (el?.textContent?.trim()) {
              name = el.textContent.trim();
              break;
            }
          }

          // If still no name, use link text
          if (!name && link) {
            name = link.textContent?.trim() || '';
          }

          // Find set name
          let setName = '';
          const setSelectors = [
            '[data-testid*="set"]',
            '[class*="set-name"]',
            '[class*="setName"]',
            '[class*="Set"]',
            '.product-card__set',
          ];
          for (const sel of setSelectors) {
            const el = card.querySelector(sel);
            if (el?.textContent?.trim()) {
              setName = el.textContent.trim();
              break;
            }
          }

          // Find image
          let imageUrl = '';
          const img = card.querySelector('img[src*="tcgplayer"], img[src*="product"]');
          if (img) {
            imageUrl = img.getAttribute('src') || '';
          }

          // Find prices - look for dollar amounts
          const cardText = card.textContent || '';
          const priceMatches = cardText.match(/\\$([\\d,]+\\.\\d{2})/g) || [];
          const prices = priceMatches.map(p => parseFloat(p.replace(/[\\$,]/g, ''))).filter(p => p > 0);

          // Market price is usually labeled, low price is usually the listing price
          let marketPrice = null;
          let lowPrice = null;

          // Look for specific price labels
          const marketEl = card.querySelector('[class*="market"], [data-testid*="market"]');
          if (marketEl) {
            const match = marketEl.textContent?.match(/\\$([\\d,]+\\.\\d{2})/);
            if (match) marketPrice = parseFloat(match[1].replace(',', ''));
          }

          // If we have prices but no market price identified
          if (prices.length > 0) {
            if (!marketPrice) marketPrice = prices[0];
            if (prices.length > 1) lowPrice = Math.min(...prices);
          }

          // Card number from name
          const numberMatch = name.match(/\\((\\d+\\/\\d+)\\)/) || name.match(/-\\s*(\\d+)\\s*$/);
          const number = numberMatch ? numberMatch[1] : null;

          if (name) {
            cards.push({
              productId,
              name: name.replace(/\\s*\\(\\d+\\/\\d+\\)/, '').trim(),
              setName,
              number,
              rarity: null,
              imageUrl,
              marketPrice,
              lowPrice,
              productUrl: 'https://www.tcgplayer.com' + href
            });
          }
        } catch (e) {
          console.error('Error parsing card:', e);
        }
      });

      return { cards, debug: { foundProducts: productCards.length, url: window.location.href } };
    })()
  `;
}

/**
 * Check if we're running in a serverless environment
 */
export function isServerless(): boolean {
  return !!(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL || process.env.NETLIFY)
}

/**
 * Get browser instance for scraping
 */
export async function getBrowser() {
  if (isServerless()) {
    // Use @sparticuz/chromium for serverless
    // @ts-ignore - dynamic import with webpackIgnore
    const chromium = await import(/* webpackIgnore: true */ '@sparticuz/chromium')
    // @ts-ignore - dynamic import with webpackIgnore
    const { chromium: playwright } = await import(/* webpackIgnore: true */ 'playwright-core')

    const browser = await playwright.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    })
    return browser
  } else {
    // Local development - use regular playwright
    // @ts-ignore - dynamic import with webpackIgnore
    const { chromium } = await import(/* webpackIgnore: true */ 'playwright-core')

    // Try to find local Chrome/Chromium installation
    const possiblePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
    ]

    let executablePath: string | undefined
    const fs = await import('fs')
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        executablePath = path
        break
      }
    }

    const browser = await chromium.launch({
      headless: true,
      executablePath,
    })
    return browser
  }
}

/**
 * Scrape TCGPlayer search results
 */
export async function scrapeTCGPlayer(
  options: TCGPlayerSearchOptions & { debug?: boolean }
): Promise<TCGPlayerCard[]> {
  const url = buildTCGPlayerUrl(options)
  let browser = null

  try {
    browser = await getBrowser()
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    })

    const page = await context.newPage()

    // Navigate to search page - use domcontentloaded for faster initial load
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // Wait for the page to be interactive and products to load
    // TCGPlayer loads products dynamically
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})

    // Try multiple selectors for product cards
    const productSelectors = [
      '[data-testid="search-result"]',
      '.search-result',
      '[class*="product-card"]',
      'a[href*="/product/"]',
    ]

    let found = false
    for (const selector of productSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 })
        found = true
        console.log(`Found products with selector: ${selector}`)
        break
      } catch {
        // Try next selector
      }
    }

    if (!found) {
      console.log('No product selectors matched, waiting for any content...')
      await page.waitForTimeout(3000)
    }

    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(1000)

    // Save debug screenshot if requested
    if (options.debug) {
      const fs = await import('fs')
      const path = await import('path')
      const debugDir = path.join(process.cwd(), 'debug')
      if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir, { recursive: true })
      await page.screenshot({ path: path.join(debugDir, 'tcgplayer-debug.png'), fullPage: true })
      const html = await page.content()
      fs.writeFileSync(path.join(debugDir, 'tcgplayer-debug.html'), html)
      console.log('Debug files saved to ./debug/')
    }

    // Extract card data
    const result = await page.evaluate(getParseScript()) as { cards: TCGPlayerCard[], debug: unknown }

    console.log('Scrape result:', JSON.stringify(result.debug))

    await context.close()
    return result.cards

  } catch (error) {
    console.error('TCGPlayer scrape error:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Scrape a specific set from TCGPlayer
 */
export async function scrapeSet(
  gameType: GameType,
  setName: string
): Promise<TCGPlayerCard[]> {
  return scrapeTCGPlayer({
    gameType,
    setName,
    productType: 'Cards',
  })
}

/**
 * Search for cards by name
 */
export async function searchCards(
  gameType: GameType,
  query: string
): Promise<TCGPlayerCard[]> {
  return scrapeTCGPlayer({
    gameType,
    query,
    productType: 'Cards',
  })
}
