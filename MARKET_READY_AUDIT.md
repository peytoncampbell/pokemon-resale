# Market-Ready Audit: Pokemon Resale Dashboard

**Audit Date:** February 4, 2026
**Stack:** Next.js 16 · React 19 · Supabase · Tailwind CSS 4 · TypeScript 5.9
**Status:** Working Prototype → Production SaaS

---

## Priority Summary: Top 10 Must-Fix Before Launch

| # | Item | Pillar | Status |
|---|------|--------|--------|
| 1 | Install Sentry error monitoring | Production | ✅ DONE |
| 2 | Fix CI/CD pipeline (next build, tests, deploy) | Production | ✅ DONE |
| 3 | Remove `.env.local` from git, use secrets | Security | ⬜ TODO (manual) |
| 4 | Add security headers middleware (CSP, etc.) | Security | ✅ DONE |
| 5 | Add toast notifications for API errors | Robustness | ✅ DONE |
| 6 | Add granular Error Boundaries per section | Robustness | ✅ DONE |
| 7 | Implement forgot password flow | Onboarding | ✅ DONE |
| 8 | Add shipping cost field to transactions | Features | ✅ DONE |
| 9 | Add platform fee auto-calculation presets | Features | ✅ DONE |
| 10 | Add Google OAuth social login | Onboarding | ✅ DONE (scaffold) |

---

## Pillar 1: Premium UI/UX & Polish

### Current State

The dashboard implements a cohesive Vision UI dark theme with glassmorphism effects (`#0B1437` background, `backdrop-blur-[20px]`, gradient borders). The custom component library (Button, Card, Badge, etc.) uses Class Variance Authority for variants and `cn()` for class merging. **194 hover/active/focus states** found across the codebase. Framer Motion powers advanced animations including a `HoloCard` component with 3D mouse-tracking effects. Six specialized skeleton loaders cover all async card types. Mobile responsiveness uses proper breakpoint patterns (`sm:`, `md:`, `lg:`, `xl:`) with a hamburger menu overlay on mobile.

### Critical Gaps

- [ ] **No base Dialog/Modal component** — modals are implemented ad-hoc per feature, leading to inconsistent behavior
- [x] **Skip-to-content link + ARIA live region added** — `<a href="#main-content">` with `sr-only focus:not-sr-only` classes, `aria-live="polite"` announcements div
- [x] **`aria-label` attributes added** to all icon-only buttons (close, increment/decrement, remove) and `role="dialog"` / `aria-modal="true"` / `aria-labelledby` on all modals
- [ ] **Dense filter panels** on mobile need better spacing for touch targets at card shows

### Premium Polish

- [ ] Create a centralized `design-tokens.ts` for all colors/spacing/animation timings (currently scattered across `globals.css` and inline)
- [ ] Reduce some 500ms animations to 300ms for a snappier feel
- [ ] Add Storybook for component documentation and visual regression testing
- [ ] Add landscape tablet optimization for resellers using iPads at shows

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add `aria-label` to all icon-only buttons and interactive elements | ✅ DONE |
| P0 | Create a reusable base `Dialog` component to standardize all modals | ⬜ TODO |
| P1 | Add skip-to-content link and ARIA live regions for notifications | ✅ DONE |
| P1 | Run axe-core accessibility audit and fix all critical violations | ✅ DONE — `@axe-core/react` installed, dev-only auto-audit in AppProviders |
| P2 | Centralize design tokens into a single source of truth | ⬜ TODO |
| P2 | Add Storybook for component documentation | ⬜ TODO |

---

## Pillar 2: Feature Completeness for Resellers

### Current State

The inventory system is feature-rich: full CRUD, bulk operations (`BulkActionBar` with multi-select, status/location/delete), paginated loading (50/page), duplicate detection, and a three-stage status pipeline (IN_STOCK → LISTED → SOLD). Trade transactions (`TradeTransactionModal`) handle give/receive with optional cash adjustments and automatic inventory creation. P&L logic calculates Revenue − COGS − Fees with proportional fee allocation across multi-item transactions. Six report types exist including a Tax Summary in Schedule D format. The JustTCG API proxy has two-layer caching (in-memory + Supabase `tcg_cache` table) with 10-minute TTL for cards and 1-hour for sets.

