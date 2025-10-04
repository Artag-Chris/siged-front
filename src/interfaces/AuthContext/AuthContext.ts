import { type ReactNode } from "react"

export interface AuthContextProps {
  children: ReactNode
}

export interface AuthContextValue {
  isAuthenticated: boolean
  user: any | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar: string
  department: string
  lastLogin: string
  permissions: string[]
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setLoading: (loading: boolean) => void
  forceLogout: () => void
  clearAllStorage: () => void
}

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "super_admin" | "admin" | "gestor"
}
