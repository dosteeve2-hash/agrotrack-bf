import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { cleSupabase, urlSupabase } from './config'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    urlSupabase(),
    cleSupabase(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies set by middleware
          }
        },
      },
    }
  )
}
