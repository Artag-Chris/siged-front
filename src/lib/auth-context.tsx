"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"

interface AuthContextProps {
  children: ReactNode
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: any | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: AuthContextProps) => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const value: AuthContextValue = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  }

  if (!mounted) {
    return null
  }

  return <AuthContext.Provider value={value}>
  {children}
  </AuthContext.Provider> 
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
