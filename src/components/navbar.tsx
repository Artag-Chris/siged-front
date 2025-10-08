"use client"

import { useState, useCallback } from "react"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { useTokenExpirationMonitor } from "@/hooks/useTokenExpirationMonitor"
import { UserProfileDialog } from "@/components/user-profile-dialog"
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Bell, Search, Settings, LogOut, User, Shield, Crown, UserCog, Clock, AlertTriangle } from "lucide-react"

export function Navbar() {
  const { user, logout, isAuthenticated } = useJwtAuth({
    redirectTo: '/login' 
  })
  
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [showExpirationWarning, setShowExpirationWarning] = useState(false)

  // Callbacks para el monitor de token
  const handleTokenExpiring = useCallback(() => {
    console.log('⚠️ [NAVBAR] Token está por expirar - Mostrando advertencia');
    setShowExpirationWarning(true);
    
    // Auto-ocultar la advertencia después de 30 segundos
    setTimeout(() => {
      setShowExpirationWarning(false);
    }, 30000);
  }, []);

  const handleTokenExpired = useCallback(() => {
    console.log('⏰ [NAVBAR] Token expirado - Usuario será deslogueado');
    // El monitor ya maneja el logout y redirección
  }, []);

  // Activar monitor de expiración de token
  useTokenExpirationMonitor({
    checkInterval: 60000, // Verificar cada 1 minuto
    redirectTo: '/login',
    showWarning: true,
    warningThresholdMinutes: 5, // Advertir 5 minutos antes
    onTokenExpiring: handleTokenExpiring,
    onTokenExpired: handleTokenExpired,
    enabled: isAuthenticated // Solo monitorear si está autenticado
  })

  const handleLogout = async () => {
  
    try {
   
      await logout()
    } catch (error) {
      console.error('❌ [NAVBAR] Error en logout:', error)

    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <>
      {/* Alerta de token próximo a expirar */}
      {showExpirationWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Alert variant="default" className="border-yellow-400 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800 font-semibold">
                Sesión próxima a expirar
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                Tu sesión expirará en menos de 5 minutos. Por favor guarda tu trabajo.
                Serás redirigido al login automáticamente cuando expire.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">SIGED Dashboard</h1>
                <p className="text-xs text-gray-500 hidden lg:block">Sistema Integrado de Gestión Educativa</p>
              </div>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-4">
            {/* Indicador JWT */}
          

            {/* Búsqueda */}
        

            {/* Notificaciones */}
           

            {/* Configuración */}
         

            {/* Botón de logout directo */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </Button>

            {/* Perfil del usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"/placeholder.svg"} alt={user?.nombre || "Usuario"} />
                    <AvatarFallback>
                      {user?.nombre
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant={
                          user?.rol === "super_admin" ? "destructive" : 
                          user?.rol === "admin" ? "default" : 
                          "secondary"
                        } 
                        className="text-xs flex items-center gap-1"
                      >
                        {user?.rol === "super_admin" && <Crown className="h-3 w-3" />}
                        {user?.rol === "admin" && <Shield className="h-3 w-3" />}
                        {user?.rol === "super_admin" ? "Super Admin" :
                         user?.rol === "admin" ? "Administrador" :
                         user?.rol === "gestor" ? "Gestor" : "Usuario"}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{user?.nombre}</p>
                      <Badge 
                        variant={
                          user?.rol === "super_admin" ? "destructive" : 
                          user?.rol === "admin" ? "default" : 
                          "secondary"
                        } 
                        className="text-xs flex items-center gap-1"
                      >
                        {user?.rol === "super_admin" && <Crown className="h-2 w-2" />}
                        {user?.rol === "admin" && <Shield className="h-2 w-2" />}
                        {user?.rol}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Autenticado con JWT</span>
                    </div>
                    <div className="text-xs text-gray-400 border-t pt-2">
                      ID: {user?.id}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Editar Perfil</span>
                </DropdownMenuItem>
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
      
      {/* Dialog de Edición de Perfil */}
      <UserProfileDialog 
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
      </header>
    </>
  )
}
