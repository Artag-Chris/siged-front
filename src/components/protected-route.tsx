"use client"

import type React from "react"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { ProtectedRouteProps } from "@/interfaces/AuthContext"

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  // NO usar redirección automática en el hook para evitar bucles
  const { user, isLoading, isAuthenticated, hasRole } = useJwtAuth({
    autoInitialize: true
    // NO incluir redirectTo aquí para evitar bucles
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Verificando autenticación JWT...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirigir manualmente UNA SOLA VEZ
  if (!isAuthenticated || !user) {
    console.log('🚫 [PROTECTED-ROUTE] Usuario no autenticado, redirigiendo a login...')
    if (typeof window !== 'undefined') {
      window.location.href = "/login"
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-3 w-48 bg-gray-200 rounded mx-auto"></div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Redirigiendo a login...</p>
        </div>
      </div>
    )
  }

  // Insufficient role
  if (requiredRole) {
    // Si requiredRole es un array, verificar si el usuario tiene alguno de los roles
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.some(role => hasRole(role))
      : hasRole(requiredRole);

    if (!hasRequiredRole) {
      console.log('⚠️ [PROTECTED-ROUTE] Rol insuficiente:', {
        userRole: user.rol,
        requiredRole,
        hasRole: hasRequiredRole
      })
      
      if (typeof window !== 'undefined') {
        window.location.href = "/unauthorized"
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 w-40 bg-red-300 rounded mx-auto mb-2"></div>
              <div className="h-3 w-56 bg-red-200 rounded mx-auto"></div>
            </div>
            <p className="text-red-500 text-sm mt-4">Acceso no autorizado...</p>
          </div>
        </div>
      )
    }
  }



  return <>{children}</>
}
