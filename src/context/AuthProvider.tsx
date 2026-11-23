import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContext, type Profile } from './auth-context'

// Keeps track of the logged-in user and their profile (role, name) for the whole app.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileFor, setProfileFor] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setInitialized(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id ?? null

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('id, role, full_name, phone')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (cancelled) return
        setProfile(data ? { id: data.id, role: data.role, fullName: data.full_name, phone: data.phone } : null)
        setProfileFor(userId)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const loading = !initialized || (userId !== null && profileFor !== userId)

  const value = {
    session,
    user: session?.user ?? null,
    profile: userId && profileFor === userId ? profile : null,
    loading,
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
