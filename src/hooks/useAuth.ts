"use client"

import { useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAppStore } from "../store/useAppStore"
import { initializeRevenueCat } from "../lib/revenuecat"

export const useAuth = () => {
  const { user, setUser, setLoading, setError } = useAppStore()

  useEffect(() => {
    const getSession = async () => {
      setLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
          })

          // Initialize RevenueCat
          await initializeRevenueCat(session.user.id)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Authentication error")
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        })

        await initializeRevenueCat(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading, setError])

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign in failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign up failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign out failed")
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }
}
