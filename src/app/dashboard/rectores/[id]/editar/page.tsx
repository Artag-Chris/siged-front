"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { Rector, RectorFormData } from "@/interfaces"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRectorStore } from "@/lib/principals-store"

export default function EditarRectorPage() {
  const params = useParams()
  const router = useRouter()
  const rectorId = params.id as string
  const { getRector, updateRector, isLoading } = useRectorStore()
  const { institutions } = useInstitutionStore()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [rector, setRector] = useState<Rector | null>(null)
  const [formData, setFormData] = useState<RectorFormData>({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    institucionId: "",
    fechaVinculacion: "",
    estado: "activa",
    experienciaAnios: 0,
    observaciones: "",
  })

  useEffect(() => {
    const rect = getRector(rectorId)
    if (rect) {
      setRector(rect)
      setFormData({
        nombres: rect.nombres,
        apellidos: rect.apellidos,
        cedula: rect.cedula,
        email: rect.email,
        telefono: rect.telefono,
        institucionId: rect.institucionId,
        fechaVinculacion: rect.fechaVinculacion,
        estado: rect.estado,
        experienciaAnios: rect.experienciaAnios,
        observaciones: rect.observaciones || "",
      })
    }
  }, [rectorId, getRector])

  const handleInputChange = (field: keyof RectorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validaciones básicas
    if (!formData.nombres || !formData.apellidos || !formData.cedula || !formData.email || !formData.institucionId) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    const success = await updateRector(rectorId, formData)

    if (success) {
      setSuccess("Rector actualizado exitosamente")
      setTimeout(() => {
        router.push(`/dashboard/rectores/${rectorId}`)
      }, 2000)
    } else {
      setError("Error al actualizar el rector. Intenta nuevamente.")
    }
  }

  if (!rector) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Rector no encontrado</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/rectores/${rectorId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Rector</h1>
              <p className="text-gray-600">
                {rector.nombres} {rector.apellidos}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos del rector</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                  placeholder="Ej: María Elena"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  placeholder="Ej: González Pérez"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange("cedula", e.target.value)}
                  placeholder="Ej: 12345678"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="rector@escuela.edu"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="3001234567"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Profesional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Profesional</CardTitle>
              <CardDescription>Datos relacionados con el cargo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institucionId">Institución *</Label>
                  <Select
                    value={formData.institucionId}
                    onValueChange={(value) => handleInputChange("institucionId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una institución" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions
                        .filter((inst) => inst.activa)
                        .map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="inactiva">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experienciaAnios">Años de Experiencia</Label>
                  <Input
                    id="experienciaAnios"
                    type="number"
                    min="0"
                    value={formData.experienciaAnios}
                    onChange={(e) => handleInputChange("experienciaAnios", Number.parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="fechaVinculacion">Fecha de Vinculación</Label>
                  <Input
                    id="fechaVinculacion"
                    type="date"
                    value={formData.fechaVinculacion}
                    onChange={(e) => handleInputChange("fechaVinculacion", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Información adicional sobre el rector..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Link href={`/dashboard/rectores/${rectorId}`}>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}