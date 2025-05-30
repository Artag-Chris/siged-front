"use client"

import type React from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        // Forzar redirección completa para evitar problemas de estado
        window.location.href = "/login"
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, isAuthenticated, router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
