"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import { UsersManagementTable } from "@/components/users-management-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Crown, Settings, Users, Database, UserCog } from "lucide-react"

function AdminContent() {
  const { user } = useJwtAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            
            {/* Botón Editar Perfil */}
            <UserProfileDialog 
              trigger={
                <Button variant="outline" size="sm">
                  <UserCog className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-sm">
              <Crown className="h-3 w-3 mr-1" />
              Solo Administradores
            </Badge>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-600">
              Bienvenido, {user?.nombre} ({user?.rol})
            </span>
          </div>
        </div>

        {/* Admin Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administrar usuarios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Usuarios Activos:</span>
                  <span className="font-medium">142</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Administradores:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gestores:</span>
                  <span className="font-medium">23</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                Gestionar Usuarios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Base de Datos
              </CardTitle>
              <CardDescription>
                Configuración y mantenimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Tamaño DB:</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Último Backup:</span>
                  <span className="font-medium">Hoy</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estado:</span>
                  <Badge variant="default" className="text-xs">Activa</Badge>
                </div>
              </div>
              <Button className="w-full" size="sm" variant="outline">
                Ver Detalles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Configuración
              </CardTitle>
              <CardDescription>
                Ajustes del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>JWT Expiration:</span>
                  <span className="font-medium">1h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>API Status:</span>
                  <Badge variant="default" className="text-xs">Online</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Modo:</span>
                  <span className="font-medium">Producción</span>
                </div>
              </div>
              <Button className="w-full" size="sm" variant="outline">
                Configurar
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Users Management Table */}
        <div className="mt-8">
          <UsersManagementTable />
        </div>

        {/* Access Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información de Acceso</CardTitle>
            <CardDescription>
              Esta página está protegida por el componente ProtectedRoute con rol 'admin'
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Roles con Acceso:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✅ super_admin</li>
                  <li>✅ admin</li>
                  <li>❌ gestor</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tu Información:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><strong>Nombre:</strong> {user?.nombre}</li>
                  <li><strong>Email:</strong> {user?.email}</li>
                  <li><strong>Rol:</strong> {user?.rol}</li>
                  <li><strong>ID:</strong> {user?.id}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default function AdminOnlyPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  )
}