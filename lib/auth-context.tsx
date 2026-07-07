'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  User,
  SignupRequest,
  LoginRequest,
  AuthContextType,
} from './types'
import * as authApi from './api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')

    if (savedToken) {
      setToken(savedToken)
    }

    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse saved user:', e)
        localStorage.removeItem('authUser')
      }
    }

    setIsLoading(false)
  }, [])

  const signup = async (data: SignupRequest) => {
    setIsLoading(true)

    try {
      const response = await authApi.signup(data)

      const user: User = {
        email: response.email,
        fullName: response.fullName,
      }

      setToken(response.token)
      setUser(user)

      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(user))
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginRequest) => {
    setIsLoading(true)

    try {
      const response = await authApi.login(data)

      const user: User = {
        email: response.email,
        fullName: response.fullName,
      }

      setToken(response.token)
      setUser(user)

      localStorage.setItem('authToken', response.token)
      localStorage.setItem('authUser', JSON.stringify(user))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}