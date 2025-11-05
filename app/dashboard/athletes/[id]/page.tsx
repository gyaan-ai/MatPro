import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AthleteForm } from '@/components/athletes/athlete-form'
import { updateAthlete } from '../actions'

export default async function EditAthletePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'admin', 'coach'].includes(profile.role)) {
    redirect('/dashboard/athletes')
  }

  // Get athlete
  const { data: athlete } = await supabase
    .from('athletes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!athlete || athlete.organization_id !== profile.organization_id) {
    redirect('/dashboard/athletes')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Athlete</h1>
        <p className="text-muted-foreground mt-2">
          Update athlete information
        </p>
      </div>
      <AthleteForm athlete={athlete} action={(formData) => updateAthlete(params.id, formData)} />
    </div>
  )
}
