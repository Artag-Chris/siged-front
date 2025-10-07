"use client"

import type React from "react"
import { useState } from "react"
import { useJwtAuth } from "@/hooks/useJwtAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState("")

  // Hook JWT con redirección automática
  const { 
    login, 
    user, 
    isLoading, 
    isAuthenticated, 
    error: authError,
    clearError 
  } = useJwtAuth({
    redirectIfAuthenticated: "/dashboard",
    autoInitialize: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()

    if (!email || !password) {
      setLocalError("Por favor completa todos los campos")
      return
    }

    if (!email.includes("@")) {
      setLocalError("Por favor ingresa un email válido")
      return
    }

    if (password.length < 3) {
      setLocalError("La contraseña debe tener al menos 3 caracteres")
      return
    }

    console.log('🔐 [LOGIN2] Iniciando proceso de login con JWT...');
    
    try {
      const success = await login(email, password)
      
      if (!success) {
        setLocalError("Credenciales incorrectas. Verifica tu email y contraseña.")
      }
      // Si success es true, el hook se encarga de la redirección automática
      
    } catch (error) {
      console.error("❌ [LOGIN2] Error al iniciar sesión:", error)
      setLocalError("Error al iniciar sesión. Intenta nuevamente.")
    }
  }

  // Mostrar loading mientras se inicializa o redirige
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  const displayError = localError || authError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión JWT</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al dashboard
            <br />
            <span className="text-xs text-blue-600 mt-1 block">
              Sistema de autenticación JWT real
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@facilcreditos.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  onClick={() => window.location.href = '/recuperar-contrasena'}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-2">Sistema JWT Activo:</p>
            <div className="space-y-1 text-xs text-blue-600">
              <p>✅ Autenticación real con API</p>
              <p>✅ Tokens JWT con refresh automático</p>
              <p>✅ Roles y permisos por usuario</p>
              <p className="text-orange-600 mt-2">
                <strong>Nota:</strong> Usa credenciales reales del sistema
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
