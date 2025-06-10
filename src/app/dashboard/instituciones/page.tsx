"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plus, Search, Eye, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useInstitutionStore } from "@/lib/instituition-store"
import { recentActivity } from "@/interfaces/Institution"

export default function InstitucionesPage() {
  const { institutions } = useInstitutionStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterZona, setFilterZona] = useState<string>("todas")
  const [filterEstado, setFilterEstado] = useState<string>("todas")

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalInstitutions = institutions.length
    const activeInstitutions = institutions.filter((i:any) => i.activa).length
    const inactiveInstitutions = institutions.filter((i:any) => !i.activa).length
    const urbanInstitutions = institutions.filter((i:any) => i.zona === "urbana").length
    const ruralInstitutions = institutions.filter((i:any) => i.zona === "rural").length

    return {
      total: totalInstitutions,
      active: activeInstitutions,
      inactive: inactiveInstitutions,
      urban: urbanInstitutions,
      rural: ruralInstitutions,
    }
  }, [institutions])

  // Instituciones filtradas
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((institution:any) => {
      const matchesSearch =
        institution.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.codigoDane?.includes(searchTerm) ||
        institution.rector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.comuna.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesZona = filterZona === "todas" || institution.zona === filterZona
      const matchesEstado =
        filterEstado === "todas" || (filterEstado === "activa" ? institution.activa : !institution.activa)

      return matchesSearch && matchesZona && matchesEstado
    })
  }, [institutions, searchTerm, filterZona, filterEstado])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Instituciones</h1>
            <p className="text-gray-600">Administra la información de las instituciones educativas</p>
          </div>
          <Link href="/dashboard/instituciones/agregar">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Institución
            </Button>
          </Link>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Instituciones</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-green-600">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Activas</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactivas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                  <p className="text-xs text-gray-600">
                    {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge variant="secondary">Inactivas</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Zona Urbana</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.urban}</p>
                  <p className="text-xs text-blue-600">Instituciones</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Zona Rural</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rural}</p>
                  <p className="text-xs text-orange-600">Instituciones</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de instituciones */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Instituciones</CardTitle>
                <CardDescription>
                  Información detallada de todas las instituciones registradas ({filteredInstitutions.length}{" "}
                  resultados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros y búsqueda */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, dirección, código DANE o rector..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterZona} onValueChange={setFilterZona}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Zona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="urbana">Urbana</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="activa">Activas</SelectItem>
                        <SelectItem value="inactiva">Inactivas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredInstitutions.map((institution:any) => (
                    <div key={institution.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{institution.nombre}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{institution.direccion}</span>
                                <span>•</span>
                                <span>{institution.comuna}</span>
                              </div>
                              {institution.rector && (
                                <p className="text-xs text-gray-500 mt-1">Rector: {institution.rector}</p>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Badge variant={institution.activa ? "default" : "secondary"}>
                                {institution.activa ? "Activa" : "Inactiva"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {institution.zona === "urbana" ? "Urbana" : "Rural"}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {institution.jornadas.map((jornada:any) => (
                              <Badge key={jornada} variant="outline" className="text-xs">
                                {jornada.charAt(0).toUpperCase() + jornada.slice(1)}
                              </Badge>
                            ))}
                            {institution.codigoDane && (
                              <Badge variant="outline" className="text-xs">
                                DANE: {institution.codigoDane}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/instituciones/${institution.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </Link>
                          <Link href={`/dashboard/instituciones/${institution.id}/editar`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredInstitutions.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron instituciones que coincidan con los filtros</p>
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
                <CardDescription>Últimas acciones en instituciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {activity.institution} • {activity.time}
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
