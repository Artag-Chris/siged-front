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
  Car,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  User,
} from "lucide-react"
import { Vehiculo } from "@/interfaces"
import { useConductorStore } from "@/lib/conductor-store"
import { useRutaStore } from "@/lib/ruta-store"
import { useVehiculoStore } from "@/lib/vehiculo-store"

export default function VehiculosAdminDashboard() {
  const { vehiculos, deleteVehiculo, } = useVehiculoStore()
  const { conductores } = useConductorStore()
  const { rutas } = useRutaStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null)

  // Filtrar vehículos
  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter((vehiculo) => {
      const matchesSearch =
        vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehiculo.numeroInterno && vehiculo.numeroInterno.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesFilter = filterEstado === "todos" || vehiculo.estado === filterEstado

      return matchesSearch && matchesFilter
    })
  }, [vehiculos, searchTerm, filterEstado])

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = vehiculos.length
    const activos = vehiculos.filter((v) => v.estado === "Activo").length
    const mantenimiento = vehiculos.filter((v) => v.estado === "Mantenimiento").length
    const fueraServicio = vehiculos.filter((v) => v.estado === "Fuera de servicio").length
    const conConductor = vehiculos.filter((v) => v.conductorAsignado).length
    const conRutas = vehiculos.filter((v) => rutas.some((r) => r.vehiculoId === v.id)).length

    return {
      total,
      activos,
      mantenimiento,
      fueraServicio,
      conConductor,
      conRutas,
    }
  }, [vehiculos, rutas])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Fuera de servicio":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Mantenimiento":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "Fuera de servicio":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />
    }
  }

  const handleDeleteVehiculo = async (id: string) => {
    try {
      await deleteVehiculo(id)
    } catch (error) {
      console.error("Error al eliminar vehículo:", error)
    }
  }

  const getConductorAsignado = (conductorId?: string) => {
    if (!conductorId) return null
    return conductores.find((c) => c.id === conductorId)
  }

  const getRutasAsignadas = (vehiculoId: string) => {
    return rutas.filter((r) => r.vehiculoId === vehiculoId)
  }

  const isDocumentExpiringSoon = (fecha: string) => {
    const fechaVencimiento = new Date(fecha)
    const hoy = new Date()
    const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return diasRestantes <= 30
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600 mt-1">Administre la flota de vehículos del sistema de transporte escolar</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Vehículo
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <Car className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.activos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mantenimiento</p>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.mantenimiento}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Fuera de servicio</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.fueraServicio}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Con Conductor</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.conConductor}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Con Rutas</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.conRutas}</p>
              </div>
              <div className="text-purple-600">🗺️</div>
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
                  placeholder="Buscar por placa, marca, modelo o número interno..."
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
                <option value="Activo">Activos</option>
                <option value="Mantenimiento">En mantenimiento</option>
                <option value="Fuera de servicio">Fuera de servicio</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de vehículos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Vehículos</CardTitle>
          <CardDescription>{vehiculosFiltrados.length} vehículo(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Especificaciones</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Rutas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiculosFiltrados.map((vehiculo) => {
                  const conductor = getConductorAsignado(vehiculo.conductorAsignado)
                  const rutasAsignadas = getRutasAsignadas(vehiculo.id)
                  const tecnoVenceSoon = isDocumentExpiringSoon(vehiculo.fechaVencimientoTecnomecanica)
                  const soatVenceSoon = isDocumentExpiringSoon(vehiculo.fechaVencimientoSoat)

                  return (
                    <TableRow key={vehiculo.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Car className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{vehiculo.placa}</p>
                            {vehiculo.numeroInterno && (
                              <p className="text-sm text-gray-500">#{vehiculo.numeroInterno}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {vehiculo.marca} {vehiculo.modelo}
                          </p>
                          <p className="text-sm text-gray-500">
                            {vehiculo.anio} • {vehiculo.color}
                          </p>
                          <p className="text-sm text-gray-500">
                            {vehiculo.tipoVehiculo} • {vehiculo.cupoMaximo} pasajeros
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={tecnoVenceSoon ? "text-red-600 font-medium" : ""}>
                              Tecno: {new Date(vehiculo.fechaVencimientoTecnomecanica).toLocaleDateString()}
                            </span>
                            {tecnoVenceSoon && <AlertTriangle className="w-3 h-3 text-red-600" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={soatVenceSoon ? "text-red-600 font-medium" : ""}>
                              SOAT: {new Date(vehiculo.fechaVencimientoSoat).toLocaleDateString()}
                            </span>
                            {soatVenceSoon && <AlertTriangle className="w-3 h-3 text-red-600" />}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoColor(vehiculo.estado)} border`}>
                          {getEstadoIcon(vehiculo.estado)}
                          <span className="ml-1">{vehiculo.estado}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {conductor ? (
                          <div>
                            <p className="font-medium text-sm">{conductor.nombreCompleto}</p>
                            <p className="text-xs text-gray-500">{conductor.telefono}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{rutasAsignadas.length}</span>
                          <span className="text-sm text-gray-500">ruta(s)</span>
                        </div>
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
                            <DropdownMenuItem onClick={() => setSelectedVehiculo(vehiculo)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
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
                                  <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo{" "}
                                    <strong>{vehiculo.placa}</strong> del sistema.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteVehiculo(vehiculo.id)}
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

          {vehiculosFiltrados.length === 0 && (
            <div className="text-center py-8">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron vehículos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles del vehículo */}
      {selectedVehiculo && (
        <AlertDialog open={!!selectedVehiculo} onOpenChange={() => setSelectedVehiculo(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalles del Vehículo</AlertDialogTitle>
              <AlertDialogDescription>
                Información completa del vehículo {selectedVehiculo.placa}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Identificación</p>
                  <p className="font-bold text-lg">{selectedVehiculo.placa}</p>
                  {selectedVehiculo.numeroInterno && (
                    <p className="text-sm text-gray-600">Número interno: {selectedVehiculo.numeroInterno}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Especificaciones</p>
                  <p className="text-sm">
                    {selectedVehiculo.marca} {selectedVehiculo.modelo} ({selectedVehiculo.anio})
                  </p>
                  <p className="text-sm text-gray-600">Color: {selectedVehiculo.color}</p>
                  <p className="text-sm text-gray-600">Tipo: {selectedVehiculo.tipoVehiculo}</p>
                  <p className="text-sm text-gray-600">Capacidad: {selectedVehiculo.cupoMaximo} pasajeros</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Documentos</p>
                  <p className="text-sm">
                    Tecno-mecánica: {new Date(selectedVehiculo.fechaVencimientoTecnomecanica).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    SOAT: {new Date(selectedVehiculo.fechaVencimientoSoat).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge className={`${getEstadoColor(selectedVehiculo.estado)} border`}>
                    {getEstadoIcon(selectedVehiculo.estado)}
                    <span className="ml-1">{selectedVehiculo.estado}</span>
                  </Badge>
                </div>
                {selectedVehiculo.conductorAsignado && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conductor Asignado</p>
                    <p className="text-sm">
                      {getConductorAsignado(selectedVehiculo.conductorAsignado)?.nombreCompleto}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {selectedVehiculo.observaciones && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Observaciones</p>
                <p className="text-sm text-gray-700 mt-1">{selectedVehiculo.observaciones}</p>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
