"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const { forceLogout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Ejecutar logout y redirigir
    forceLogout()

    // Usar setTimeout para asegurar que el logout se complete
    setTimeout(() => {
      window.location.href = "/login"
    }, 100)
  }, [forceLogout, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cerrando sesión...</p>
      </div>
    </div>
  )
}
