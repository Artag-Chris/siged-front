"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Lock } from "lucide-react"

import { TIPOS_DOCUMENTO_CONDUCTOR } from "@/dummyData/dummyConductores"
import { useConductorStore } from "@/lib/conductor-store"

export default function ConductorLogin() {
  const router = useRouter()
  const { getConductorByDocument } = useConductorStore()

  const [tipoDocumento, setTipoDocumento] = useState("")
  const [numeroDocumento, setNumeroDocumento] = useState("")
  const [licencia, setLicencia] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!tipoDocumento || !numeroDocumento || !licencia) {
      setError("Todos los campos son obligatorios")
      return
    }

    setIsLoading(true)

    try {
      // Simular delay de verificación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const conductor = getConductorByDocument(tipoDocumento, numeroDocumento)

      if (!conductor) {
        setError("No se encontró un conductor con los datos proporcionados")
        setIsLoading(false)
        return
      }

      if (conductor.licenciaConducir !== licencia) {
        setError("El número de licencia no coincide")
        setIsLoading(false)
        return
      }

      // Guardar ID del conductor en sessionStorage para simular una sesión
      sessionStorage.setItem("conductorId", conductor.id)

      // Redirigir al dashboard del conductor
      router.push(`/transporte/conductores/dashboard/${conductor.id}`)
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Ocurrió un error al intentar iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acceso de Conductores</CardTitle>
          <CardDescription>Ingrese sus datos para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipoDocumento">Tipo de documento</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger id="tipoDocumento">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO_CONDUCTOR.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroDocumento" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Número de documento
              </Label>
              <Input
                id="numeroDocumento"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ingrese su número de documento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licencia" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Número de licencia
              </Label>
              <Input
                id="licencia"
                value={licencia}
                onChange={(e) => setLicencia(e.target.value)}
                placeholder="Ingrese su número de licencia"
                type="password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Ingresar"}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>
                ¿No tiene cuenta?{" "}
                <a href="/transporte/conductores/registro" className="text-blue-600 hover:underline">
                  Registrarse
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
