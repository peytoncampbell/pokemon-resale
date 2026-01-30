import { NextRequest, NextResponse } from 'next/server'
import type { GameType, SealedProduct, SealedType } from '@/lib/tcg/types'
import { detectSealedType } from '@/lib/tcg/types'
import { generateCacheKey, tcgCache } from '@/lib/tcg/cache'
import { verifyApiAuth } from '@/lib/api-auth'

// Maximum allowed limit to prevent DoS
const MAX_LIMIT = 100

// PriceCharting URLs for sealed products
const PRICECHARTING_URLS = {
  pokemon: 'https://www.pricecharting.com/search-products?q=pokemon+booster+box&type=prices',
  pokemonEtb: 'https://www.pricecharting.com/search-products?q=pokemon+elite+trainer+box&type=prices',
  pokemonTin: 'https://www.pricecharting.com/search-products?q=pokemon+tin&type=prices',
  onepiece: 'https://www.pricecharting.com/search-products?q=one+piece+card+game+booster&type=prices',
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
]

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

interface ScrapedProduct {
  name: string
  price: number | null
  imageUrl: string
  url: string
}

/**
 * Parse PriceCharting search results HTML
 * Structure: <tr id="product-{id}"> with nested td elements for title, console, price
 */
function parsePriceChartingResults(html: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []

  // Match product rows: <tr id="product-XXXXX">...</tr>
  const rowRegex = /<tr\s+id="product-(\d+)"[^>]*>([\s\S]*?)<\/tr>/gi
  const rows = Array.from(html.matchAll(rowRegex))

  for (const [, productId, rowContent] of rows) {
    // Extract product name from title cell
    // Pattern: <td class="title">...<a href="...">Product Name</a>...
    const titleMatch = rowContent.match(/<td[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>\s*([^<]+?)\s*<\/a>/i)

    if (!titleMatch) continue

    const url = titleMatch[1].startsWith('http') ? titleMatch[1] : `https://www.pricecharting.com${titleMatch[1]}`
    const productName = titleMatch[2].trim()

    // Extract set/console name from console-in-title or console cell
    const setMatch = rowContent.match(/class="console-in-title"[\s\S]*?<a[^>]*>\s*([^<]+?)\s*<\/a>/i)
      || rowContent.match(/<td[^>]*class="[^"]*console[^"]*"[^>]*>[\s\S]*?<a[^>]*>\s*([^<]+?)\s*<\/a>/i)
    const setName = setMatch ? setMatch[1].trim() : ''

    // Build full product name
    const fullName = setName ? `${setName} - ${productName}` : productName

    // Extract price from used_price cell (main price column)
    const priceMatch = rowContent.match(/<td[^>]*class="[^"]*used_price[^"]*"[^>]*>[\s\S]*?<span[^>]*class="js-price"[^>]*>\s*\$([0-9,]+\.?\d*)/i)
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null

    // Extract image URL
    const imgMatch = rowContent.match(/<img[^>]*class="photo"[^>]*src="([^"]+)"/i)
      || rowContent.match(/src="(https:\/\/storage\.googleapis\.com\/images\.pricecharting\.com[^"]+)"/i)
    const imageUrl = imgMatch?.[1] || '/card-placeholder.png'

    // Only include if has a valid name and price
    if (fullName && price && price > 0) {
      products.push({
        name: fullName,
        price,
        imageUrl,
        url,
      })
    }
  }

  return products
}

/**
 * Fetch and parse PriceCharting sealed products
 */
async function scrapePriceCharting(
  gameType: GameType,
  searchQuery?: string
): Promise<ScrapedProduct[]> {
  // Build search URL
  let url: string
  if (searchQuery) {
    const query = encodeURIComponent(`${gameType === 'pokemon' ? 'pokemon' : 'one piece card game'} ${searchQuery}`)
    url = `https://www.pricecharting.com/search-products?q=${query}&type=prices`
  } else {
    url = gameType === 'pokemon' ? PRICECHARTING_URLS.pokemon : PRICECHARTING_URLS.onepiece
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
    })

    if (!response.ok) {
      console.error('PriceCharting fetch error:', response.status)
      return []
    }

    const html = await response.text()
    return parsePriceChartingResults(html)
  } catch (error) {
    console.error('PriceCharting scrape error:', error)
    return []
  }
}

