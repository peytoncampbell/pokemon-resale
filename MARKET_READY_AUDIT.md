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
- [ ] **No skip-to-content link** or ARIA live regions for screen readers
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
| P1 | Add skip-to-content link and ARIA live regions for notifications | ⬜ TODO |
| P1 | Run axe-core accessibility audit and fix all critical violations | ⬜ TODO |
| P2 | Centralize design tokens into a single source of truth | ⬜ TODO |
| P2 | Add Storybook for component documentation | ⬜ TODO |

---

## Pillar 2: Feature Completeness for Resellers

### Current State

The inventory system is feature-rich: full CRUD, bulk operations (`BulkActionBar` with multi-select, status/location/delete), paginated loading (50/page), duplicate detection, and a three-stage status pipeline (IN_STOCK → LISTED → SOLD). Trade transactions (`TradeTransactionModal`) handle give/receive with optional cash adjustments and automatic inventory creation. P&L logic calculates Revenue − COGS − Fees with proportional fee allocation across multi-item transactions. Six report types exist including a Tax Summary in Schedule D format. The JustTCG API proxy has two-layer caching (in-memory + Supabase `tcg_cache` table) with 10-minute TTL for cards and 1-hour for sets.

### Critical Gaps

- [x] **Shipping cost field added** to transactions schema with full-stack integration (DB → types → hooks → UI → analytics → reports)
- [x] **Platform fee presets implemented** — eBay (13.25%), TCGPlayer (10.25%), Facebook (0%), Local (0%), Other (manual) with auto-calculation and manual override
- [ ] **No client-side rate limiting** for JustTCG API — caching mitigates this but there's no explicit detection or backoff on 429 responses
- [ ] **No stale price indicator in the UI** — users can't see when price data was last refreshed
- [ ] **No automated background price updates** — requires manual refresh

### Premium Polish

- [x] Platform fee presets (eBay: 13.25%, TCGPlayer: 10.25%, etc.) auto-calculate when a platform is selected
- [ ] Show "Last updated: X hours ago" badge on price data with a color-coded freshness indicator
- [ ] Add inventory holding cost / carrying cost calculations for working capital analysis
- [ ] Add a "Quick Sell" flow optimized for rapid-fire sales at card shows (minimal taps)

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add `shipping_cost` column to transactions schema and update P&L logic | ✅ DONE |
| P0 | Implement platform fee presets with auto-calculation on sell form | ✅ DONE |
| P1 | Add rate limit detection (429 handling) with exponential backoff in JustTCG proxy | ⬜ TODO |
| P1 | Add "price freshness" badge to inventory cards showing last update timestamp | ⬜ TODO |
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
- [ ] **No retry logic** — failed API calls are not retried. No exponential backoff configured
- [ ] **No network connectivity detection** — no `navigator.onLine` monitoring, no offline indicator
- [ ] **No request timeouts** configured on fetch calls

### Premium Polish

- [x] Global toast notification system (sonner) wired to React Query's `MutationCache.onError`
- [ ] Implement optimistic UI with rollback animations on failure
- [ ] Add a network status banner that appears when connectivity drops
- [ ] Add request timeout configuration (10s default, 30s for scraping endpoints)

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add granular Error Boundaries around inventory, transactions, reports, and analytics sections | ✅ DONE |
| P0 | Implement toast notification system and wire to all mutation `onError` callbacks | ✅ DONE |
| P0 | Add global `onError` handler to QueryClient configuration | ✅ DONE |
| P1 | Add retry logic with exponential backoff (3 retries, 1s/2s/4s) to React Query defaults | ⬜ TODO |
| P1 | Add network connectivity detection with UI banner | ⬜ TODO |
| P2 | Add request timeout configuration (10s default) | ⬜ TODO |
| P2 | Add service worker for offline-first caching of static assets | ⬜ TODO |

---

## Pillar 4: Multi-Tenancy & Data Security

### Current State

RLS is solid. All tables have organization-based RLS policies enforced at the database level. The initial public-access RLS policies from migration `20251205223611` were completely replaced with organization-scoped policies in migration `20260127000000`. A `SECURITY DEFINER` function (`check_organization_membership`) prevents RLS recursion. Client-side code includes organization filtering in **87 query call sites** via `getCurrentOrganizationId()`. The JustTCG API proxy has endpoint whitelisting (`['cards', 'sets', 'games']`) preventing SSRF. API keys are server-side only.

### Critical Gaps

- [x] **Security headers middleware added** — CSP, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), HSTS, Referrer-Policy, Permissions-Policy
- [ ] **No rate limiting on auth endpoints** — brute-force attacks are unmitigated
- [ ] **No CSRF protection** beyond Supabase's cookie handling
- [ ] **No audit logging** for sensitive operations (member add/remove, org creation, bulk deletes)
- [ ] **`.env.local` appears to be tracked in git** — credentials are exposed in the repository
- [ ] **Service role key used as fallback** in JustTCG proxy and cache — bypasses RLS (low risk since only on `tcg_cache` table, but unnecessary)

### Premium Polish

