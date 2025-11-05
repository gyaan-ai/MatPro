'use server'

import { createServerComponentClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/helpers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const organizationName = formData.get('organizationName') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!email || !password || !organizationName || !firstName || !lastName) {
    return { error: 'All fields are required' }
  }

  const supabase = await createServerComponentClient()
  const serviceRoleClient = await createServiceRoleClient()

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      return { error: authError?.message || 'Failed to create account' }
    }

    // Generate unique slug
    const baseSlug = generateSlug(organizationName)
    let slug = baseSlug
    let counter = 1

    // Check if slug exists
    const { data: existingOrg } = await serviceRoleClient
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single()

    while (existingOrg) {
      slug = `${baseSlug}-${counter}`
      const { data: check } = await serviceRoleClient
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .single()
      if (!check) break
      counter++
    }

    // Create organization
    const { data: organization, error: orgError } = await serviceRoleClient
      .from('organizations')
      .insert({
        name: organizationName,
        slug,
      })
      .select()
      .single()

    if (orgError || !organization) {
      // Clean up auth user if org creation fails
      await serviceRoleClient.auth.admin.deleteUser(authData.user.id)
      return { error: 'Failed to create organization' }
    }

    // Create profile
    const { error: profileError } = await serviceRoleClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        organization_id: organization.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'owner',
        onboarded: true,
      })

    if (profileError) {
      // Clean up if profile creation fails
      await serviceRoleClient.auth.admin.deleteUser(authData.user.id)
      await serviceRoleClient.from('organizations').delete().eq('id', organization.id)
      return { error: 'Failed to create profile' }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred' }
  }
}
