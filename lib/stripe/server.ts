import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const STRIPE_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER!,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
  elite: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE!,
} as const
