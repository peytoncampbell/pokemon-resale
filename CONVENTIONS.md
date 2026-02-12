# Pokemon Resale Conventions

## Stack
- Next.js 16 + React 19 + TypeScript + Tailwind CSS
- Supabase (auth + database)
- Deployed on Vercel (Hobby plan), root dir: `apps/web`
- Card data: TCGPlayer internal API (scraper, not official API)

## Critical Rules

### Auth
- All API routes use `verifyApiAuth()` from `@/lib/api-auth`
- Auth checks Supabase token via Authorization header or cookies
- Never skip auth on data-mutating endpoints

### External APIs
- TCGPlayer can be slow/block Vercel IPs — always use `fetchWithTimeout`
- Default timeout: 10s (`TIMEOUTS.DEFAULT`), scraping: 30s max
- React-query: `retry: 1` on card search hooks (don't retry 3x on slow APIs)
- Always show error states — never leave a frozen spinner

### Pricing
- TCGPlayer prices are in USD — stored as-is
- Currency conversion handled by `CurrencyProvider` at display time only
- Never convert currencies during storage or API responses

### Components
- Use `'use client'` for interactive components
- Virtualize lists >20 items with `react-window`
- Reusable Dialog uses native `<dialog>` element
- Handle loading + error + empty states in every data component
