import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { Role } from '../lib/auth'

export type Profile = {
  id: string
  role: Role
  fullName: string
  phone: string | null
}

export type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  /** True until we know who is logged in and have loaded their profile. */
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
