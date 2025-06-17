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
  User,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  Download,
} from "lucide-react"
import { Conductor } from "@/interfaces"
import { useConductorStore } from "@/lib/conductor-store"
import { useRutaStore } from "@/lib/ruta-store"
import { useVehiculoStore } from "@/lib/vehiculo-store"


export default function ConductoresAdminDashboard() {
  const { conductores, deleteConductor, } = useConductorStore()
  const { vehiculos } = useVehiculoStore()
  const { rutas } = useRutaStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null)

  // Filtrar conductores
  const conductoresFiltrados = useMemo(() => {
    return conductores.filter((conductor) => {
      const matchesSearch =
        conductor.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conductor.numeroDocumento.includes(searchTerm) ||
        conductor.licenciaConducir.includes(searchTerm)

      const matchesFilter = filterEstado === "todos" || conductor.estado === filterEstado

      return matchesSearch && matchesFilter
    })
  }, [conductores, searchTerm, filterEstado])

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = conductores.length
    const activos = conductores.filter((c) => c.estado === "Activo").length
    const inactivos = conductores.filter((c) => c.estado === "Inactivo").length
    const suspendidos = conductores.filter((c) => c.estado === "Suspendido").length
    const conVehiculo = conductores.filter((c) => vehiculos.some((v) => v.conductorAsignado === c.id)).length
    const conRutas = conductores.filter((c) => rutas.some((r) => r.conductorId === c.id)).length

    return {
      total,
      activos,
      inactivos,
      suspendidos,
      conVehiculo,
      conRutas,
    }
  }, [conductores, vehiculos, rutas])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactivo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Suspendido":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Inactivo":
        return <XCircle className="w-4 h-4 text-gray-600" />
      case "Suspendido":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />
    }
  }

  const handleDeleteConductor = async (id: string) => {
    try {
      await deleteConductor(id)
    } catch (error) {
      console.error("Error al eliminar conductor:", error)
    }
  }

  const getVehiculoAsignado = (conductorId: string) => {
    return vehiculos.find((v) => v.conductorAsignado === conductorId)
  }

  const getRutasAsignadas = (conductorId: string) => {
    return rutas.filter((r) => r.conductorId === conductorId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Conductores</h1>
          <p className="text-gray-600 mt-1">Administre los conductores del sistema de transporte escolar</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button asChild>
            <a href="/transporte/conductores/registro">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Conductor
            </a>
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
              <User className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-500">Inactivos</p>
                <p className="text-2xl font-bold text-gray-600">{estadisticas.inactivos}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Suspendidos</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.suspendidos}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Con Vehículo</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.conVehiculo}</p>
              </div>
              <div className="text-blue-600">🚐</div>
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
                  placeholder="Buscar por nombre, documento o licencia..."
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
                <option value="Inactivo">Inactivos</option>
                <option value="Suspendido">Suspendidos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de conductores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Conductores</CardTitle>
          <CardDescription>{conductoresFiltrados.length} conductor(es) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Rutas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conductoresFiltrados.map((conductor) => {
                  const vehiculo = getVehiculoAsignado(conductor.id)
                  const rutasAsignadas = getRutasAsignadas(conductor.id)

                  return (
                    <TableRow key={conductor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{conductor.nombreCompleto}</p>
                            <p className="text-sm text-gray-500">{conductor.experienciaAnios} años de experiencia</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{conductor.numeroDocumento}</p>
                          <p className="text-sm text-gray-500">{conductor.tipoDocumento}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {conductor.telefono}
                          </div>
                          {conductor.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {conductor.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <CreditCard className="w-3 h-3 text-gray-400" />
                            {conductor.licenciaConducir}
                          </div>
                          <p className="text-sm text-gray-500">{conductor.categoriaLicencia}</p>
                          <p className="text-xs text-gray-400">
                            Vence: {new Date(conductor.fechaVencimientoLicencia).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoColor(conductor.estado)} border`}>
                          {getEstadoIcon(conductor.estado)}
                          <span className="ml-1">{conductor.estado}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {vehiculo ? (
                          <div>
                            <p className="font-medium text-sm">{vehiculo.placa}</p>
                            <p className="text-xs text-gray-500">
                              {vehiculo.marca} {vehiculo.modelo}
                            </p>
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
                            <DropdownMenuItem onClick={() => setSelectedConductor(conductor)}>
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
                                  <AlertDialogTitle>¿Eliminar conductor?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el conductor{" "}
                                    <strong>{conductor.nombreCompleto}</strong> del sistema.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteConductor(conductor.id)}
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

          {conductoresFiltrados.length === 0 && (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron conductores</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles del conductor */}
      {selectedConductor && (
        <AlertDialog open={!!selectedConductor} onOpenChange={() => setSelectedConductor(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalles del Conductor</AlertDialogTitle>
              <AlertDialogDescription>
                Información completa de {selectedConductor.nombreCompleto}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Información Personal</p>
                  <p className="font-semibold">{selectedConductor.nombreCompleto}</p>
                  <p className="text-sm text-gray-600">
                    {selectedConductor.tipoDocumento}: {selectedConductor.numeroDocumento}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contacto</p>
                  <p className="text-sm">{selectedConductor.telefono}</p>
                  {selectedConductor.email && <p className="text-sm">{selectedConductor.email}</p>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p className="text-sm">{selectedConductor.direccion}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Licencia</p>
                  <p className="text-sm">{selectedConductor.licenciaConducir}</p>
                  <p className="text-sm text-gray-600">Categoría: {selectedConductor.categoriaLicencia}</p>
                  <p className="text-sm text-gray-600">
                    Vence: {new Date(selectedConductor.fechaVencimientoLicencia).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experiencia</p>
                  <p className="text-sm">{selectedConductor.experienciaAnios} años</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge className={`${getEstadoColor(selectedConductor.estado)} border`}>
                    {getEstadoIcon(selectedConductor.estado)}
                    <span className="ml-1">{selectedConductor.estado}</span>
                  </Badge>
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
