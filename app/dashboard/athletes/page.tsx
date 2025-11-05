import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AthleteList } from '@/components/athletes/athlete-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AthletesPage() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  // Check if user can manage athletes
  const canManage = ['owner', 'admin', 'coach'].includes(profile.role)

  // Get athletes
  const { data: athletes } = await supabase
    .from('athletes')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Athletes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your wrestling club roster
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href="/dashboard/athletes/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Athlete
            </Link>
          </Button>
        )}
      </div>

      <AthleteList athletes={athletes || []} canManage={canManage} />
    </div>
  )
}
