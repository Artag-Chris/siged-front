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
import { CARGOS_DISPONIBLES, MATERIAS_DISPONIBLES, Professor, ProfessorFormData } from "@/interfaces/Professor"
import { useProfessorStore } from "@/lib/profesor-store"

export default function EditarProfesorPage() {
  const params = useParams()
  const router = useRouter()
  const professorId = params.id as string
  const { getProfessor, updateProfessor, isLoading } = useProfessorStore()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [formData, setFormData] = useState<ProfessorFormData>({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    cargo: "",
    estado: "activa",
    nivelEducativo: "basica_primaria",
    materias: [],
    materiasAsignadas: [],
    institucionGraduacion: "",
    fechaVinculacion: "",
    fechaNacimiento: "",
    direccion: "",
    experienciaAnios: 0,
    observaciones: "",
  })

  useEffect(() => {
    const prof = getProfessor(professorId)
    if (prof) {
      setProfessor(prof)
      setFormData({
        nombres: prof.nombres,
        apellidos: prof.apellidos,
        cedula: prof.cedula,
        email: prof.email,
        telefono: prof.telefono,
        cargo: prof.cargo,
        estado: prof.estado,
        nivelEducativo: prof.nivelEducativo,
        materias: prof.materias,
        materiasAsignadas: prof.materiasAsignadas,
        institucionGraduacion: prof.institucionGraduacion,
        fechaVinculacion: prof.fechaVinculacion,
        fechaNacimiento: prof.fechaNacimiento,
        direccion: prof.direccion,
        experienciaAnios: prof.experienciaAnios,
        observaciones: prof.observaciones || "",
      })
    }
  }, [professorId, getProfessor])

  const handleInputChange = (field: keyof ProfessorFormData, value: any) => {
    setFormData((prev:any) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleMateriaToggle = (materia: string, field: "materias" | "materiasAsignadas") => {
    setFormData((prev:any) => ({
      ...prev,
      [field]: prev[field].includes(materia) ? prev[field].filter((m:any) => m !== materia) : [...prev[field], materia],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validaciones básicas
    if (!formData.nombres || !formData.apellidos || !formData.cedula || !formData.email) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    if (formData.materias.length === 0) {
      setError("Debe seleccionar al menos una materia")
      return
    }

    const success = await updateProfessor(professorId, formData)

    if (success) {
      setSuccess("Profesor actualizado exitosamente")
      setTimeout(() => {
        router.push(`/dashboard/profesores/${professorId}`)
      }, 2000)
    } else {
      setError("Error al actualizar el profesor. Intenta nuevamente.")
    }
  }

  if (!professor) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Profesor no encontrado</AlertDescription>
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
            <Link href={`/dashboard/profesores/${professorId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Profesor</h1>
              <p className="text-gray-600">
                {professor.nombres} {professor.apellidos}
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
              <CardDescription>Datos básicos del profesor</CardDescription>
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
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
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
                  placeholder="profesor@escuela.edu"
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

              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  placeholder="Calle 123 #45-67, Ciudad"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Académica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
              <CardDescription>Datos profesionales y académicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select value={formData.cargo} onValueChange={(value) => handleInputChange("cargo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARGOS_DISPONIBLES.map((cargo) => (
                        <SelectItem key={cargo} value={cargo}>
                          {cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
                  <Select
                    value={formData.nivelEducativo}
                    onValueChange={(value) => handleInputChange("nivelEducativo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preescolar">Preescolar</SelectItem>
                      <SelectItem value="basica_primaria">Básica Primaria</SelectItem>
                      <SelectItem value="basica_secundaria">Básica Secundaria</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
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

                <div>
                  <Label htmlFor="institucionGraduacion">Institución de Graduación</Label>
                  <Input
                    id="institucionGraduacion"
                    value={formData.institucionGraduacion}
                    onChange={(e) => handleInputChange("institucionGraduacion", e.target.value)}
                    placeholder="Universidad o institución"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Materias */}
              <div>
                <Label>Materias que puede enseñar *</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MATERIAS_DISPONIBLES.map((materia) => (
                    <Badge
                      key={materia}
                      variant={formData.materias.includes(materia) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleMateriaToggle(materia, "materias")}
                    >
                      {materia}
                      {formData.materias.includes(materia) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Materias Asignadas */}
              <div>
                <Label>Materias Asignadas Actualmente</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.materias.map((materia:any) => (
                    <Badge
                      key={materia}
                      variant={formData.materiasAsignadas.includes(materia) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleMateriaToggle(materia, "materiasAsignadas")}
                    >
                      {materia}
                      {formData.materiasAsignadas.includes(materia) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Información adicional sobre el profesor..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Link href={`/dashboard/profesores/${professorId}`}>
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
