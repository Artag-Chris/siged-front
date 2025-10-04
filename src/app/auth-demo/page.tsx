// app/auth-demo/page.tsx
// Página de demostración del sistema de autenticación JWT

"use client"

import Link from "next/link"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  LogIn, 
  Eye, 
  Lock, 
  User, 
  Crown,
  ArrowRight,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function AuthDemoPage() {
  const { user, isAuthenticated, logout, hasRole, hasAnyRole } = useJwtAuth()

  const handleLogout = async () => {
    await logout()
  }

  const routes = [
    {
      path: "/login",
      title: "Login JWT",
      description: "Página de inicio de sesión con autenticación JWT real",
      icon: LogIn,
      requiresAuth: false,
      requiredRole: null,
      accessible: true
    },
    {
      path: "/protected-test",
      title: "Página Protegida",
      description: "Página que requiere autenticación básica",
      icon: Eye,
      requiresAuth: true,
      requiredRole: null,
      accessible: isAuthenticated
    },
    {
      path: "/admin-only",
      title: "Solo Administradores",
      description: "Página que requiere rol de administrador",
      icon: Crown,
      requiresAuth: true,
      requiredRole: "admin",
      accessible: isAuthenticated && hasAnyRole(['admin', 'super_admin'])
    },
    {
      path: "/dashboard",
      title: "Dashboard Principal",
      description: "Panel principal del sistema",
      icon: Shield,
      requiresAuth: true,
      requiredRole: null,
      accessible: isAuthenticated
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Autenticación JWT
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demostración del sistema de protección de rutas con autenticación JWT 
            y verificación de roles granular.
          </p>
        </div>

        {/* Auth Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Estado de Autenticación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="default" className="text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Autenticado
                  </Badge>
                  <div>
                    <p className="font-medium">{user?.nombre}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Badge 
                    variant={user?.rol === 'super_admin' ? 'destructive' : 
                            user?.rol === 'admin' ? 'default' : 'secondary'}
                  >
                    {user?.rol}
                  </Badge>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    <XCircle className="h-3 w-3 mr-1" />
                    No Autenticado
                  </Badge>
                  <span className="text-gray-600">Inicia sesión para acceder a contenido protegido</span>
                </div>
                <Link href="/login2">
                  <Button size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Routes Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Card key={route.path} className={`transition-all duration-200 hover:shadow-md ${
                route.accessible ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${
                      route.accessible ? 'text-green-600' : 'text-red-500'
                    }`} />
                    {route.title}
                    {route.accessible ? (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    ) : (
                      <Lock className="h-4 w-4 text-red-500 ml-auto" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {route.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    
                    {/* Requirements */}
                    <div className="text-sm">
                      <p className="font-medium text-gray-700 mb-1">Requisitos:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2">
                          {route.requiresAuth ? (
                            isAuthenticated ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )
                          ) : (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          <span className={route.requiresAuth ? 
                            (isAuthenticated ? 'text-green-700' : 'text-red-600') : 
                            'text-green-700'
                          }>
                            {route.requiresAuth ? 'Autenticación requerida' : 'Acceso público'}
                          </span>
                        </li>
                        
                        {route.requiredRole && (
                          <li className="flex items-center gap-2">
                            {hasAnyRole(['admin', 'super_admin']) ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className={hasAnyRole(['admin', 'super_admin']) ? 
                              'text-green-700' : 'text-red-600'
                            }>
                              Rol: {route.requiredRole}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {route.accessible ? (
                        <Link href={route.path}>
                          <Button className="w-full" size="sm">
                            Acceder
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" size="sm" variant="outline" disabled>
                          Acceso Denegado
                          <Lock className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Características JWT:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✅ Autenticación con API real</li>
                  <li>✅ Tokens con renovación automática</li>
                  <li>✅ Persistencia en localStorage</li>
                  <li>✅ Redirecciones automáticas</li>
                  <li>✅ Verificación granular de roles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Componentes Integrados:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• <code>useJwtAuth</code> - Hook personalizado</li>
                  <li>• <code>ProtectedRoute</code> - Componente de protección</li>
                  <li>• <code>jwt-auth-store</code> - Store de Zustand</li>
                  <li>• <code>jwt-auth.service</code> - Servicio de autenticación</li>
                  <li>• <code>jwt-api.service</code> - Cliente HTTP con interceptores</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}