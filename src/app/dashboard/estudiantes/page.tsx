"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Users, Search, Eye, Edit, School } from "lucide-react"
import Link from "next/link"
import { useInstitutionStore } from "@/lib/instituition-store"
import { TIPOS_DOCUMENTO, ESTADOS_ESTUDIANTE } from "@/dummyData"
import { useStudentStore } from "@/lib/student-store"
import { getEstadoColor } from "@/funtions"
import { getDocumentTypeLabel } from "@/funtions/document"


export default function EstudiantesPage() {
  const { students } = useStudentStore()
  const { institutions } = useInstitutionStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [filterGrado, setFilterGrado] = useState<string>("todos")

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalStudents = students.length
    const activeStudents = students.filter((s) => s.estado === "Activo").length
    const pendingStudents = students.filter((s) => s.estado === "Pendiente").length
    const transferredStudents = students.filter((s) => s.estado === "Trasladado").length
    const retiredStudents = students.filter((s) => s.estado === "Retirado").length

    return {
      total: totalStudents,
      active: activeStudents,
      pending: pendingStudents,
      transferred: transferredStudents,
      retired: retiredStudents,
    }
  }, [students])

  // Estudiantes filtrados
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.numeroDocumento.includes(searchTerm) ||
        student.nombreAcudiente.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === "todos" || student.estado === filterEstado
      const matchesGrado = filterGrado === "todos" || student.gradoSolicitado === filterGrado

      return matchesSearch && matchesEstado && matchesGrado
    })
  }, [students, searchTerm, filterEstado, filterGrado])

  const getInstitutionName = (id?: string) => {
    if (!id) return "No asignada"
    const institution = institutions.find((i) => i.id === id)
    return institution ? institution.nombre : "Desconocida"
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
            <p className="text-gray-600">Administra la información de los estudiantes</p>
          </div>
          <Link href="/dashboard/estudiantes/agregar">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Estudiante
            </Button>
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-green-600">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Activos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-yellow-600">
                    {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pendientes</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trasladados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.transferred}</p>
                  <p className="text-xs text-blue-600">
                    {stats.total > 0 ? Math.round((stats.transferred / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Trasladados</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Retirados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.retired}</p>
                  <p className="text-xs text-red-600">
                    {stats.total > 0 ? Math.round((stats.retired / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge className="bg-red-100 text-red-800">Retirados</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudiantes</CardTitle>
            <CardDescription>
              Información detallada de todos los estudiantes registrados ({filteredStudents.length} resultados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, documento o acudiente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {ESTADOS_ESTUDIANTE.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterGrado} onValueChange={setFilterGrado}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Transición">Transición</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((grado) => (
                      <SelectItem key={grado} value={grado.toString()}>
                        {grado}°
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{student.nombreCompleto}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <span>
                              {getDocumentTypeLabel(student.tipoDocumento, TIPOS_DOCUMENTO)}: {student.numeroDocumento}
                            </span>
                            <span>•</span>
                            <span>Grado: {student.gradoSolicitado}</span>
                            <span>•</span>
                            <span>Acudiente: {student.nombreAcudiente}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <School className="h-3 w-3" />
                            <span>{getInstitutionName(student.institucionAsignada)}</span>
                            {student.fechaAsignacion && (
                              <>
                                <span>•</span>
                                <span>Asignado: {new Date(student.fechaAsignacion).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Badge className={getEstadoColor(student.estado)}>{student.estado}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/estudiantes/${student.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>
                      <Link href={`/dashboard/estudiantes/${student.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron estudiantes que coincidan con los filtros</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
