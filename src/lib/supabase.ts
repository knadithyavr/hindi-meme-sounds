import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public reads — singleton, anon key, RLS applies
export const db = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Admin writes — singleton, service role key, bypasses RLS
// Only import this in server action files (never client-side)
export const adminDb = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
})