- [ ] Add MFA/TOTP support (Supabase Auth supports it, just needs enabling)
- [ ] Add audit trail table for compliance (who did what, when)
- [ ] Add IP-based rate limiting on auth and API routes
- [ ] Add role-based permissions within organizations (admin, editor, viewer)

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Add security headers middleware in `next.config.ts` or `middleware.ts` | ✅ DONE |
| P0 | Remove `.env.local` from git history and ensure it's in `.gitignore` | ⬜ TODO |
| P0 | Add rate limiting on `/login` and `/api/*` routes | ⬜ TODO |
| P1 | Remove service role key fallback from JustTCG proxy and cache — use anon key only | ⬜ TODO |
| P1 | Implement audit logging table for sensitive operations | ⬜ TODO |
| P1 | Add CSRF tokens for state-changing operations | ⬜ TODO |
| P2 | Enable MFA/TOTP in Supabase Auth config | ⬜ TODO |
| P2 | Add role-based permissions (admin/editor/viewer) within organizations | ⬜ TODO |

---

## Pillar 5: Onboarding & User Lifecycle

### Current State

Login is email/password only via Supabase Auth (minimum 6-character password). After signup, users are directed to a `/setup` page where they create or join an organization (8-character invite code). The `/join` route supports query params (`?code=ABCD1234`) and SessionStorage fallback for unauthenticated users. After org setup, users land on the dashboard with no further guidance.

### Critical Gaps

- [x] **Forgot password flow implemented** — email input on login page, auth callback handler, dedicated reset-password page with confirmation
- [x] **Google OAuth scaffolded** — "Sign in with Google" button on login page (requires enabling Google provider in Supabase dashboard)
- [ ] **No guided onboarding** — users hit the dashboard with zero context on what to do first
- [ ] **No onboarding checklist** (e.g., "Add your first card", "Record your first sale", "Set up a price alert")
- [ ] **No password strength indicator** on signup
- [ ] **No Terms of Service / Privacy Policy agreement** checkbox
- [ ] **No email verification UI** — signup says "check your email" but there's no resend or status page

### Premium Polish

- [ ] Add an interactive "Getting Started" checklist that persists in the sidebar until completed
- [ ] Add contextual tooltips on first visit (use `driver.js` or `react-joyride`)
- [ ] Add milestone celebrations ("You just recorded your 100th sale!")
- [ ] Add a "What's New" changelog modal for returning users
- [ ] Add email verification status page with resend button

### Action Items

| Priority | Task | Status |
|----------|------|--------|
| P0 | Implement forgot password / password reset flow (Supabase supports this natively) | ✅ DONE |
| P0 | Add Google OAuth social login via Supabase Auth | ✅ DONE (scaffold) |
| P1 | Build "Getting Started" checklist (5 steps: add card, record buy, record sell, view reports, set alert) | ⬜ TODO |
| P1 | Add Terms of Service checkbox to signup form | ⬜ TODO |
| P1 | Add password strength indicator | ⬜ TODO |
| P2 | Add contextual onboarding tour with `react-joyride` | ⬜ TODO |
| P2 | Add "What's New" changelog modal | ⬜ TODO |
| P3 | Add milestone celebration toasts | ⬜ TODO |

---

## Pillar 6: Production Readiness

### Current State

The `optimization_plan.md` shows 9 of 10 optimizations completed (bundle: 15MB → ~6MB, inventory load: 3-5s → <1s). The GitHub Actions workflow (`.github/workflows/webpack.yml`) is misconfigured — it runs `npx webpack` instead of `next build` and skips tests/linting entirely. No error monitoring (Sentry), no user analytics (GA4/Mixpanel), no performance monitoring (Core Web Vitals). SEO has basic `title` and `description` metadata but is missing Open Graph tags, Twitter cards, sitemap, and robots.txt. Test coverage is minimal — only 2 test files exist for the entire application.

### Critical Gaps

- [x] **Sentry error monitoring scaffolded** — `@sentry/nextjs` installed, client/server configs created, `ErrorBoundary.componentDidCatch` reports to Sentry, enabled via `NEXT_PUBLIC_SENTRY_DSN` env var
- [ ] **No user analytics** — zero visibility into signups, feature adoption, or conversion funnels
- [x] **CI/CD pipeline fixed** — replaced broken `webpack.yml` with `ci.yml` (Node 20.x, npm ci, lint, test, build)
- [ ] **Only 2 test files** for an entire production application
- [ ] **No deployment configuration** — no `vercel.json`, Docker, or deployment scripts
- [ ] **Missing Open Graph / Twitter Card tags** — shared links will look broken on social media

### Premium Polish

- [ ] Add Vercel Web Analytics or Plausible for privacy-respecting analytics
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
| P1 | Add GA4 or Plausible analytics with key event tracking | ⬜ TODO |
| P1 | Add Open Graph and Twitter Card meta tags to root layout | ⬜ TODO |
| P1 | Add `robots.txt` and `sitemap.xml` generation | ⬜ TODO |
| P1 | Write unit tests for all hooks (target 60%+ coverage) | ⬜ TODO |
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
