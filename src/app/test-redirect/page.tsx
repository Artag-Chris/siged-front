// app/test-redirect/page.tsx
// Página de prueba para verificar redirecciones sin bucles

"use client"

import { useJwtAuth } from "@/hooks/useJwtAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export default function TestRedirectPage() {
  const { user, isAuthenticated, isLoading, logout } = useJwtAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Test de Redirecciones - Sin Bucles
            </CardTitle>
            <CardDescription>
              Esta página usa useJwtAuth SIN redirecciones automáticas para evitar bucles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-medium">Sin Bucles de Redirección</span>
                </div>
                <Badge variant="default" className="text-xs">Solucionado</Badge>
              </div>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                    <div>
                      <p className="font-medium text-blue-700">Usuario Autenticado</p>
                      <p className="text-sm text-blue-600">{user?.nombre} - {user?.rol}</p>
                    </div>
                    <Button onClick={handleLogout} size="sm" variant="outline">
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">No Autenticado</span>
                  </div>
                  <p className="text-sm text-orange-600">Esta página es accesible sin autenticación</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h4 className="font-medium mb-2">Información Técnica:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hook configurado SIN redirectTo ni redirectIfAuthenticated</li>
                  <li>• No genera bucles de redirección</li>
                  <li>• Puede ser usado en páginas públicas o mixtas</li>
                  <li>• ProtectedRoute maneja redirecciones manualmente</li>
                </ul>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}