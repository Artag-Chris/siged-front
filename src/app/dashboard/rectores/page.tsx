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

import { Institution } from "@/interfaces/Institution"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRectorStore } from "@/lib/principals-store"
import { recentActivityRectores } from "@/interfaces/principals"


export default function RectoresPage() {
  const { rectores } = useRectorStore()
  const { institutions } = useInstitutionStore()
  const { documents } = useDocumentStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")

  // Función para obtener nombre de institución
  const getInstitutionName = (id: string): string => {
    const institution = institutions.find((inst: Institution) => inst.id === id)
    return institution ? institution.nombre : "Sin institución asignada"
  }

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalRectores = rectores.length
    const activeRectores = rectores.filter((p) => p.estado === "activa").length
    const inactiveRectores = rectores.filter((p) => p.estado === "inactiva").length
    const totalDocuments = documents.length
    const avgExperience =
      rectores.length > 0
        ? Math.round(rectores.reduce((sum, p) => sum + p.experienciaAnios, 0) / rectores.length)
        : 0

    return {
      total: totalRectores,
      active: activeRectores,
      inactive: inactiveRectores,
      documents: totalDocuments,
      avgExperience,
    }
  }, [rectores, documents])

  // Rectores filtrados
  const filteredRectores = useMemo(() => {
    return rectores.filter((rector) => {
      const matchesSearch =
        rector.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rector.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rector.cedula.includes(searchTerm) ||
        rector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getInstitutionName(rector.institucionId).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === "todos" || rector.estado === filterEstado

      return matchesSearch && matchesEstado
    })
  }, [rectores, institutions, searchTerm, filterEstado])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Rectores</h1>
            <p className="text-gray-600">Administra la información de los rectores</p>
          </div>
          <Link href="/dashboard/rectores/agregar">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Rector
            </Button>
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rectores</p>
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
          {/* Lista de rectores */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Rectores</CardTitle>
                <CardDescription>
                  Información detallada de todos los rectores registrados ({filteredRectores.length} resultados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros y búsqueda */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, cédula, email o institución..."
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
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredRectores.map((rector) => (
                    <div key={rector.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {rector.nombres} {rector.apellidos}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {rector.email} • Cédula: {rector.cedula} • Tel: {rector.telefono}
                              </p>
                              <p className="text-xs text-gray-500">
                                {rector.experienciaAnios} años de experiencia • Institución:{" "}
                                {getInstitutionName(rector.institucionId)}
                              </p>
                            </div>
                            <Badge variant={rector.estado === "activa" ? "default" : "secondary"}>
                              {rector.estado}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/rectores/${rector.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Perfil
                            </Button>
                          </Link>
                          <Link href={`/dashboard/rectores/${rector.id}/editar`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredRectores.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron rectores que coincidan con los filtros</p>
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
                  {recentActivityRectores.map((activity, index) => (
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