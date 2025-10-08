"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { TokenExpirationGuard } from "@/components/token-expiration-guard"
import { Navbar } from "../../components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {/* Guardian de expiración de token JWT */}
      <TokenExpirationGuard 
        checkInterval={60000} // Verificar cada 1 minuto
        redirectTo="/login"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
