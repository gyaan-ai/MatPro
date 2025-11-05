import { createServiceRoleClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = await createServiceRoleClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const organizationId = session.metadata?.organization_id
          const tier = session.metadata?.tier

          if (!organizationId || !tier) {
            console.error('Missing metadata in checkout session')
            break
          }

          // Create subscription record
          await supabase.from('subscriptions').upsert({
            organization_id: organizationId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            tier,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            trial_start: subscription.trial_start
              ? new Date(subscription.trial_start * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          })

          // Update organization subscription status
          await supabase
            .from('organizations')
            .update({
              subscription_status: subscription.status,
              subscription_tier: tier,
              subscription_ends_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', organizationId)
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Find organization by customer ID
        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single()

        if (!org) {
          console.error('Organization not found for customer:', subscription.customer)
          break
        }

        // Update subscription record
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
          })
          .eq('stripe_subscription_id', subscription.id)

        // Update organization subscription status
        await supabase
          .from('organizations')
          .update({
            subscription_status: subscription.status,
            subscription_ends_at: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq('id', org.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}
