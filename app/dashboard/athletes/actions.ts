'use server'

import { createServerComponentClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAthlete(formData: FormData) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'admin', 'coach'].includes(profile.role)) {
    return { error: 'Unauthorized' }
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const weight = formData.get('weight') as string
  const weightClass = formData.get('weightClass') as string
  const grade = formData.get('grade') as string
  const experienceLevel = formData.get('experienceLevel') as string

  if (!firstName || !lastName) {
    return { error: 'First name and last name are required' }
  }

  const { error } = await supabase
    .from('athletes')
    .insert({
      organization_id: profile.organization_id,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth || null,
      weight: weight ? parseFloat(weight) : null,
      weight_class: weightClass || null,
      grade: grade || null,
      experience_level: experienceLevel || null,
      status: 'active',
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/athletes')
  redirect('/dashboard/athletes')
}

export async function updateAthlete(id: string, formData: FormData) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'admin', 'coach'].includes(profile.role)) {
    return { error: 'Unauthorized' }
  }

  // Verify athlete belongs to user's organization
  const { data: athlete } = await supabase
    .from('athletes')
    .select('organization_id')
    .eq('id', id)
    .single()

  if (!athlete || athlete.organization_id !== profile.organization_id) {
    return { error: 'Athlete not found' }
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const weight = formData.get('weight') as string
  const weightClass = formData.get('weightClass') as string
  const grade = formData.get('grade') as string
  const experienceLevel = formData.get('experienceLevel') as string
  const status = formData.get('status') as string

  const { error } = await supabase
    .from('athletes')
    .update({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth || null,
      weight: weight ? parseFloat(weight) : null,
      weight_class: weightClass || null,
      grade: grade || null,
      experience_level: experienceLevel || null,
      status: status || 'active',
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/athletes')
  redirect('/dashboard/athletes')
}

export async function deleteAthlete(id: string) {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'admin', 'coach'].includes(profile.role)) {
    return { error: 'Unauthorized' }
  }

  // Verify athlete belongs to user's organization
  const { data: athlete } = await supabase
    .from('athletes')
    .select('organization_id')
    .eq('id', id)
    .single()

  if (!athlete || athlete.organization_id !== profile.organization_id) {
    return { error: 'Athlete not found' }
  }

  const { error } = await supabase
    .from('athletes')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/athletes')
  return { success: true }
}
