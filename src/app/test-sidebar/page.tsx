// app/test-sidebar/page.tsx
// Página para probar el sidebar actualizado

"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, UserPlus, Shield, Navigation } from "lucide-react"

function TestSidebarContent() {
  const { user } = useJwtAuth()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Test del Sidebar Actualizado
            </CardTitle>
            <CardDescription>
              Verificación de las rutas actualizadas en el menú lateral
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Usuario Actual */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Usuario Actual:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                    <span className="text-sm">Nombre:</span>
                    <span className="font-medium">{user?.nombre}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                    <span className="text-sm">Rol:</span>
                    <Badge variant="default">{user?.rol}</Badge>
                  </div>
                </div>
              </div>

              {/* Cambios en el Sidebar */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Cambios en el Sidebar:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">❌ "Usuario Inicial" removido</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">✅ "Crear Usuario" agregado</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">✅ "Lista de Usuarios" actualizado</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Rutas del Menú */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-4">Rutas Actualizadas en el Menú:</h3>
              <div className="grid gap-3 md:grid-cols-2">
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Lista de Usuarios</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ruta: <code className="bg-white px-1 rounded">/dashboard/usuarios</code>
                  </p>
                  <p className="text-xs text-gray-500">
                    Muestra todos los usuarios con filtros y paginación
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <UserPlus className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Crear Usuario</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Ruta: <code className="bg-white px-1 rounded">/dashboard/usuarios/crear</code>
                  </p>
                  <p className="text-xs text-gray-500">
                    Formulario para crear usuarios con autenticación JWT
                  </p>
                </div>

              </div>
            </div>

            {/* Información Técnica */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-700 mb-2">Información Técnica:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Sidebar actualizado en: <code>/src/interfaces/navbarItems/menuItems.tsx</code></li>
                <li>• Nuevo endpoint: <code>POST /api/usuario</code></li>
                <li>• Autenticación: JWT en headers Authorization</li>
                <li>• Formulario mejorado con validaciones client-side</li>
              </ul>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default function TestSidebarPage() {
  return (
    <ProtectedRoute>
      <TestSidebarContent />
    </ProtectedRoute>
  )
}