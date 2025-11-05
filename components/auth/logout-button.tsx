'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useOrganization } from '@/contexts/OrganizationContext'

// Singleton for client instance
let logoutClientInstance: ReturnType<typeof import('@/lib/supabase/client').createClientComponentClient> | null = null

function getLogoutClient() {
  if (!logoutClientInstance) {
    const { createClientComponentClient } = require('@/lib/supabase/client')
    logoutClientInstance = createClientComponentClient()
  }
  return logoutClientInstance
}

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = getLogoutClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  )
}