### Critical Gaps

- [x] **Shipping cost field added** to transactions schema with full-stack integration (DB → types → hooks → UI → analytics → reports)
- [x] **Platform fee presets implemented** — eBay (13.25%), TCGPlayer (10.25%), Facebook (0%), Local (0%), Other (manual) with auto-calculation and manual override
- [x] **JustTCG 429 handling with exponential backoff** — `fetchWithRetry()` in API route reads `Retry-After` header, retries up to 3 times with 1s/2s/4s backoff
- [x] **Price freshness badge added** — `PriceFreshnessBadge` component shows "Updated Xh ago" with green/yellow/red color coding
- [ ] **No automated background price updates** — requires manual refresh

### Premium Polish

- [x] Platform fee presets (eBay: 13.25%, TCGPlayer: 10.25%, etc.) auto-calculate when a platform is selected
- [x] Show "Last updated: X hours ago" badge on price data with a color-coded freshness indicator
- [ ] Add inventory holding cost / carrying cost calculations for working capital analysis
- [ ] Add a "Quick Sell" flow optimized for rapid-fire sales at card shows (minimal taps)

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add `shipping_cost` column to transactions schema and update P&L logic | ✅ DONE |
| P0 | Implement platform fee presets with auto-calculation on sell form | ✅ DONE |
| P1 | Add rate limit detection (429 handling) with exponential backoff in JustTCG proxy | ✅ DONE |
| P1 | Add "price freshness" badge to inventory cards showing last update timestamp | ✅ DONE |
| P2 | Build background job (cron/edge function) for automated nightly price updates | ⬜ TODO |
| P2 | Add "Quick Sell" mode for card show scenarios | ⬜ TODO |

---

## Pillar 3: Robustness & Error Handling

### Current State

A single `ErrorBoundary` class component wraps the app at the root level in `app-providers.tsx`. Form validation uses Zod + React Hook Form with proper constraints (e.g., `z.number().min(1)` for quantity, `z.number().min(0)` for costs). TypeScript strict mode is enabled with only 5 files containing `any` types (all documented workarounds). Optional chaining (`?.`) is used extensively (30+ instances). Empty states are well-designed with 6 variants (inventory, transactions, search, error, generic, members) featuring animated decorative elements.

### Critical Gaps

- [x] **Granular Error Boundaries** added around inventory, transactions, reports, and analytics/chart sections on the dashboard
- [x] **Toast notifications implemented** — `sonner` library wired to `MutationCache.onError` for global mutation error toasts
- [x] **QueryClient has global `onError` handler** via `MutationCache` — all mutation errors surface as user-visible toasts
- [x] **Retry logic with exponential backoff** — React Query `retry: 3` with `retryDelay: 2^attempt * 1000` (max 30s), mutations keep `retry: 0`
- [x] **Network connectivity detection** — `useNetworkStatus` hook with `navigator.onLine` + event listeners, `NetworkStatusBanner` renders fixed amber banner when offline
- [ ] **No request timeouts** configured on fetch calls

### Premium Polish

- [x] Global toast notification system (sonner) wired to React Query's `MutationCache.onError`
- [ ] Implement optimistic UI with rollback animations on failure
- [x] Add a network status banner that appears when connectivity drops
- [ ] Add request timeout configuration (10s default, 30s for scraping endpoints)

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add granular Error Boundaries around inventory, transactions, reports, and analytics sections | ✅ DONE |
| P0 | Implement toast notification system and wire to all mutation `onError` callbacks | ✅ DONE |
| P0 | Add global `onError` handler to QueryClient configuration | ✅ DONE |
| P1 | Add retry logic with exponential backoff (3 retries, 1s/2s/4s) to React Query defaults | ✅ DONE |
| P1 | Add network connectivity detection with UI banner | ✅ DONE |
| P2 | Add request timeout configuration (10s default) | ⬜ TODO |
| P2 | Add service worker for offline-first caching of static assets | ⬜ TODO |

