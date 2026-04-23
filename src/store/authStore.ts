import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (user: User, token: string) => void
  logout: () => void
  initFromStorage: () => void
}

// Helper to set cookie
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// Helper to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token   = localStorage.getItem('accessToken')
      const userStr = localStorage.getItem('user')
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          set({ user, token, isLoggedIn: true })
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
        }
      }
    }
  },

  login: (user, token) => {
    // Save in localStorage for app state
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    // Save in cookie so middleware can read it
    setCookie('accessToken', token, 1)
    set({ user, token, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    deleteCookie('accessToken')
    set({ user: null, token: null, isLoggedIn: false })
  },
}))