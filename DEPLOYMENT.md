# Deploying MatPro.ai to Vercel

This guide will walk you through deploying your MatPro.ai application to Vercel.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier is fine)
3. **Supabase Project** - Already set up with your database
4. **Stripe Account** - With test/production keys ready

## Step 1: Push Your Code to GitHub

If you haven't already, create a GitHub repository and push your code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MatPro.ai"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Important**: Make sure `.env.local` is in your `.gitignore` (it should already be).

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

## Step 3: Configure Project Settings

### Basic Settings

- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Environment Variables

Click **"Environment Variables"** and add all your variables from `.env.local`:

#### Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### Stripe Variables
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx (or pk_test_xxx for testing)
STRIPE_SECRET_KEY=sk_live_xxx (or sk_test_xxx for testing)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### Stripe Price IDs
```
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ELITE=price_xxx
```

#### App URL
```
NEXT_PUBLIC_URL=https://your-app-name.vercel.app
```

**Important Notes:**
- For production, use **production** Stripe keys (pk_live_*, sk_live_*)
- For testing, you can use test keys initially
- The `NEXT_PUBLIC_URL` should match your Vercel deployment URL
- You can add different values for Production, Preview, and Development environments

### OpenAI (Optional - for future AI features)
```
OPENAI_API_KEY=sk-xxx
```

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-app-name.vercel.app`

## Step 5: Configure Stripe Webhook

After your first deployment, you need to set up the Stripe webhook:

1. Go to your **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your webhook URL: `https://your-app-name.vercel.app/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Go back to Vercel → Your Project → **Settings** → **Environment Variables**
8. Update `STRIPE_WEBHOOK_SECRET` with the new secret
9. **Redeploy** your application (Vercel will automatically redeploy when you push to GitHub, or you can trigger a redeploy from the dashboard)

## Step 6: Update Supabase Settings (if needed)

If you have any Supabase settings that require your production URL:
1. Go to your Supabase project dashboard
2. Update any URL references to point to your Vercel URL
3. Check CORS settings if you're using Supabase Storage

## Step 7: Custom Domain (Optional)

1. In Vercel dashboard, go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `matpro.ai`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_URL` environment variable to your custom domain
5. Update Stripe webhook URL to use your custom domain

## Step 8: Test Your Deployment

1. Visit your Vercel URL
2. Try signing up for a new account
3. Test athlete creation
4. Test Stripe checkout (use test card: `4242 4242 4242 4242`)
5. Verify webhook is working (check Stripe webhook logs)

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors locally first

### Environment Variables Not Working

- Make sure variables are added for the correct environment (Production/Preview/Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Webhook Not Working

- Verify webhook URL is correct in Stripe dashboard
- Check webhook secret matches in Vercel
- Look at Stripe webhook logs for error messages
- Check Vercel function logs for webhook endpoint

### Database Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure RLS policies are set up correctly

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests and other branches

## Monitoring

- Check **Vercel Analytics** for performance metrics
- Monitor **Function Logs** for API route errors
- Set up **Stripe Webhook Logs** monitoring

## Production Checklist

Before going live:
- [ ] Use production Stripe keys
- [ ] Set up custom domain
- [ ] Configure production Supabase project
- [ ] Test all features end-to-end
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure backups for database
- [ ] Set up SSL (automatic with Vercel)
- [ ] Test webhook with production Stripe account

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: Available in dashboard
- Next.js Deployment: https://nextjs.org/docs/deployment
