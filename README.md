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
```

## License

MIT
