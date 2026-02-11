# Pokemon Resale

A streamlined inventory and procurement tracking app for Pokemon card resellers. Built with Next.js and Supabase.

## Features

- **Inventory Management** - Track your card collection with location, condition, and acquisition cost
- **Procurement Tracking** - Log purchase orders from suppliers with cost breakdowns
- **Dashboard Analytics** - View inventory value, status breakdown, and recent activity
- **Pokemon TCG API Integration** - Search cards with market price data from Pokemon TCG API
- **User Authentication** - Secure login with Supabase Auth

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **External API**: Pokemon TCG API for card data

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migrations in `supabase/migrations/` in order:
   - `20251205223611_create_inventory_table.sql`
   - `20260126000000_add_auth_procurements_sales.sql`
3. Enable Email Auth in Authentication > Providers

### 2. Configure environment

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in your Supabase project: Settings > API

### 3. Install and run

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Create an account

Sign up with email/password on the login page to start using the app.

## Project Structure

```
pokemon-resale/
├── apps/web/                  # Next.js app
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── inventory/     # Inventory management
│   │   │   ├── procurement/   # Procurement tracking
│   │   │   └── login/         # Authentication
│   │   ├── components/        # React components
│   │   ├── hooks/             # React Query hooks
│   │   └── lib/               # Utilities and clients
│   └── package.json
├── supabase/
│   └── migrations/            # Database schema
└── README.md
```

## Database Schema

- **inventory** - Card items with condition, location, cost, status
- **procurements** - Purchase orders with supplier, costs, status
- **sales** - Sale records with price, platform, fees

All tables use Row Level Security (RLS) to ensure users only see their own data.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Install the [Vercel CLI](https://vercel.com/cli):
   ```bash
   npm i -g vercel
   ```

2. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JUSTTCG_API_KEY` (optional, for card price data)
   - `NEXT_PUBLIC_SENTRY_DSN` (optional, for error monitoring)
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional, for analytics)

3. Deploy:
   ```bash
   vercel
   ```

4. **Cron Jobs**: The `vercel.json` includes cron jobs for automated price updates:
   - Daily at 2 AM: Full price update (`/api/cron/daily-price-update`)
   - Every 6 hours: Incremental price update (`/api/cron/update-prices`)

### Option 2: Deploy with Docker

1. Copy the example environment file:
   ```bash
   cp .env.production.example .env.production
   ```

2. Edit `.env.production` with your production values.

3. Use the deployment helper script:
   ```bash
   # Make the script executable (Linux/Mac)
   chmod +x deploy.sh

   # Build and start services
   ./deploy.sh up

   # Or use individual commands:
   ./deploy.sh build    # Build Docker image
   ./deploy.sh up       # Start services
   ./deploy.sh down     # Stop services
   ./deploy.sh logs     # View logs
   ./deploy.sh rebuild  # Rebuild and restart
   ./deploy.sh clean    # Remove all containers and images
   ./deploy.sh status   # Show service status
   ```

4. On Windows, use Docker Compose directly:
   ```powershell
   docker-compose build
   docker-compose up -d
   ```

5. Access the app at `http://localhost:3000`

6. **Production checklist**:
   - [ ] Set up SSL/TLS (use nginx or Caddy as reverse proxy)
   - [ ] Configure firewall rules
   - [ ] Set up automated backups for Supabase
   - [ ] Configure monitoring (Sentry, Plausible, etc.)
   - [ ] Set up log aggregation
   - [ ] Review and update security headers in `vercel.json`

### Docker Image Details

The multi-stage Dockerfile includes:
- **Stage 1**: Install dependencies
- **Stage 2**: Build the Next.js application
- **Stage 3**: Production runtime (minimal Alpine image)
- Health check endpoint at `/api/health`
- Runs as non-root user for security
- Exposes port 3000

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous key |
| `JUSTTCG_API_KEY` | No | JustTCG API key for card price data |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for error monitoring |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Plausible Analytics domain |

## License

MIT
