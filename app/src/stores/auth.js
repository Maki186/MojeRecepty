import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

let authInitPromise = null
let authSubscription = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
  }),
  actions: {
    async init() {
      if (this.initialized) return this.user
      if (authInitPromise) return authInitPromise

      authInitPromise = (async () => {
        const { data } = await supabase.auth.getUser()
        this.user = data?.user || null

        if (!authSubscription) {
          const { data: subscriptionData } = supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user || null
            this.initialized = true
          })
          authSubscription = subscriptionData.subscription
        }

        this.initialized = true
        return this.user
      })()

      try {
        return await authInitPromise
      } finally {
        authInitPromise = null
      }
    },
    async login(email, password) {
      const mail = String(email || '').trim()
      const pass = String(password || '')
      if (!mail || !pass) throw new Error('Zadejte e-mail i heslo')
      this.loading = true
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: mail, password: pass })
        if (error) throw error
        const { data } = await supabase.auth.getUser()
        this.user = data?.user || null
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user
    },
    username(state) {
      return state.user?.email || ''
    },
  },
})


