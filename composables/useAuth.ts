import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  async function login(email: string, password: string) {
    return authStore.login(email, password)
  }
  function logout() {
    authStore.logout()
  }
  async function checkAuth() {
    return authStore.checkAuth()
  }
  return { user, isAuthenticated, login, logout, checkAuth }
}
