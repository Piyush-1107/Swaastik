'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await checkAdminStatus(session.user.id)
        }
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkAdminStatus(session.user.id)
        } else {
          setIsAdmin(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('🔍 Checking admin status for user ID:', userId)
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', userId)
        .single()

      console.log('📊 Admin query result:', { data, error })
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ User is not in admin_users table (regular user)')
        } else {
          console.log('⚠️ Error checking admin status:', error.message)
        }
        setIsAdmin(false)
      } else {
        const isAdminUser = data?.role === 'admin' || data?.role === 'shop_owner'
        console.log('✅ User admin status:', isAdminUser, 'Role:', data?.role)
        setIsAdmin(isAdminUser)
      }
    } catch (error) {
      console.error('❌ Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { user: data.user, error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🔄 Starting signIn process for:', email)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log('📤 SignIn response:', { 
        user: data.user?.email, 
        error: error?.message 
      })
      
      if (data.user && !error) {
        // Force check admin status immediately after login
        console.log('✅ Login successful, checking admin status...')
        await checkAdminStatus(data.user.id)
      }
      
      return { user: data.user, error }
    } catch (err) {
      console.error('❌ SignIn error:', err)
      return { 
        user: null, 
        error: { 
          message: 'Login failed. Please try again.',
          name: 'AuthError',
          status: 500
        } as AuthError 
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