---

## Pillar 4: Multi-Tenancy & Data Security

### Current State

RLS is solid. All tables have organization-based RLS policies enforced at the database level. The initial public-access RLS policies from migration `20251205223611` were completely replaced with organization-scoped policies in migration `20260127000000`. A `SECURITY DEFINER` function (`check_organization_membership`) prevents RLS recursion. Client-side code includes organization filtering in **87 query call sites** via `getCurrentOrganizationId()`. The JustTCG API proxy has endpoint whitelisting (`['cards', 'sets', 'games']`) preventing SSRF. API keys are server-side only.

### Critical Gaps

- [x] **Security headers middleware added** — CSP, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), HSTS, Referrer-Policy, Permissions-Policy
- [ ] **No rate limiting on auth endpoints** — brute-force attacks are unmitigated
- [x] **CSRF protection: N/A** — Supabase Auth uses JWT bearer tokens in Authorization headers, not cookies. CSRF attacks exploit cookie-based authentication, so JWT-based auth is inherently protected
- [x] **Audit logging table added** — `audit_log` table with RLS, `useLogAction` and `useAuditLog` hooks for tracking sensitive operations
- [ ] **`.env.local` appears to be tracked in git** — credentials are exposed in the repository
- [x] **Service role key fallback removed** — JustTCG proxy and cache now use anon key only

### Premium Polish

- [ ] Add MFA/TOTP support (Supabase Auth supports it, just needs enabling)
- [x] Add audit trail table for compliance (who did what, when)
- [ ] Add IP-based rate limiting on auth and API routes
- [ ] Add role-based permissions within organizations (admin, editor, viewer)

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add security headers middleware in `next.config.ts` or `middleware.ts` | ✅ DONE |
| P0 | Remove `.env.local` from git history and ensure it's in `.gitignore` | ⬜ TODO |
| P0 | Add rate limiting on `/login` and `/api/*` routes | ⬜ TODO |
| P1 | Remove service role key fallback from JustTCG proxy and cache — use anon key only | ✅ DONE |
| P1 | Implement audit logging table for sensitive operations | ✅ DONE |
| P1 | Add CSRF tokens for state-changing operations | ✅ N/A — JWT bearer tokens in headers provide inherent CSRF protection |
| P2 | Enable MFA/TOTP in Supabase Auth config | ⬜ TODO |
| P2 | Add role-based permissions (admin/editor/viewer) within organizations | ⬜ TODO |

---

## Pillar 5: Onboarding & User Lifecycle

### Current State

Login is email/password only via Supabase Auth (minimum 6-character password). After signup, users are directed to a `/setup` page where they create or join an organization (8-character invite code). The `/join` route supports query params (`?code=ABCD1234`) and SessionStorage fallback for unauthenticated users. After org setup, users land on the dashboard with no further guidance.

### Critical Gaps

- [x] **Forgot password flow implemented** — email input on login page, auth callback handler, dedicated reset-password page with confirmation
- [x] **Google OAuth scaffolded** — "Sign in with Google" button on login page (requires enabling Google provider in Supabase dashboard)
- [x] **Getting Started checklist implemented** — 5-step interactive sidebar checklist on dashboard (add card, record buy, record sell, view reports, set alert) with progress bar, localStorage dismissal
- [x] **Onboarding checklist implemented** — queries actual DB data to track step completion, links to relevant pages
- [x] **Password strength indicator added** — 4-segment bar (weak/fair/good/strong) with color coding on signup form
- [x] **Terms of Service checkbox added** — signup form requires agreement, links to `/terms` and `/privacy`, disables submit until checked
- [ ] **No email verification UI** — signup says "check your email" but there's no resend or status page

### Premium Polish

