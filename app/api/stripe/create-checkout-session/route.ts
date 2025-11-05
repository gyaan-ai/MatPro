import { createServerComponentClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.organizations) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const organization = profile.organizations
    const { priceId, tier } = await request.json()

    if (!priceId || !tier) {
      return NextResponse.json(
        { error: 'Price ID and tier are required' },
        { status: 400 }
      )
    }

    // Create or get Stripe customer
    let customerId = organization.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          organization_id: organization.id,
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Update organization with customer ID
      const serviceRoleClient = await createServiceRoleClient()
      await serviceRoleClient
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', organization.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings/billing?canceled=true`,
      metadata: {
        organization_id: organization.id,
        tier,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
