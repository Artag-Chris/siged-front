"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Phone,
  School,
  Edit,
  Clock,
  FileText,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import Link from "next/link" 
import { useGradeStore } from "@/lib/grade-store"
import { useInstitutionStore } from "@/lib/instituition-store"
import { TIPOS_DOCUMENTO, GRADOS_DISPONIBLES } from "@/dummyData"
import { useStudentStore } from "@/lib/student-store"

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string

  const { getStudent } = useStudentStore()
  const { getInstitution } = useInstitutionStore()
  const { getQuotaAssignmentsByStudent } = useGradeStore()

  const [student, setStudent] = useState<any>(null)
  const [institution, setInstitution] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])

  useEffect(() => {
    const loadData = () => {
      const studentData = getStudent(studentId)
      if (studentData) {
        setStudent(studentData)

        // Cargar institución si está asignada
        if (studentData.institucionAsignada) {
          const institutionData = getInstitution(studentData.institucionAsignada)
          setInstitution(institutionData || null)
        }

        // Cargar asignaciones de cupos
        const assignmentData = getQuotaAssignmentsByStudent(studentId)
        setAssignments(assignmentData || [])
      }
    }

    loadData()
  }, [studentId, getStudent, getInstitution, getQuotaAssignmentsByStudent])

  const getDocumentTypeLabel = (type: string) => {
    const docType = TIPOS_DOCUMENTO.find((t) => t.value === type)
    return docType ? docType.label : type
  }

  const getGradoLabel = (grado: string) => {
    const gradoObj = GRADOS_DISPONIBLES.find((g) => g.value === grado)
    return gradoObj ? gradoObj.label : grado
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      Activo: "bg-green-100 text-green-800",
      Pendiente: "bg-yellow-100 text-yellow-800",
      Trasladado: "bg-blue-100 text-blue-800",
      Retirado: "bg-red-100 text-red-800",
    }
    return colors[estado] || "bg-gray-100 text-gray-800"
  }

  const getJornadaLabel = (jornada: string) => {
    const labels: Record<string, string> = {
      mañana: "Mañana",
      tarde: "Tarde",
      unica: "Única",
      noche: "Noche",
    }
    return labels[jornada] || jornada
  }

  const getModalidadLabel = (modalidad: string) => {
    const labels: Record<string, string> = {
      nueva_matricula: "Nueva Matrícula",
      traslado: "Traslado",
      reintegro: "Reintegro",
    }
    return labels[modalidad] || modalidad
  }

  if (!student) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Estudiante no encontrado</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/estudiantes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.nombreCompleto}</h1>
              <p className="text-gray-600">
                {getDocumentTypeLabel(student.tipoDocumento)}: {student.numeroDocumento}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/estudiantes/${studentId}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Badge className={getEstadoColor(student.estado)}>{student.estado}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nombre Completo</p>
                      <p className="text-sm text-gray-900">{student.nombreCompleto}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Documento</p>
                      <p className="text-sm text-gray-900">
                        {getDocumentTypeLabel(student.tipoDocumento)} {student.numeroDocumento}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fecha de Nacimiento</p>
                      <p className="text-sm text-gray-900">{new Date(student.fechaNacimiento).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <School className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Grado Solicitado</p>
                      <p className="text-sm text-gray-900">{getGradoLabel(student.gradoSolicitado)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dirección de Residencia</p>
                      <p className="text-sm text-gray-900">{student.direccionResidencia}</p>
                    </div>
                  </div>

                  {student.telefonoContacto && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Teléfono de Contacto</p>
                        <p className="text-sm text-gray-900">{student.telefonoContacto}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información del Acudiente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Información del Acudiente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nombre del Acudiente</p>
                      <p className="text-sm text-gray-900">{student.nombreAcudiente}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Parentesco</p>
                      <p className="text-sm text-gray-900">{student.parentescoAcudiente}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Teléfono del Acudiente</p>
                      <p className="text-sm text-gray-900">{student.telefonoAcudiente}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asignación de Institución */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="h-5 w-5" />
                  <span>Asignación Educativa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.institucionAsignada && institution ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800">Institución Asignada</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm font-medium">Nombre de la institución:</p>
                          <p className="text-sm">{institution.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fecha de asignación:</p>
                          <p className="text-sm">
                            {student.fechaAsignacion
                              ? new Date(student.fechaAsignacion).toLocaleDateString()
                              : "No especificada"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Estado:</p>
                          <Badge className={getEstadoColor(student.estado)}>{student.estado}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dirección:</p>
                          <p className="text-sm">{institution.direccion}</p>
                        </div>
                      </div>
                    </div>

                    {/* Historial de asignaciones */}
                    {assignments.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Historial de Asignaciones</h3>
                        <div className="space-y-2">
                          {assignments.map((assignment) => (
                            <div key={assignment.id} className="border rounded-lg p-3 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">
                                    Grado {getGradoLabel(assignment.grado)}
                                    {assignment.grupo && ` - Grupo ${assignment.grupo}`}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Jornada: {getJornadaLabel(assignment.jornada)}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Modalidad: {getModalidadLabel(assignment.modalidadAsignacion)}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Fecha: {new Date(assignment.fechaAsignacion).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="outline">{new Date(assignment.fechaAsignacion).getFullYear()}</Badge>
                              </div>
                              {assignment.observaciones && (
                                <p className="text-xs text-gray-600 mt-2 border-t pt-1">{assignment.observaciones}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800">Este estudiante aún no tiene una institución asignada</p>
                    <Link href="/dashboard/asignacion-cupos">
                      <Button variant="outline" className="mt-2">
                        <School className="h-4 w-4 mr-2" />
                        Asignar Cupo
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observaciones */}
            {student.observaciones && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Observaciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-900">{student.observaciones}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Información Adicional */}
          <div className="space-y-6">
            {/* Resumen Rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <Badge className={getEstadoColor(student.estado)}>{student.estado}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grado:</span>
                  <span className="text-sm text-gray-900">{getGradoLabel(student.gradoSolicitado)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Institución:</span>
                  <span className="text-sm text-gray-900">{institution ? institution.nombre : "No asignada"}</span>
                </div>
                {student.fechaAsignacion && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fecha de asignación:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(student.fechaAsignacion).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/dashboard/estudiantes/${studentId}/editar`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                </Link>
                {student.estado === "Pendiente" && (
                  <Link href="/dashboard/asignacion-cupos">
                    <Button variant="outline" className="w-full justify-start">
                      <School className="h-4 w-4 mr-2" />
                      Asignar Cupo
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full justify-start" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Documentos
                </Button>
              </CardContent>
            </Card>

            {/* Historial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Historial</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignments.length > 0 ? (
                    assignments.map((assignment, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getModalidadLabel(assignment.modalidadAsignacion)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(assignment.fechaAsignacion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">No hay registros de historial</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