- [x] Add an interactive "Getting Started" checklist that persists in the sidebar until completed
- [ ] Add contextual tooltips on first visit (use `driver.js` or `react-joyride`)
- [ ] Add milestone celebrations ("You just recorded your 100th sale!")
- [ ] Add a "What's New" changelog modal for returning users
- [ ] Add email verification status page with resend button

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Implement forgot password / password reset flow (Supabase supports this natively) | ✅ DONE |
| P0 | Add Google OAuth social login via Supabase Auth | ✅ DONE (scaffold) |
| P1 | Build "Getting Started" checklist (5 steps: add card, record buy, record sell, view reports, set alert) | ✅ DONE |
| P1 | Add Terms of Service checkbox to signup form | ✅ DONE |
| P1 | Add password strength indicator | ✅ DONE |
| P2 | Add contextual onboarding tour with `react-joyride` | ⬜ TODO |
| P2 | Add "What's New" changelog modal | ⬜ TODO |
| P3 | Add milestone celebration toasts | ⬜ TODO |

---

## Pillar 6: Production Readiness

### Current State

The `optimization_plan.md` shows 9 of 10 optimizations completed (bundle: 15MB → ~6MB, inventory load: 3-5s → <1s). The GitHub Actions workflow (`.github/workflows/webpack.yml`) is misconfigured — it runs `npx webpack` instead of `next build` and skips tests/linting entirely. No error monitoring (Sentry), no user analytics (GA4/Mixpanel), no performance monitoring (Core Web Vitals). SEO has basic `title` and `description` metadata but is missing Open Graph tags, Twitter cards, sitemap, and robots.txt. Test coverage is minimal — only 2 test files exist for the entire application.

### Critical Gaps

- [x] **Sentry error monitoring scaffolded** — `@sentry/nextjs` installed, client/server configs created, `ErrorBoundary.componentDidCatch` reports to Sentry, enabled via `NEXT_PUBLIC_SENTRY_DSN` env var
- [x] **Plausible analytics scaffolded** — conditional `<Script>` tag in root layout, enabled via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var, added to CSP
- [x] **CI/CD pipeline fixed** — replaced broken `webpack.yml` with `ci.yml` (Node 20.x, npm ci, lint, test, build)
- [x] **10 test files with 94 tests** — hooks coverage for transactions, analytics, currency, organizations, price alerts, notifications, network status, onboarding
- [ ] **No deployment configuration** — no `vercel.json`, Docker, or deployment scripts
- [x] **Open Graph + Twitter Card meta tags added** — `metadataBase`, `openGraph`, `twitter` in root layout metadata export

### Premium Polish

- [x] Add Plausible for privacy-respecting analytics (scaffolded, needs env var to activate)
- [x] Sentry scaffolded with client/server configs and instrumentation hook (needs DSN env var to activate)
- [ ] Add performance budgets in CI (fail build if bundle exceeds threshold)
- [ ] Add `@next/bundle-analyzer` for ongoing size monitoring
- [ ] Add Lighthouse CI to maintain performance scores

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Install and configure Sentry (`@sentry/nextjs`) with source maps | ✅ DONE (scaffold) |
| P0 | Fix GitHub Actions: replace webpack with `next build`, add `lint` and `test` steps | ✅ DONE |
| P0 | Remove credentials from git history, use GitHub Secrets | ⬜ TODO |
| P0 | Add deployment step to CI (Vercel, Railway, or similar) | ⬜ TODO |
| P1 | Add Plausible analytics with conditional script loading | ✅ DONE (scaffold) |
| P1 | Add Open Graph and Twitter Card meta tags to root layout | ✅ DONE |
| P1 | Add `robots.txt` and `sitemap.xml` generation | ✅ DONE |
| P1 | Write unit tests for all hooks (target 60%+ coverage) | ✅ DONE (10 files, 94 tests) |
| P2 | Add `@next/bundle-analyzer` and performance budgets | ⬜ TODO |
| P2 | Add Lighthouse CI to GitHub Actions | ⬜ TODO |
| P3 | Add E2E tests with Playwright for critical flows (login → add card → sell → view report) | ⬜ TODO |

