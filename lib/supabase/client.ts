import { createBrowserClient } from '@supabase/ssr'

import { cleSupabase, urlSupabase } from './config'

export function createClient() {
  return createBrowserClient(
    urlSupabase(),
    cleSupabase()
  )
}
