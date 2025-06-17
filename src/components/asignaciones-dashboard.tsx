"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Search, MapPin, School, User, CheckCircle, AlertCircle, UserPlus, UserMinus } from "lucide-react"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRutaStore } from "@/lib/ruta-store"
import { useSolicitudCupoStore } from "@/lib/solicitud-cupo-store"


export default function AsignacionesDashboard() {
  const searchParams = useSearchParams()
  const rutaIdFromUrl = searchParams.get("ruta")

  const { rutas, assignEstudiante, removeEstudiante, isLoading } = useRutaStore()
  const { solicitudes } = useSolicitudCupoStore()
  const { institutions } = useInstitutionStore()

  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>(rutaIdFromUrl || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterInstitucion, setFilterInstitucion] = useState<string>("todos")
  const [filterEstado, ] = useState<string>("todos")

  // Obtener estudiantes que necesitan transporte y están aceptados
  const estudiantesDisponibles = useMemo(() => {
    return solicitudes.filter(
      (solicitud) =>
        solicitud.necesitaTransporte &&
        solicitud.estadoCupo === "Aceptado" &&
        !rutas.some((ruta) => ruta.estudiantesAsignados.includes(solicitud.id)),
    )
  }, [solicitudes, rutas])

  // Filtrar estudiantes disponibles
  const estudiantesFiltrados = useMemo(() => {
    return estudiantesDisponibles.filter((estudiante) => {
      const matchesSearch =
        estudiante.nombreNino.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudiante.documentoNino.includes(searchTerm) ||
        estudiante.nombreAcudiente.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesInstitucion = filterInstitucion === "todos" || estudiante.colegioSeleccionado === filterInstitucion

      const matchesEstado =
        filterEstado === "todos" ||
        (filterEstado === "asignado" && rutas.some((ruta) => ruta.estudiantesAsignados.includes(estudiante.id))) ||
        (filterEstado === "sin_asignar" && !rutas.some((ruta) => ruta.estudiantesAsignados.includes(estudiante.id)))

      return matchesSearch && matchesInstitucion && matchesEstado
    })
  }, [estudiantesDisponibles, searchTerm, filterInstitucion, filterEstado, rutas])

  const ruta = rutas.find((r) => r.id === rutaSeleccionada)
  const estudiantesAsignados = ruta ? solicitudes.filter((s) => ruta.estudiantesAsignados.includes(s.id)) : []

  const handleAsignarEstudiante = async (estudianteId: string) => {
    if (!rutaSeleccionada) return

    try {
      await assignEstudiante(rutaSeleccionada, estudianteId)
    } catch (error) {
      console.error("Error al asignar estudiante:", error)
    }
  }

  const handleRemoverEstudiante = async (estudianteId: string) => {
    if (!rutaSeleccionada) return

    try {
      await removeEstudiante(rutaSeleccionada, estudianteId)
    } catch (error) {
      console.error("Error al remover estudiante:", error)
    }
  }

  const getInstitucion = (institucionId: string) => {
    return institutions.find((i) => i.id === institucionId)
  }

  // Estadísticas
  const estadisticas = useMemo(() => {
    const totalEstudiantes = solicitudes.filter((s) => s.necesitaTransporte && s.estadoCupo === "Aceptado").length
    const estudiantesAsignadosTotal = rutas.reduce((acc, r) => acc + r.estudiantesAsignados.length, 0)
    const estudiantesSinAsignar = totalEstudiantes - estudiantesAsignadosTotal
    const rutasActivas = rutas.filter((r) => r.estado === "Activa").length

    return {
      totalEstudiantes,
      estudiantesAsignadosTotal,
      estudiantesSinAsignar,
      rutasActivas,
    }
  }, [solicitudes, rutas])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Asignación de Estudiantes</h1>
        <p className="text-gray-600 mt-1">Asigne estudiantes a las rutas de transporte escolar</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold">{estadisticas.totalEstudiantes}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Asignados</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.estudiantesAsignadosTotal}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sin Asignar</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.estudiantesSinAsignar}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rutas Activas</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.rutasActivas}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de selección de ruta y estudiantes disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes Disponibles</CardTitle>
            <CardDescription>Estudiantes que necesitan transporte y no están asignados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selector de ruta */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Seleccionar ruta de destino</label>
              <Select value={rutaSeleccionada} onValueChange={setRutaSeleccionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una ruta" />
                </SelectTrigger>
                <SelectContent>
                  {rutas
                    .filter((r) => r.estado === "Activa")
                    .map((ruta) => (
                      <SelectItem key={ruta.id} value={ruta.id}>
                        {ruta.nombre} - {ruta.cuposDisponibles} cupos disponibles
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {ruta && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">{ruta.nombre}</p>
                <p className="text-sm text-blue-600">
                  Ocupación: {ruta.estudiantesAsignados.length}/
                  {ruta.cuposDisponibles + ruta.estudiantesAsignados.length}
                </p>
                <p className="text-sm text-blue-600">Cupos disponibles: {ruta.cuposDisponibles}</p>
              </div>
            )}

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar estudiante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterInstitucion} onValueChange={setFilterInstitucion}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por institución" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las instituciones</SelectItem>
                  {institutions
                    .filter((i) => i.activa)
                    .map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de estudiantes disponibles */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {estudiantesFiltrados.map((estudiante) => {
                const institucion = getInstitucion(estudiante.colegioSeleccionado)
                const yaAsignado = rutas.some((r) => r.estudiantesAsignados.includes(estudiante.id))

                return (
                  <div key={estudiante.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{estudiante.nombreNino}</span>
                          {yaAsignado && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Asignado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Acudiente: {estudiante.nombreAcudiente}</p>
                        <p className="text-sm text-gray-500">
                          <School className="w-3 h-3 inline mr-1" />
                          {institucion?.nombre} - Grado {estudiante.gradoSolicitado}
                        </p>
                        <p className="text-xs text-gray-400">Dirección: {estudiante.direccion}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!yaAsignado && rutaSeleccionada && ruta && ruta.cuposDisponibles > 0 && (
                          <Button size="sm" onClick={() => handleAsignarEstudiante(estudiante.id)} disabled={isLoading}>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Asignar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {estudiantesFiltrados.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay estudiantes disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de estudiantes asignados a la ruta seleccionada */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes Asignados</CardTitle>
            <CardDescription>
              {ruta
                ? `Estudiantes asignados a ${ruta.nombre}`
                : "Seleccione una ruta para ver los estudiantes asignados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!ruta ? (
              <div className="text-center py-8">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Seleccione una ruta para comenzar</p>
              </div>
            ) : estudiantesAsignados.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay estudiantes asignados a esta ruta</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {estudiantesAsignados.map((estudiante) => {
                  const institucion = getInstitucion(estudiante.colegioSeleccionado)

                  return (
                    <div key={estudiante.id} className="border rounded-lg p-3 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-green-600" />
                            <span className="font-medium">{estudiante.nombreNino}</span>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Asignado</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Acudiente: {estudiante.nombreAcudiente}</p>
                          <p className="text-sm text-gray-500">
                            <School className="w-3 h-3 inline mr-1" />
                            {institucion?.nombre} - Grado {estudiante.gradoSolicitado}
                          </p>
                          <p className="text-xs text-gray-400">Tel: {estudiante.telefonoContacto}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoverEstudiante(estudiante.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {ruta && ruta.cuposDisponibles === 0 && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            La ruta seleccionada no tiene cupos disponibles. No se pueden asignar más estudiantes.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
