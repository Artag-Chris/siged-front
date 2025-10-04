// app/protected-test/page.tsx
// Página de prueba para el ProtectedRoute con JWT

"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, User, Crown } from "lucide-react"

function ProtectedContent() {
  const { user, logout, hasRole, hasAnyRole } = useJwtAuth()

  const handleLogout = async () => {
    console.log('🔓 [PROTECTED-TEST] Cerrando sesión...')
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Información del Usuario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Usuario JWT
              </CardTitle>
              <CardDescription>
                Datos obtenidos del sistema de autenticación JWT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-lg">{user?.nombre}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{user?.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Rol</p>
                <Badge 
                  variant={user?.rol === 'super_admin' ? 'destructive' : 
                          user?.rol === 'admin' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {user?.rol === 'super_admin' && <Crown className="h-3 w-3 mr-1" />}
                  {user?.rol === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                  {user?.rol}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">ID de Usuario</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">{user?.id}</p>
              </div>

              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>

          {/* Verificaciones de Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verificaciones de Roles
              </CardTitle>
              <CardDescription>
                Pruebas de autorización con diferentes roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Verificaciones Individuales:</p>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">¿Es Super Admin?</span>
                  <Badge variant={hasRole('super_admin') ? 'default' : 'secondary'}>
                    {hasRole('super_admin') ? 'Sí' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">¿Es Admin?</span>
                  <Badge variant={hasRole('admin') ? 'default' : 'secondary'}>
                    {hasRole('admin') ? 'Sí' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">¿Es Gestor?</span>
                  <Badge variant={hasRole('gestor') ? 'default' : 'secondary'}>
                    {hasRole('gestor') ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Verificaciones Múltiples:</p>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">¿Admin o Super Admin?</span>
                  <Badge variant={hasAnyRole(['admin', 'super_admin']) ? 'default' : 'secondary'}>
                    {hasAnyRole(['admin', 'super_admin']) ? 'Sí' : 'No'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">¿Cualquier rol administrativo?</span>
                  <Badge variant={hasAnyRole(['admin', 'super_admin', 'gestor']) ? 'default' : 'secondary'}>
                    {hasAnyRole(['admin', 'super_admin', 'gestor']) ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  ✅ <strong>Página Protegida Accesible</strong>
                  <br />
                  El componente ProtectedRoute está funcionando correctamente con JWT.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default function ProtectedTestPage() {
  return (
    <ProtectedRoute>
      <ProtectedContent />
    </ProtectedRoute>
  )
}