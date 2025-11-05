import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerComponentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time, env vars may not be available
  // Return a minimal client that won't throw errors
  if (!url || !key) {
    // Return a client with placeholder values that won't validate
    // This prevents errors during build, but won't work at runtime
    const cookieStore = await cookies()
    try {
      return createClient(
        'https://placeholder.supabase.co',
        'placeholder-anon-key',
        {
          auth: {
            storage: {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
          },
        }
      )
    } catch {
      // If even placeholder fails, return a minimal object
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
        },
        from: () => ({
          select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        }),
      } as any
    }
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase service role key is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
