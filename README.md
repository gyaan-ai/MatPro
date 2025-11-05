# MatPro.ai

A modern, AI-powered wrestling club management platform designed to compete with and surpass WrestlingIQ.

## Features

- ✅ Multi-tenant SaaS architecture with Row Level Security (RLS)
- ✅ Organization signup and authentication
- ✅ Athlete roster management (CRUD operations)
- ✅ Stripe subscription integration
- ✅ Dashboard with organization overview
- ✅ Settings pages for organization and billing
- ✅ Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Hosting**: Vercel-ready

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Setup

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in your credentials
3. Run the database migration in Supabase SQL Editor (see `supabase/migrations/001_initial_schema.sql`)
4. Start the dev server: `npm run dev`

## Project Structure

```
/app
  /auth          # Authentication pages (signup, login)
  /dashboard      # Protected dashboard routes
  /api           # API routes (Stripe, webhooks)
/components      # React components
/lib            # Utilities (Supabase, Stripe, helpers)
/contexts       # React contexts (OrganizationContext)
/types          # TypeScript types
/supabase       # Database migrations
```

## Security

- All queries filter by `organization_id` (multi-tenancy)
- Row Level Security (RLS) policies enforce data isolation
- Server-side validation on all mutations
- Stripe webhook signature verification

## License

Private - All rights reserved
