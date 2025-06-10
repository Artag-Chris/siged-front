"use client"

import { useDocumentStore } from "@/lib/document-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Users, Search, Eye, FileText, Activity, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useProfessorStore } from "@/lib/profesor-store"
import { recentActivityProfessors } from "@/interfaces/Professor"

export default function ProfesoresPage() {
  const { professors } = useProfessorStore()
  const { documents } = useDocumentStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [filterNivel, setFilterNivel] = useState<string>("todos")

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalProfessors = professors.length
    const activeProfessors = professors.filter((p) => p.estado === "activa").length
    const inactiveProfessors = professors.filter((p) => p.estado === "inactiva").length
    const totalDocuments = documents.length
    const avgExperience =
      professors.length > 0
        ? Math.round(professors.reduce((sum, p) => sum + p.experienciaAnios, 0) / professors.length)
        : 0

    return {
      total: totalProfessors,
      active: activeProfessors,
      inactive: inactiveProfessors,
      documents: totalDocuments,
      avgExperience,
    }
  }, [professors, documents])

  // Profesores filtrados
  const filteredProfessors = useMemo(() => {
    return professors.filter((professor) => {
      const matchesSearch =
        professor.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.cedula.includes(searchTerm) ||
        professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.cargo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === "todos" || professor.estado === filterEstado
      const matchesNivel = filterNivel === "todos" || professor.nivelEducativo === filterNivel

      return matchesSearch && matchesEstado && matchesNivel
    })
  }, [professors, searchTerm, filterEstado, filterNivel])


  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
            <p className="text-gray-600">Administra la información de los profesores</p>
          </div>
          <Link href="/dashboard/profesores/agregar">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Profesor
            </Button>
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profesores</p>
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
                  <p className="text-sm font-medium text-gray-600">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                  <p className="text-xs text-gray-600">
                    {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge variant="secondary">Inactivos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
                  <p className="text-xs text-blue-600">Total subidos</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Experiencia Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgExperience}</p>
                  <p className="text-xs text-orange-600">años</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de profesores */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Profesores</CardTitle>
                <CardDescription>
                  Información detallada de todos los profesores registrados ({filteredProfessors.length} resultados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros y búsqueda */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, cédula, email o cargo..."
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
                        <SelectItem value="activa">Activos</SelectItem>
                        <SelectItem value="inactiva">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterNivel} onValueChange={setFilterNivel}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los niveles</SelectItem>
                        <SelectItem value="preescolar">Preescolar</SelectItem>
                        <SelectItem value="basica_primaria">Básica Primaria</SelectItem>
                        <SelectItem value="basica_secundaria">Básica Secundaria</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="superior">Superior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredProfessors.map((professor) => (
                    <div key={professor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {professor.nombres} {professor.apellidos}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {professor.cargo} • {professor.email} • Cédula: {professor.cedula}
                              </p>
                              <p className="text-xs text-gray-500">
                                {professor.experienciaAnios} años de experiencia • Nivel:{" "}
                                {professor.nivelEducativo.replace("_", " ")}
                              </p>
                            </div>
                            <Badge variant={professor.estado === "activa" ? "default" : "secondary"}>
                              {professor.estado}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {professor.materiasAsignadas.slice(0, 3).map((materia) => (
                              <Badge key={materia} variant="outline" className="text-xs">
                                {materia}
                              </Badge>
                            ))}
                            {professor.materiasAsignadas.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{professor.materiasAsignadas.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/profesores/${professor.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Perfil
                            </Button>
                          </Link>
                          <Link href={`/dashboard/profesores/${professor.id}/editar`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredProfessors.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron profesores que coincidan con los filtros</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar con actividad reciente */}
          <div className="lg:col-span-1">
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
                  {recentActivityProfessors.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
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
          </div>
        </div>
      </div>
    </div>
  )
}
