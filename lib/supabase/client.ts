import { createClient } from '@supabase/supabase-js'

export function createClientComponentClient() {
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

  return createClient(url, key)
}
