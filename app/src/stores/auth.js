import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
  }),
  actions: {
    async init() {
      const { data } = await supabase.auth.getUser()
      this.user = data?.user || null
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
      })
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


