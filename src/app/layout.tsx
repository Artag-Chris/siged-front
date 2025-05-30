"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
              <AdminSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  )
}