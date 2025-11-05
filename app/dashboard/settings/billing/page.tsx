import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/billing/checkout-button'
import { CreditCard, Check } from 'lucide-react'

export default async function BillingPage() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  const organization = profile.organizations

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: [
        'Up to 50 athletes',
        'Basic roster management',
        'Email support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER!,
      tier: 'starter',
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      features: [
        'Up to 200 athletes',
        'Advanced analytics',
        'AI lineup optimization',
        'Priority support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
      tier: 'pro',
    },
    {
      name: 'Elite',
      price: '$199',
      period: '/month',
      features: [
        'Unlimited athletes',
        'All Pro features',
        'Custom integrations',
        'Dedicated support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE!,
      tier: 'elite',
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Your current subscription status and tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {organization?.subscription_status || 'trialing'}
                </p>
              </div>
              <div>
                <p className="font-medium">Tier</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {organization?.subscription_tier || 'starter'}
                </p>
              </div>
            </div>
            {organization?.trial_ends_at && (
              <div>
                <p className="font-medium">Trial Ends</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(organization.trial_ends_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Choose a Plan</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={
                organization?.subscription_tier === plan.tier
                  ? 'border-primary'
                  : ''
              }
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton
                  priceId={plan.priceId}
                  tier={plan.tier}
                  currentTier={organization?.subscription_tier || 'starter'}
                  disabled={organization?.subscription_tier === plan.tier}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
