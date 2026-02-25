import { defineStore } from 'pinia'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'technician' | 'manager'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    async login(email: string, password: string) {
      if (email && password) {
        this.token = 'mock-jwt-token'
        this.user = { id: '1', name: 'Administrador', email, role: 'admin' }
        return true
      }
      return false
    },
    logout() {
      this.user = null
      this.token = null
    },
    async checkAuth() {
      if (this.token) return true
      return false
    },
  },
})
