# Pokemon Resale Project

A TCG inventory management application for tracking Pokemon and One Piece cards.

## Tech Stack
- Next.js (App Router)
- Supabase (Auth + Database)
- React Query for data fetching
- Tailwind CSS

## JustTCG API Reference

Base URL: `https://api.justtcg.com/v1`
Proxy: `/api/justtcg` (keeps API key server-side)

### Authentication
Header: `x-api-key: tcg_your_api_key_here`
Environment variable: `JUSTTCG_API_KEY`

### Game IDs
| Game | ID |
|------|-----|
| Pokemon | `pokemon` |
| One Piece | `one-piece-card-game` |
| Magic: The Gathering | `magic-the-gathering` |
| Yu-Gi-Oh! | `yu-gi-oh` |
| Disney Lorcana | `disney-lorcana` |
| Digimon | `digimon` |

### Endpoints

#### GET /games
Returns list of all supported TCGs with metadata.

#### GET /sets
Query params:
- `q` - Search query
- `game` - Game ID (required)
- `orderBy` - `name` or `release_date`
- `order` - `asc` or `desc`

#### GET /cards
Query params:
- **Identifiers**: `tcgplayerId`, `cardId`, `mtgjsonId`, `scryfallId`, `tcgplayerSkuId`
- **Filters**:
  - `q` - Search query
  - `game` - Game ID
  - `set` - Set ID
  - `printing` - Card printing type
  - `condition` - `S` (Sealed), `NM`, `LP`, `MP`, `HP`, `DMG`
  - `limit` - Results limit
- **Options**:
  - `include_price_history` - `true`/`false`
  - `include_statistics` - `true`/`false`
  - `priceHistoryDuration` - `7d`, `30d`, `90d`, `180d`

#### POST /cards (Batch)
Request body: Array of card query objects
Max items: 200 (Enterprise), 100 (Starter/Pro), 20 (Free)

### Response Format
```json
{
  "data": [/* Card/Set objects */],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "error": null
}
```

### Card Object
```json
{
  "id": "pokemon-sv08-charizard-ex-rare",
  "name": "Charizard ex",
  "game": "pokemon",
  "set": "sv08",
  "set_name": "Surging Sparks",
  "number": "123",
  "rarity": "Double Rare",
  "tcgplayerId": "12345",
  "details": null,
  "variants": [/* Variant objects */]
}
```

### Variant Object
```json
{
  "id": "pokemon-sv08-charizard-ex-rare_NM_Normal",
  "condition": "Near Mint",
  "printing": "Normal",
  "language": "English",
  "price": 45.99,
  "lastUpdated": 1706400000,
  "priceChange7d": -2.50,
  "priceChange30d": 5.00,
  "avgPrice": 44.50,
  "minPrice": 40.00,
  "maxPrice": 52.00
}
```

### Condition Codes
- `S` - Sealed (for sealed products)
- `NM` - Near Mint
- `LP` - Lightly Played
- `MP` - Moderately Played
- `HP` - Heavily Played
- `DMG` - Damaged

### Rate Limits
| Plan | Monthly | Daily | Per Minute |
|------|---------|-------|------------|
| Free | 1,000 | 100 | 10 |
| Starter | 10,000 | 1,000 | 50 |
| Pro | 50,000 | 5,000 | 100 |
| Enterprise | 500,000 | 50,000 | 500 |

### Error Codes
- `MISSING_API_KEY` - No API key provided
- `INVALID_API_KEY` - Invalid API key
- `RATE_LIMIT_EXCEEDED` - Per-minute limit hit
- `DAILY_LIMIT_EXCEEDED` - Daily limit hit
- `REQUEST_LIMIT_EXCEEDED` - Monthly limit hit

## Database Schema

Key tables:
- `inventory` - Card/sealed product inventory with `product_type` ('card' | 'sealed')
- `transactions` - Buy/sell/trade transactions
- `transaction_items` - Items in each transaction
- `organizations` - Multi-tenant organization support
- `procurements` - Purchase orders tracking

## Project Structure
```
apps/web/src/
  lib/
    card-api.ts      - Unified card API (uses JustTCG)
    justtcg-api.ts   - JustTCG API client
    card-types.ts    - TypeScript types (UnifiedCard, GameType, ProductType)
    supabase.ts      - Supabase client and DB types
  hooks/
    use-inventory.ts - Inventory CRUD hooks
  components/
    inventory/       - Inventory management UI
```
