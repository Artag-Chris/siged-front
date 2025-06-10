"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield } from "lucide-react"
import { stats, userActivities } from "@/dummyData/dummyDashboard"

export default function DashboardPage() {
  /* 
  este componente estara suceptible a muchos cambios por ahora se queda asi pero debera tener informacion general
  */
  const { user } = useAuthStore()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h2>
              <p className="text-gray-600">
                Departamento: {user?.department} • Último acceso: {new Date(user?.lastLogin || "").toLocaleDateString()}
              </p>
            </div>

            {/* User Info Card */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Información del Usuario</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rol</p>
                      <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
                        {user?.role === "admin" ? "Administrador" : "Usuario"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Departamento</p>
                      <p className="text-sm text-gray-900">{user?.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Permisos</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user?.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} vs mes anterior</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Actividad Reciente</span>
                  </CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivities(user).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información del Sistema</CardTitle>
                  <CardDescription>Estado actual del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Estado del Servidor</span>
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Base de Datos</span>
                      <Badge className="bg-blue-100 text-blue-800">Conectada</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Backup</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Programado</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">Última actualización</span>
                      <span className="text-sm text-gray-600">Hace 1 día</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