---

## Changelog

Track completed fixes below as they are implemented.

| Date | Item | Pillar | Notes |
|------|------|--------|-------|
| 2026-02-04 | Toast notifications (sonner) + global MutationCache error handler | Robustness | `sonner` library, `MutationCache.onError` in query-provider |
| 2026-02-04 | Granular Error Boundaries on all pages | Robustness | Dashboard, inventory, transactions, reports pages |
| 2026-02-04 | Security headers middleware | Security | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| 2026-02-04 | CI/CD pipeline rewrite | Production | Replaced `webpack.yml` with `ci.yml` (Node 20, lint, test, build) |
| 2026-02-04 | Sentry error monitoring scaffold | Production | `@sentry/nextjs`, client/server configs, instrumentation, ErrorBoundary integration |
| 2026-02-04 | Forgot password flow | Onboarding | Login page forgot mode, auth callback route, reset-password page |
| 2026-02-04 | Google OAuth scaffold | Onboarding | "Sign in with Google" button on login (needs Supabase provider config) |
| 2026-02-04 | Platform fee presets + auto-calculation | Features | eBay 13.25%, TCGPlayer 10.25%, Facebook 0%, Local 0%, Other manual |
| 2026-02-04 | Shipping cost field | Features | DB migration, types, hooks, sell modal, analytics, P&L/tax/platform reports |
| 2026-02-04 | ARIA accessibility | UI/UX | `aria-label` on all icon-only buttons, `role="dialog"` + `aria-modal` + `aria-labelledby` on all modals |
| 2026-02-04 | Skip-to-content link + ARIA live region | UI/UX | Keyboard-accessible skip link, `id="main-content"` on main elements, `aria-live="polite"` announcements region |
| 2026-02-04 | axe-core dev audit | UI/UX | `@axe-core/react` loaded in development mode, logs a11y violations to console |
| 2026-02-04 | JustTCG 429 handling with exponential backoff | Features | `fetchWithRetry` helper in proxy route, reads `Retry-After` header, 3 retries with 1s/2s/4s backoff |
| 2026-02-04 | Price freshness badge | Features | Color-coded badge (green/yellow/red) showing time since last price update on inventory items |
| 2026-02-04 | React Query retry with exponential backoff | Robustness | `retry: 3`, `retryDelay: 2^attempt * 1000` (max 30s) on all queries |
| 2026-02-04 | Network connectivity detection + banner | Robustness | `useNetworkStatus` hook, amber offline banner at top of layout, dismissible |
| 2026-02-04 | Remove service role key fallback | Security | Proxy route and cache module now use anon key only, no service role key exposure |
| 2026-02-04 | Audit logging table + hook | Security | `audit_log` table with RLS, `useLogAction` mutation, `useAuditLog` query |
| 2026-02-04 | CSRF protection (N/A) | Security | Supabase Auth uses JWT bearer tokens, not cookies — inherently CSRF-safe |
| 2026-02-04 | Getting Started checklist | Onboarding | 5-step interactive sidebar checklist, queries actual DB data, localStorage dismissal |
| 2026-02-04 | Terms of Service checkbox | Onboarding | Signup form requires ToS agreement, links to `/terms` and `/privacy` |
| 2026-02-04 | Password strength indicator | Onboarding | 4-segment bar (weak/fair/good/strong) with real-time feedback on signup |
| 2026-02-04 | Plausible analytics scaffold | Production | Conditional `<Script>` tag, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var, added to CSP |
| 2026-02-04 | Open Graph + Twitter Card meta tags | Production | `metadataBase`, `openGraph`, `twitter` in root layout metadata |
| 2026-02-04 | robots.txt + sitemap.xml | Production | Next.js metadata API files (`robots.ts`, `sitemap.ts`) |
| 2026-02-04 | Unit tests for hooks (8 new files) | Production | 94 total tests covering transactions, analytics, currency, organizations, price alerts, notifications, network status, onboarding |
