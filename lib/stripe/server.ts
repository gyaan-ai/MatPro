import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeInstance
}

// Lazy getter - only initializes when accessed, not at module load
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripeInstance()[prop as keyof Stripe]
  },
}) as Stripe

export const STRIPE_PRICE_IDS = {
  starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER!,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
  elite: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE!,
} as const
