'use client'

import { createClientComponentClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useMemo } from 'react'

export function LogoutButton() {
  const router = useRouter()
  // Use useMemo to ensure we only create one client instance per component
  const supabase = useMemo(() => createClientComponentClient(), [])

  async function handleLogout() {
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
