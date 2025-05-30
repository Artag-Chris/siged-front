"use client"

import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Settings, LogOut, User, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, logout, forceLogout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    // Usar forceLogout en lugar de logout para asegurar limpieza completa
    forceLogout()

    // Forzar redirección y recarga completa
    window.location.href = "/login"
  }

  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AdminPanel</h1>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-4">
            {/* Búsqueda */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notificaciones */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* Configuración */}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            {/* Botón de logout directo para asegurar que siempre esté disponible */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </Button>

            {/* Perfil del usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center space-x-1">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                        {user.role === "admin" ? "Administrador" : "Usuario"}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
