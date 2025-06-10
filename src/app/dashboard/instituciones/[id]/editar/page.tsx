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
import { Checkbox } from "@/components/ui/checkbox"
import { Save, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { useInstitutionStore } from "@/lib/instituition-store"
import { ZONAS_DISPONIBLES, COMUNAS_DISPONIBLES, JORNADAS_DISPONIBLES } from "@/dummyData"
import { Institution, InstitutionFormData } from "@/interfaces/Institution"

export default function EditarInstitucionPage() {
  const params = useParams()
  const router = useRouter()
  const institutionId = params.id as string
  const { getInstitution, updateInstitution, isLoading } = useInstitutionStore()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [formData, setFormData] = useState<InstitutionFormData>({
    nombre: "",
    codigoDane: "",
    direccion: "",
    telefono: "",
    email: "",
    rector: "",
    zona: "urbana",
    comuna: "",
    jornadas: [],
    activa: true,
    observaciones: "",
  })

  useEffect(() => {
    const inst = getInstitution(institutionId)
    if (inst) {
      setInstitution(inst)
      setFormData({
        nombre: inst.nombre,
        codigoDane: inst.codigoDane || "",
        direccion: inst.direccion,
        telefono: inst.telefono || "",
        email: inst.email || "",
        rector: inst.rector || "",
        zona: inst.zona,
        comuna: inst.comuna,
        jornadas: inst.jornadas,
        activa: inst.activa,
        observaciones: inst.observaciones || "",
      })
    }
  }, [institutionId, getInstitution])

  const handleInputChange = (field: keyof InstitutionFormData, value: any) => {
    setFormData((prev:any) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleJornadaToggle = (jornada: "mañana" | "tarde" | "unica") => {
    setFormData((prev:any) => ({
      ...prev,
      jornadas: prev.jornadas.includes(jornada)
        ? prev.jornadas.filter((j:any) => j !== jornada)
        : [...prev.jornadas, jornada],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validaciones básicas
    if (!formData.nombre || !formData.direccion || !formData.comuna) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    if (formData.jornadas.length === 0) {
      setError("Debe seleccionar al menos una jornada")
      return
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    const success = await updateInstitution(institutionId, formData)

    if (success) {
      setSuccess("Institución actualizada exitosamente")
      setTimeout(() => {
        router.push(`/dashboard/instituciones/${institutionId}`)
      }, 2000)
    } else {
      setError("Error al actualizar la institución. Intenta nuevamente.")
    }
  }

  if (!institution) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Institución no encontrada</AlertDescription>
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
            <Link href={`/dashboard/instituciones/${institutionId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Institución</h1>
              <p className="text-gray-600">{institution.nombre}</p>
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
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Datos principales de la institución</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombre">Nombre de la Institución *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ej: I.E. San Judas Tadeo"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="codigoDane">Código DANE</Label>
                <Input
                  id="codigoDane"
                  value={formData.codigoDane}
                  onChange={(e) => handleInputChange("codigoDane", e.target.value)}
                  placeholder="Ej: 105001000123"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono de Contacto</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="Ej: 6045551234"
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  placeholder="Calle, número, barrio"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contacto@institucion.edu.co"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="rector">Rector / Encargado</Label>
                <Input
                  id="rector"
                  value={formData.rector}
                  onChange={(e) => handleInputChange("rector", e.target.value)}
                  placeholder="Nombre del rector o encargado"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Territorial y Operativa */}
          <Card>
            <CardHeader>
              <CardTitle>Información Territorial y Operativa</CardTitle>
              <CardDescription>Ubicación y configuración operativa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zona">Zona *</Label>
                  <Select value={formData.zona} onValueChange={(value) => handleInputChange("zona", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONAS_DISPONIBLES.map((zona:any) => (
                        <SelectItem key={zona.value} value={zona.value}>
                          {zona.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="comuna">Comuna / Corregimiento *</Label>
                  <Select value={formData.comuna} onValueChange={(value) => handleInputChange("comuna", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMUNAS_DISPONIBLES.map((comuna:any) => (
                        <SelectItem key={comuna} value={comuna}>
                          {comuna}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Jornadas */}
              <div>
                <Label>Jornadas *</Label>
                <div className="mt-2 space-y-2">
                  {JORNADAS_DISPONIBLES.map((jornada:any) => (
                    <div key={jornada.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={jornada.value}
                        checked={formData.jornadas.includes(jornada.value as any)}
                        onCheckedChange={() => handleJornadaToggle(jornada.value as any)}
                      />
                      <Label htmlFor={jornada.value} className="text-sm font-normal">
                        {jornada.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.jornadas.map((jornada:any) => (
                    <Badge key={jornada} variant="default" className="text-xs">
                      {jornada.charAt(0).toUpperCase() + jornada.slice(1)}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleJornadaToggle(jornada)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activa"
                  checked={formData.activa}
                  onCheckedChange={(checked) => handleInputChange("activa", checked)}
                />
                <Label htmlFor="activa">Institución activa</Label>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Información adicional sobre la institución..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Link href={`/dashboard/instituciones/${institutionId}`}>
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
