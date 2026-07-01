import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { authService, type AuthResult } from '@/services/auth.service'
import type { UsersProfileRow } from '@/types/database'

interface AuthContextValue {
  session: Session | null
  profile: UsersProfileRow | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (nome: string, email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<AuthResult>
  updatePassword: (newPassword: string) => Promise<AuthResult>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchProfile(userId: string): Promise<UsersProfileRow | null> {
  const { data, error } = await supabase.from('users_profile').select('*').eq('id', userId).single()
  if (error) {
    console.warn('[AuthContext.fetchProfile]', error.message)
    return null
  }
  return data
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UsersProfileRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      if (data.session) {
        fetchProfile(data.session.user.id).then((p) => isMounted && setProfile(p))
      }
      setIsLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        fetchProfile(newSession.user.id).then((p) => isMounted && setProfile(p))
      } else {
        setProfile(null)
      }
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextValue = {
    session,
    profile,
    isAuthenticated: !!session,
    isLoading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: async () => {
      await authService.signOut()
    },
    requestPasswordReset: authService.requestPasswordReset,
    updatePassword: authService.updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
