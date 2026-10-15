import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Decode a JWT payload without verifying. Only used to refuse a privileged key in the browser. */
function jwtRole(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return (JSON.parse(json) as { role?: string }).role ?? null
  } catch {
    return null
  }
}

export const isSupabaseConfigured = Boolean(url && anonKey)

if (anonKey && (jwtRole(anonKey) === 'service_role' || anonKey.startsWith('sb_secret_'))) {
  // Fail loudly: a service-role key in a VITE_* var would be bundled and public.
  throw new Error(
    'VITE_SUPABASE_ANON_KEY looks like a service-role/secret key. Use the anon/publishable key only.',
  )
}

/** Supabase browser client, or null until env is configured. Use only via typed service modules. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
