# MatPro.ai Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account and project created
- Stripe account with test API keys

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   - Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings
   - Get `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project settings (API settings)
3. Fill in your Stripe credentials:
   - Get test keys from Stripe Dashboard
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Get webhook secret after creating the endpoint
   - Create subscription products in Stripe and add their price IDs
4. Set `NEXT_PUBLIC_URL` to your deployment URL (or `http://localhost:3000` for local dev)

## Step 3: Set Up Database

1. Go to your Supabase project SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the migration
4. Verify tables are created: `organizations`, `profiles`, `athletes`, `subscriptions`

## Step 4: Set Up Stripe Webhook

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`

## Step 5: Create Stripe Products

1. In Stripe Dashboard, create three products:
   - Starter ($29/month)
   - Pro ($79/month)
   - Elite ($199/month)
2. Create recurring prices for each product
3. Copy the price IDs to your `.env.local`:
   - `NEXT_PUBLIC_STRIPE_PRICE_STARTER`
   - `NEXT_PUBLIC_STRIPE_PRICE_PRO`
   - `NEXT_PUBLIC_STRIPE_PRICE_ELITE`

## Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign up to create your first organization!

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy!

## Security Notes

- Never commit `.env.local` to version control
- The service role key should only be used server-side
- RLS policies ensure data isolation between organizations
- Always verify organization ownership in server actions

## Testing Multi-Tenancy

1. Create multiple accounts with different organizations
2. Verify each organization only sees their own data
3. Test RLS by trying to access other organizations' data (should fail)
