"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  MapPin,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  School,
  Car,
  User,
} from "lucide-react"

import { useRouter } from "next/navigation"
import { Ruta } from "@/interfaces"
import { useConductorStore } from "@/lib/conductor-store"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRutaStore } from "@/lib/ruta-store"
import { useVehiculoStore } from "@/lib/vehiculo-store"

export default function RutasDashboard() {
  const router = useRouter()
  const { rutas, deleteRuta, } = useRutaStore()
  const { conductores } = useConductorStore()
  const { vehiculos } = useVehiculoStore()
  const { institutions } = useInstitutionStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null)

  // Filtrar rutas
  const rutasFiltradas = useMemo(() => {
    return rutas.filter((ruta) => {
      const matchesSearch =
        ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ruta.descripcion && ruta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesFilter = filterEstado === "todos" || ruta.estado === filterEstado

      return matchesSearch && matchesFilter
    })
  }, [rutas, searchTerm, filterEstado])

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = rutas.length
    const activas = rutas.filter((r) => r.estado === "Activa").length
    const inactivas = rutas.filter((r) => r.estado === "Inactiva").length
    const suspendidas = rutas.filter((r) => r.estado === "Suspendida").length
    const totalEstudiantes = rutas.reduce((acc, r) => acc + r.estudiantesAsignados.length, 0)
    const totalCupos = rutas.reduce((acc, r) => {
      const vehiculo = vehiculos.find((v) => v.id === r.vehiculoId)
      return acc + (vehiculo?.cupoMaximo || 0)
    }, 0)

    return {
      total,
      activas,
      inactivas,
      suspendidas,
      totalEstudiantes,
      totalCupos,
    }
  }, [rutas, vehiculos])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactiva":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Suspendida":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activa":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Inactiva":
        return <XCircle className="w-4 h-4 text-gray-600" />
      case "Suspendida":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />
    }
  }

  const handleDeleteRuta = async (id: string) => {
    try {
      await deleteRuta(id)
    } catch (error) {
      console.error("Error al eliminar ruta:", error)
    }
  }

  const getConductor = (conductorId: string) => {
    return conductores.find((c) => c.id === conductorId)
  }

  const getVehiculo = (vehiculoId: string) => {
    return vehiculos.find((v) => v.id === vehiculoId)
  }

  const getInstitucion = (institucionId: string) => {
    return institutions.find((i) => i.id === institucionId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Rutas</h1>
          <p className="text-gray-600 mt-1">Administre las rutas de transporte escolar</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => router.push("/dashboard/transporte/rutas/crear")}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Ruta
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Rutas</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Activas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.activas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Inactivas</p>
                <p className="text-2xl font-bold text-gray-600">{estadisticas.inactivas}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Suspendidas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.suspendidas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Estudiantes</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.totalEstudiantes}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cupos Total</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.totalCupos}</p>
              </div>
              <div className="text-purple-600">🎒</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, código o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="Activa">Activas</option>
                <option value="Inactiva">Inactivas</option>
                <option value="Suspendida">Suspendidas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de rutas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Rutas</CardTitle>
          <CardDescription>{rutasFiltradas.length} ruta(s) encontrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Horarios</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasFiltradas.map((ruta) => {
                  const conductor = getConductor(ruta.conductorId)
                  const vehiculo = getVehiculo(ruta.vehiculoId)
                  const institucion = getInstitucion(ruta.institucionId)

                  return (
                    <TableRow key={ruta.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{ruta.nombre}</p>
                            <p className="text-sm text-gray-500">Código: {ruta.codigo}</p>
                            <p className="text-xs text-gray-400">{ruta.paradas.length} paradas</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm">{institucion?.nombre || "No encontrada"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {conductor ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{conductor.nombreCompleto}</p>
                              <p className="text-xs text-gray-500">{conductor.telefono}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {vehiculo ? (
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{vehiculo.placa}</p>
                              <p className="text-xs text-gray-500">
                                {vehiculo.marca} {vehiculo.modelo}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">
                              {ruta.horarioSalida} - {ruta.horarioRegreso}
                            </p>
                            <p className="text-xs text-gray-500">{ruta.diasOperacion.length} días/semana</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">
                            {ruta.estudiantesAsignados.length}/{vehiculo?.cupoMaximo || 0}
                          </p>
                          <p className="text-xs text-gray-500">{ruta.cuposDisponibles} disponibles</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoColor(ruta.estado)} border`}>
                          {getEstadoIcon(ruta.estado)}
                          <span className="ml-1">{ruta.estado}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedRuta(ruta)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/transporte/rutas/editar/${ruta.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/transporte/asignaciones?ruta=${ruta.id}`)}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Asignar estudiantes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar ruta?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la ruta{" "}
                                    <strong>{ruta.nombre}</strong> del sistema.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRuta(ruta.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {rutasFiltradas.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron rutas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles de la ruta */}
      {selectedRuta && (
        <AlertDialog open={!!selectedRuta} onOpenChange={() => setSelectedRuta(null)}>
          <AlertDialogContent className="max-w-4xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalles de la Ruta</AlertDialogTitle>
              <AlertDialogDescription>Información completa de la ruta {selectedRuta.nombre}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Información General</p>
                  <p className="font-bold text-lg">{selectedRuta.nombre}</p>
                  <p className="text-sm text-gray-600">Código: {selectedRuta.codigo}</p>
                  {selectedRuta.descripcion && <p className="text-sm text-gray-600">{selectedRuta.descripcion}</p>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Horarios</p>
                  <p className="text-sm">
                    Salida: {selectedRuta.horarioSalida} - Regreso: {selectedRuta.horarioRegreso}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRuta.diasOperacion.map((dia) => (
                      <Badge key={dia} variant="outline" className="text-xs">
                        {dia}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Asignaciones</p>
                  <p className="text-sm">Conductor: {getConductor(selectedRuta.conductorId)?.nombreCompleto}</p>
                  <p className="text-sm">Vehículo: {getVehiculo(selectedRuta.vehiculoId)?.placa}</p>
                  <p className="text-sm">Institución: {getInstitucion(selectedRuta.institucionId)?.nombre}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Paradas ({selectedRuta.paradas.length})</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRuta.paradas.map((parada, index) => (
                      <div key={parada.id} className="bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            #{index + 1} {parada.nombre}
                          </span>
                          <span className="text-xs text-gray-500">{parada.horario}</span>
                        </div>
                        <p className="text-xs text-gray-600">{parada.direccion}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ocupación</p>
                  <p className="text-sm">
                    Estudiantes: {selectedRuta.estudiantesAsignados.length}/
                    {getVehiculo(selectedRuta.vehiculoId)?.cupoMaximo || 0}
                  </p>
                  <p className="text-sm">Cupos disponibles: {selectedRuta.cuposDisponibles}</p>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
