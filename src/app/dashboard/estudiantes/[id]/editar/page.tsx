"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  useStudentStore,
  type StudentFormData,
  TIPOS_DOCUMENTO,
  GRADOS_DISPONIBLES,
  PARENTESCOS,
  ESTADOS_ESTUDIANTE,
} from "@/lib/student-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Save, ArrowLeft, CalendarIcon } from "lucide-react"
import Link from "next/link"

export default function EditarEstudiantePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const { getStudent, updateStudent, getStudentByDocument, isLoading } = useStudentStore()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [student, setStudent] = useState<any>(null)

  const [formData, setFormData] = useState<StudentFormData>({
    nombreCompleto: "",
    tipoDocumento: "TI",
    numeroDocumento: "",
    fechaNacimiento: "",
    direccionResidencia: "",
    telefonoContacto: "",
    gradoSolicitado: "",
    nombreAcudiente: "",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "",
    observaciones: "",
  })

  const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>(undefined)
  const [estado, setEstado] = useState<string>("Pendiente")

  useEffect(() => {
    const studentData = getStudent(studentId)
    if (studentData) {
      setStudent(studentData)
      setFormData({
        nombreCompleto: studentData.nombreCompleto,
        tipoDocumento: studentData.tipoDocumento,
        numeroDocumento: studentData.numeroDocumento,
        fechaNacimiento: studentData.fechaNacimiento,
        direccionResidencia: studentData.direccionResidencia,
        telefonoContacto: studentData.telefonoContacto || "",
        gradoSolicitado: studentData.gradoSolicitado,
        nombreAcudiente: studentData.nombreAcudiente,
        parentescoAcudiente: studentData.parentescoAcudiente,
        telefonoAcudiente: studentData.telefonoAcudiente,
        observaciones: studentData.observaciones || "",
      })
      setEstado(studentData.estado)

      // Parsear fecha de nacimiento
      if (studentData.fechaNacimiento) {
        try {
          const parsedDate = parse(studentData.fechaNacimiento, "yyyy-MM-dd", new Date())
          setFechaNacimiento(parsedDate)
        } catch (error) {
          console.error("Error parsing date:", error)
        }
      }
    }
  }, [studentId, getStudent])

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validaciones básicas
    if (
      !formData.nombreCompleto ||
      !formData.tipoDocumento ||
      !formData.numeroDocumento ||
      !formData.fechaNacimiento ||
      !formData.direccionResidencia ||
      !formData.gradoSolicitado ||
      !formData.nombreAcudiente ||
      !formData.parentescoAcudiente ||
      !formData.telefonoAcudiente
    ) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    // Validar que el documento no esté duplicado (excepto el estudiante actual)
    const existingStudent = getStudentByDocument(formData.tipoDocumento, formData.numeroDocumento)
    if (existingStudent && existingStudent.id !== studentId) {
      setError(`Ya existe otro estudiante con el documento ${formData.tipoDocumento} ${formData.numeroDocumento}`)
      return
    }

    try {
      const updateData = {
        ...formData,
        estado,
      }

      const success = await updateStudent(studentId, updateData)

      if (success) {
        setSuccess("Estudiante actualizado exitosamente")
        setTimeout(() => {
          router.push(`/dashboard/estudiantes/${studentId}`)
        }, 2000)
      } else {
        setError("Error al actualizar el estudiante. Intenta nuevamente.")
      }
    } catch (error) {
      setError("Error al actualizar el estudiante. Intenta nuevamente.")
      console.error(error)
    }
  }

  if (!student) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Estudiante no encontrado</AlertDescription>
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
            <Link href={`/dashboard/estudiantes/${studentId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Estudiante</h1>
              <p className="text-gray-600">{student.nombreCompleto}</p>
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
              <CardDescription>Datos básicos del estudiante</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                <Input
                  id="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                  placeholder="Nombres y apellidos completos"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                <Select
                  value={formData.tipoDocumento}
                  onValueChange={(value) => handleInputChange("tipoDocumento", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="tipoDocumento">
                    <SelectValue placeholder="Seleccione tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_DOCUMENTO.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                <Input
                  id="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={(e) => handleInputChange("numeroDocumento", e.target.value)}
                  placeholder="Número de documento sin puntos ni espacios"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaNacimiento ? (
                        format(fechaNacimiento, "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaNacimiento}
                      onSelect={(date) => {
                        setFechaNacimiento(date)
                        if (date) {
                          handleInputChange("fechaNacimiento", format(date, "yyyy-MM-dd"))
                        }
                      }}
                      initialFocus
                      locale={es}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="estado">Estado *</Label>
                <Select value={estado} onValueChange={setEstado} disabled={isLoading}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_ESTUDIANTE.map((estadoOption) => (
                      <SelectItem key={estadoOption.value} value={estadoOption.value}>
                        {estadoOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="direccionResidencia">Dirección de Residencia *</Label>
                <Input
                  id="direccionResidencia"
                  value={formData.direccionResidencia}
                  onChange={(e) => handleInputChange("direccionResidencia", e.target.value)}
                  placeholder="Dirección completa"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="telefonoContacto">Teléfono de Contacto</Label>
                <Input
                  id="telefonoContacto"
                  value={formData.telefonoContacto}
                  onChange={(e) => handleInputChange("telefonoContacto", e.target.value)}
                  placeholder="Número de teléfono del estudiante (opcional)"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="gradoSolicitado">Grado Solicitado *</Label>
                <Select
                  value={formData.gradoSolicitado}
                  onValueChange={(value) => handleInputChange("gradoSolicitado", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="gradoSolicitado">
                    <SelectValue placeholder="Seleccione un grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADOS_DISPONIBLES.map((grado) => (
                      <SelectItem key={grado.value} value={grado.value}>
                        {grado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Información del Acudiente */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Acudiente</CardTitle>
              <CardDescription>Datos del acudiente o responsable del estudiante</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombreAcudiente">Nombre del Acudiente *</Label>
                <Input
                  id="nombreAcudiente"
                  value={formData.nombreAcudiente}
                  onChange={(e) => handleInputChange("nombreAcudiente", e.target.value)}
                  placeholder="Nombre completo del acudiente"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="parentescoAcudiente">Parentesco *</Label>
                <Select
                  value={formData.parentescoAcudiente}
                  onValueChange={(value) => handleInputChange("parentescoAcudiente", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="parentescoAcudiente">
                    <SelectValue placeholder="Seleccione parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARENTESCOS.map((parentesco) => (
                      <SelectItem key={parentesco.value} value={parentesco.value}>
                        {parentesco.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="telefonoAcudiente">Teléfono del Acudiente *</Label>
                <Input
                  id="telefonoAcudiente"
                  value={formData.telefonoAcudiente}
                  onChange={(e) => handleInputChange("telefonoAcudiente", e.target.value)}
                  placeholder="Número de teléfono del acudiente"
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones || ""}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Información adicional sobre el estudiante..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Link href={`/dashboard/estudiantes/${studentId}`}>
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
