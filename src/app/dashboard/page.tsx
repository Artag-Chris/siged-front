"use client"

import { useAuthStore } from "@/lib/auth-store"
import { useDocumentStore } from "@/lib/document-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, Clock, Shield, TrendingUp, UserPlus } from "lucide-react"
import Link from "next/link"
import { useProfessorStore } from "@/lib/profesor-store"

export default function DashboardPage() {
  /*
  esta seccion se modificara segun demanda por ahora se dejara asi
  no se si dejar que el store se encargue con alguna funcion para manejar stats o pedirlos directo del back
  por ahora diria que lo manejemos nosotros pero igual es mas optimo que el back haga la consulta
  */
  const { user } = useAuthStore()
  const { professors } = useProfessorStore()
  const { documents } = useDocumentStore()

  const stats = [
    {
      title: "Total Profesores",
      value: professors.length.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      href: "/dashboard/profesores",
    },
    {
      title: "Documentos",
      value: documents.length.toString(),
      change: "+8%",
      icon: FileText,
      color: "text-green-600",
      href: "/dashboard/profesores",
    },
    {
      title: "Profesores Activos",
      value: professors.filter((p) => p.estado === "activa").length.toString(),
      change: "+23%",
      icon: Activity,
      color: "text-purple-600",
      href: "/dashboard/profesores",
    },
    {
      title: "Promedio Experiencia",
      value:
        professors.length > 0
          ? `${Math.round(professors.reduce((sum, p) => sum + p.experienciaAnios, 0) / professors.length)} años`
          : "0 años",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600",
      href: "/dashboard/profesores",
    },
  ]

  const recentActivity = [
    { action: "Nuevo profesor registrado", time: "Hace 2 minutos", user: "Juan Pérez" },
    { action: "Documento subido", time: "Hace 15 minutos", user: "María García" },
    { action: "Profesor actualizado", time: "Hace 1 hora", user: user?.name || "Admin" },
    { action: "Nueva evaluación completada", time: "Hace 2 horas", user: "Carlos López" },
  ]

  const quickActions = [
    {
      title: "Agregar Profesor",
      description: "Registrar un nuevo profesor en el sistema",
      href: "/dashboard/profesores/agregar",
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      title: "Ver Profesores",
      description: "Gestionar lista completa de profesores",
      href: "/dashboard/profesores",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Documentos",
      description: "Revisar documentos subidos",
      href: "/dashboard/profesores",
      icon: FileText,
      color: "bg-purple-500",
    },
  ]

  return (
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
                      {user?.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {user && user.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.permissions.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Link key={index} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
              </Link>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Accesos directos a funciones principales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{action.title}</p>
                          <p className="text-xs text-gray-500">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
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
                  {recentActivity.map((activity, index) => (
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

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Sistema</CardTitle>
                <CardDescription>Información general del sistema</CardDescription>
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
  )
}
