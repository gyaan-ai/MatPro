import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerComponentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a mock client during build time
    // This will be replaced with real client at runtime
    return createClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder-key'
    )
  }

  const cookieStore = await cookies()

  return createClient(url, key, {
    auth: {
      storage: {
        getItem: (key: string) => {
          const cookie = cookieStore.get(key)
          return cookie?.value ?? null
        },
        setItem: (key: string, value: string) => {
          try {
            cookieStore.set(key, value, {
              path: '/',
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          } catch {
            // The `setItem` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        removeItem: (key: string) => {
          try {
            cookieStore.set(key, '', {
              path: '/',
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              maxAge: 0,
            })
          } catch {
            // Ignore errors
          }
        },
      },
    },
  })
}

export async function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
