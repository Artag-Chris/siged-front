// app/navbar-test/page.tsx
// Página de prueba para el navbar con JWT

"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, Crown, Shield } from "lucide-react"

function NavbarTestContent() {
  const { user, hasRole, hasAnyRole } = useJwtAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Navbar JWT - Test de Funcionalidad
            </CardTitle>
            <CardDescription>
              Esta página verifica que el navbar funcione correctamente con el sistema JWT
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            <div className="grid gap-4 md:grid-cols-2">
              
              {/* Información del Usuario */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Información del Usuario en Navbar:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Nombre:</span>
                    <span className="font-medium">{user?.nombre}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Email:</span>
                    <span className="font-medium text-xs">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Rol:</span>
                    <Badge 
                      variant={
                        user?.rol === "super_admin" ? "destructive" : 
                        user?.rol === "admin" ? "default" : 
                        "secondary"
                      }
                      className="flex items-center gap-1"
                    >
                      {user?.rol === "super_admin" && <Crown className="h-3 w-3" />}
                      {user?.rol === "admin" && <Shield className="h-3 w-3" />}
                      {user?.rol}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">ID de Usuario:</span>
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{user?.id}</span>
                  </div>
                </div>
              </div>

              {/* Verificaciones de Funcionalidad */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Funcionalidades del Navbar:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Navbar visible con usuario autenticado</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Avatar con iniciales generadas</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Badge de rol con íconos correspondientes</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Indicador JWT activo</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Botón de logout funcional</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Instrucciones */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-700 mb-2">Instrucciones de Prueba:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>1. Verifica que el navbar muestre tu nombre y email correctamente</li>
                <li>2. Confirma que el badge de rol tenga el ícono correcto</li>
                <li>3. Haz clic en el avatar para ver el dropdown con información completa</li>
                <li>4. Observa el indicador "JWT Activo" en verde</li>
                <li>5. Prueba el botón de logout (te llevará al login)</li>
              </ul>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default function NavbarTestPage() {
  return (
    <ProtectedRoute>
      <NavbarTestContent />
    </ProtectedRoute>
  )
}