/**
 * Transform scraped product to SealedProduct
 */
function toSealedProduct(scraped: ScrapedProduct, gameType: GameType): SealedProduct {
  // Generate a stable ID from the name
  const id = `pricecharting-${scraped.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`

  return {
    id,
    name: scraped.name,
    gameType,
    productType: 'sealed',
    setName: extractSetName(scraped.name),
    imageUrl: scraped.imageUrl.startsWith('http') ? scraped.imageUrl : '/card-placeholder.png',
    prices: {
      market: scraped.price,
      low: null,
      high: null,
    },
    source: 'tcgplayer', // PriceCharting aggregates from TCGPlayer
    lastUpdated: new Date(),
    sealedType: detectSealedType(scraped.name),
  }
}

/**
 * Extract set name from product name
 */
function extractSetName(name: string): string {
  // Common patterns: "Pokemon [Set Name] - Booster Box"
  const match = name.match(/Pokemon\s+(.+?)\s*[-–]\s*(Booster|Elite|ETB|Tin|Collection)/i)
  if (match) return match[1].trim()

  // One Piece pattern
  const opMatch = name.match(/One Piece[^-]*[-–]\s*(.+?)\s*(Booster|Box)/i)
  if (opMatch) return opMatch[1].trim()

  return 'Unknown Set'
}

/**
 * Get a variety of sealed products for the "recent" view
 */
