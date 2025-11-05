'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface OrganizationContextType {
  organization: Organization | null
  profile: Profile | null
  loading: boolean
  refresh: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  profile: null,
  loading: true,
  refresh: async () => {},
})

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const fetchOrganization = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      // Get user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData) {
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Get organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profileData.organization_id)
        .single()

      if (orgError || !orgData) {
        setLoading(false)
        return
      }

      setOrganization(orgData)
    } catch (error) {
      console.error('Error fetching organization:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganization()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchOrganization()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        profile,
        loading,
        refresh: fetchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return context
}
