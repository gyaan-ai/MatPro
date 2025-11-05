import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if env vars are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // If env vars aren't set, just allow the request through
    // The pages will handle auth checks themselves
    return res
  }

  try {
    // Create a Supabase client with cookie-based auth
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage: {
          getItem: (key: string) => {
            return req.cookies.get(key)?.value ?? null
          },
          setItem: (key: string, value: string) => {
            res.cookies.set(key, value, {
              path: '/',
              sameSite: 'lax',
              httpOnly: true,
            })
          },
          removeItem: (key: string) => {
            res.cookies.delete(key)
          },
        },
      },
    })

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // If there's an error or no session, continue without user
    const user = session?.user

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (req.nextUrl.pathname.startsWith('/auth') && user) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  } catch (error) {
    // If Supabase client fails, log and continue
    // The pages will handle auth checks themselves
    console.error('Middleware error:', error)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