async function getVarietyProducts(gameType: GameType): Promise<SealedProduct[]> {
  const allProducts: SealedProduct[] = []
  const seenNames = new Set<string>()

  // Fetch from multiple categories for variety
  const searches = gameType === 'pokemon'
    ? ['booster box', 'elite trainer box', 'collection box']
    : ['booster box']

  for (const search of searches) {
    const scraped = await scrapePriceCharting(gameType, search)

    for (const product of scraped) {
      const normalized = product.name.toLowerCase()
      if (!seenNames.has(normalized)) {
        seenNames.add(normalized)
        allProducts.push(toSealedProduct(product, gameType))
      }
    }

    // Rate limit between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Sort by price (highest first for premium items)
  return allProducts.sort((a, b) => (b.prices.market || 0) - (a.prices.market || 0))
}

// Fallback mock data when scraping fails
function getMockSealedProducts(gameType: GameType): SealedProduct[] {
  if (gameType === 'pokemon') {
    return [
      {
        id: 'mock-surging-sparks-bb',
        name: 'Pokemon Surging Sparks - Booster Box',
        gameType: 'pokemon',
        productType: 'sealed',
        setName: 'Surging Sparks',
        imageUrl: 'https://www.pricecharting.com/images/box-art/pokemon-surging-sparks-booster-box.jpg',
        prices: { market: 143.99, low: 139.99, high: null },
        source: 'tcgplayer',
        lastUpdated: new Date(),
        sealedType: 'booster-box',
      },
      {
        id: 'mock-prismatic-evo-bb',
        name: 'Pokemon Prismatic Evolutions - Booster Box',
        gameType: 'pokemon',
        productType: 'sealed',
        setName: 'Prismatic Evolutions',
        imageUrl: 'https://www.pricecharting.com/images/box-art/pokemon-prismatic-evolutions-booster-box.jpg',
        prices: { market: 289.99, low: 269.99, high: null },
        source: 'tcgplayer',
        lastUpdated: new Date(),
        sealedType: 'booster-box',
      },
      {
        id: 'mock-surging-sparks-etb',
        name: 'Pokemon Surging Sparks - Elite Trainer Box',
        gameType: 'pokemon',
        productType: 'sealed',
        setName: 'Surging Sparks',
        imageUrl: 'https://www.pricecharting.com/images/box-art/pokemon-surging-sparks-etb.jpg',
        prices: { market: 44.99, low: 39.99, high: null },
        source: 'tcgplayer',
        lastUpdated: new Date(),
        sealedType: 'etb',
      },
      {
        id: 'mock-twilight-bb',
        name: 'Pokemon Twilight Masquerade - Booster Box',
        gameType: 'pokemon',
        productType: 'sealed',
        setName: 'Twilight Masquerade',
        imageUrl: 'https://www.pricecharting.com/images/box-art/pokemon-twilight-masquerade-booster-box.jpg',
        prices: { market: 119.99, low: 109.99, high: null },
        source: 'tcgplayer',
        lastUpdated: new Date(),
        sealedType: 'booster-box',
      },
      {
        id: 'mock-paldea-bb',
        name: 'Pokemon Paldea Evolved - Booster Box',
        gameType: 'pokemon',
        productType: 'sealed',
        setName: 'Paldea Evolved',
        imageUrl: 'https://www.pricecharting.com/images/box-art/pokemon-paldea-evolved-booster-box.jpg',
        prices: { market: 139.99, low: 129.99, high: null },
        source: 'tcgplayer',
        lastUpdated: new Date(),
        sealedType: 'booster-box',
      },
      {
        id: 'mock-151-bb',
        name: 'Pokemon 151 - Booster Box',
        gameType: 'pokemon',
        productType: 'sealed',
        setName: '151',
        imageUrl: 'https://www.pricecharting.com/images/box-art/pokemon-151-booster-box.jpg',
        prices: { market: 159.99, low: 149.99, high: null },
        source: 'tcgplayer',
        lastUpdated: new Date(),
        sealedType: 'booster-box',
      },
    ]
  }

  return [
    {
      id: 'mock-op08-bb',
      name: 'One Piece Card Game - OP-08 Two Legends Booster Box',
      gameType: 'onepiece',
      productType: 'sealed',
      setName: 'Two Legends',
      imageUrl: '/card-placeholder.png',
      prices: { market: 109.99, low: 99.99, high: null },
      source: 'tcgplayer',
      lastUpdated: new Date(),
      sealedType: 'booster-box',
    },
  ]
}

export async function GET(request: NextRequest) {
  // Authentication check
  const user = await verifyApiAuth()
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const gameType = (searchParams.get('game') || 'pokemon') as GameType
  const search = searchParams.get('search') || undefined
  const sealedType = searchParams.get('type') as SealedType | undefined
  const rawLimit = parseInt(searchParams.get('limit') || '20', 10)
  const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT) // Bound between 1 and MAX_LIMIT
  const useMock = searchParams.get('mock') === 'true'

  // Validate game type
  if (gameType !== 'pokemon' && gameType !== 'onepiece') {
    return NextResponse.json(
      { error: 'Invalid game type. Must be "pokemon" or "onepiece"' },
      { status: 400 }
    )
  }

  try {
    // Check cache first
    const cacheKey = generateCacheKey(
      'sealed',
      gameType,
      `search:${search || 'recent'}:${sealedType || 'all'}`
    )

    const cached = await tcgCache.get<SealedProduct[]>(cacheKey)
    if (cached) {
      let data = cached.data

      // Apply type filter
      if (sealedType) {
        data = data.filter(p => p.sealedType === sealedType)
      }

      return NextResponse.json({
        data: data.slice(0, limit),
        meta: {
          total: data.length,
          limit,
          offset: 0,
          hasMore: data.length > limit,
        },
        cached: true,
        cacheExpires: cached.expiresAt,
      })
    }

    let products: SealedProduct[]

    if (useMock) {
      products = getMockSealedProducts(gameType)
    } else {
      // Scrape PriceCharting
      if (search) {
        const scraped = await scrapePriceCharting(gameType, search)
        products = scraped.map(s => toSealedProduct(s, gameType))
      } else {
        products = await getVarietyProducts(gameType)
      }

      // Fall back to mock data if scraping fails
      if (products.length === 0) {
        console.warn('Scraping returned no results, using mock data')
        products = getMockSealedProducts(gameType)
      }
    }

    // Filter by sealed type if specified
    if (sealedType) {
      products = products.filter(p => p.sealedType === sealedType)
    }

    // Cache the results (1 hour for sealed products)
    await tcgCache.set(cacheKey, products, {
      productType: 'sealed',
      gameType,
      source: 'tcgplayer',
    })

    const data = products.slice(0, limit)

    return NextResponse.json({
      data,
      meta: {
        total: products.length,
        limit,
        offset: 0,
        hasMore: products.length > limit,
      },
      cached: false,
    })
  } catch (error) {
    console.error('Sealed products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sealed products' },
      { status: 500 }
    )
  }
}
