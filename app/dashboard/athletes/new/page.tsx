import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AthleteForm } from '@/components/athletes/athlete-form'
import { createAthlete } from '../actions'

export default async function NewAthletePage() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'admin', 'coach'].includes(profile.role)) {
    redirect('/dashboard/athletes')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Athlete</h1>
        <p className="text-muted-foreground mt-2">
          Add a new athlete to your wrestling club roster
        </p>
      </div>
      <AthleteForm action={createAthlete} />
    </div>
  )
}
