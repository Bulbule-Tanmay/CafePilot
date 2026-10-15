import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase/client'

export type AuthStatus = 'loading' | 'signed-out' | 'signed-in'

interface AuthValue {
  status: AuthStatus
  session: Session | null
}

const AuthContext = createContext<AuthValue>({ status: 'loading', session: null })

/**
 * Stage 0: exposes the raw Supabase session only. Roles, vendor status and
 * membership are added in Stage 1 and must come from the database, never the client.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthValue>({ status: supabase ? 'loading' : 'signed-out', session: null })

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ status: data.session ? 'signed-in' : 'signed-out', session: data.session })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ status: session ? 'signed-in' : 'signed-out', session })
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => state, [state])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
