import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  student: null,
  parent: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          let additionalData = null
          if (profile.role === 'student') {
            const { data: student } = await supabase
              .from('students')
              .select('*')
              .eq('profile_id', profile.id)
              .single()
            additionalData = student
          } else if (profile.role === 'parent') {
            const { data: parent } = await supabase
              .from('parents')
              .select('*')
              .eq('profile_id', profile.id)
              .single()
            additionalData = parent
          }

          set({
            user: { ...session.user, role: profile.role },
            profile,
            [profile.role]: additionalData,
            loading: false
          })
        }
      } else {
        set({ loading: false })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            let additionalData = null
            if (profile.role === 'student') {
              const { data: student } = await supabase
                .from('students')
                .select('*')
                .eq('profile_id', profile.id)
                .single()
              additionalData = student
            } else if (profile.role === 'parent') {
              const { data: parent } = await supabase
                .from('parents')
                .select('*')
                .eq('profile_id', profile.id)
                .single()
              additionalData = parent
            }

            set({
              user: { ...session.user, role: profile.role },
              profile,
              [profile.role]: additionalData
            })
          }
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null, student: null, parent: null })
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },

  signUp: async (email, password, fullName, role, additionalData = {}) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role
          })

        if (profileError) throw profileError

        // Create role-specific record
        if (role === 'student') {
          const { error: studentError } = await supabase
            .from('students')
            .insert({
              profile_id: authData.user.id,
              grade_level: additionalData.gradeLevel || null
            })
          if (studentError) throw studentError
        } else if (role === 'parent') {
          const { error: parentError } = await supabase
            .from('parents')
            .insert({
              profile_id: authData.user.id,
              phone_number: additionalData.phoneNumber || null
            })
          if (parentError) throw parentError
        }

        return { success: true }
      }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, error: error.message }
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, error: error.message }
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, profile: null, student: null, parent: null })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  },

  refreshStudent: async () => {
    try {
      const state = useAuthStore.getState()
      if (state.profile?.role === 'student') {
        const { data: student } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', state.profile.id)
          .single()
        
        if (student) {
          set({ student })
        }
      }
    } catch (error) {
      console.error('Error refreshing student data:', error)
    }
  }
}))
