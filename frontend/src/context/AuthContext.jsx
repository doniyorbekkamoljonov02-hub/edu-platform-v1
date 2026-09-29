import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Ilova ochilganda mavjud accessToken orqali
  // foydalanuvchini backenddan tekshiramiz.
  useEffect(() => {
    async function loadCurrentUser() {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await authService.me()
        setUser(currentUser)
      } catch (error) {
        console.error('Foydalanuvchini tekshirishda xatolik:', error)

        // Token yaroqsiz bo'lsa, login holatini tozalaymiz.
        authService.logout()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  async function refreshUser() {
    const currentUser = await authService.me()
    setUser(currentUser)
    return currentUser
  }

  // LOGIN
  async function login(credentials) {
    const response = await authService.login(credentials)

    const { accessToken, refreshToken } = response

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Token orqali haqiqiy userni backenddan olamiz.
    const currentUser = await authService.me()

    setUser(currentUser)

    return currentUser
  }

  // REGISTER
  async function register(payload) {
    const response = await authService.register(payload)

    const { accessToken, refreshToken } = response

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Registerdan keyin ham backenddan haqiqiy userni olamiz.
    const currentUser = await authService.me()

    setUser(currentUser)

    return currentUser
  }

  // LOGOUT
  function logout() {
    authService.logout()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak.')
  }

  return context
}