'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface CheckoutButtonProps {
  priceId: string
  tier: string
  currentTier: string
  disabled?: boolean
}

export function CheckoutButton({
  priceId,
  tier,
  currentTier,
  disabled,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, tier }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        setLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className="w-full"
      variant={disabled ? 'outline' : 'default'}
    >
      {disabled
        ? 'Current Plan'
        : loading
        ? 'Loading...'
        : tier === 'elite'
        ? 'Contact Sales'
        : 'Subscribe'}
    </Button>
  )
}
