"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Car,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Clock,
  LogOut,
  AlertCircle,
  Edit,
  School,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

import ConductorInfoEdit from "./conductor-info-edit"
import VehiculoForm from "./vehiculo-form"
import RutaForm from "./ruta-form"
import { Conductor } from "@/interfaces"
import { useConductorStore } from "@/lib/conductor-store"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRutaStore } from "@/lib/ruta-store"
import { useVehiculoStore } from "@/lib/vehiculo-store"

interface ConductorDashboardProps {
  conductorId: string
}

export default function ConductorDashboard({ conductorId }: ConductorDashboardProps) {
  const router = useRouter()
  const { getConductor } = useConductorStore()
  const {  vehiculos } = useVehiculoStore()
  const { getRutasByConductor,  } = useRutaStore()
  const { getInstitution } = useInstitutionStore()

  const [conductor, setConductor] = useState<Conductor | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("perfil")
  const [editMode, setEditMode] = useState(false)
  const [vehiculoFormMode, setVehiculoFormMode] = useState(false)
  const [rutaFormMode, setRutaFormMode] = useState(false)

  useEffect(() => {
    // Verificar si hay una sesión activa
    const storedConductorId = sessionStorage.getItem("conductorId")

    if (!storedConductorId || storedConductorId !== conductorId) {
      // Si no hay sesión o no coincide el ID, redirigir al login
      router.push("/transporte/login")
      return
    }

    const fetchConductor = () => {
      const conductorData = getConductor(conductorId)
      setConductor(conductorData || null)
      setLoading(false)
    }

    fetchConductor()
  }, [conductorId, getConductor, router])

  const handleLogout = () => {
    sessionStorage.removeItem("conductorId")
    router.push("/transporte/login")
  }

  const vehiculoAsignado = vehiculos.find((v) => v.conductorAsignado === conductorId)
  const rutasAsignadas = getRutasByConductor(conductorId)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactivo":
      case "Suspendido":
        return "bg-red-100 text-red-800 border-red-200"
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Inactivo":
      case "Suspendido":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Mantenimiento":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (!conductor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">Conductor no encontrado</CardTitle>
            <CardDescription>No se encontró un conductor con el ID proporcionado</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/transporte/login")} className="w-full">
              Volver al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (editMode) {
    return <ConductorInfoEdit conductor={conductor} onCancel={() => setEditMode(false)} />
  }

  if (vehiculoFormMode) {
    return <VehiculoForm conductorId={conductorId} onCancel={() => setVehiculoFormMode(false)} />
  }

  if (rutaFormMode) {
    return (
      <RutaForm conductorId={conductorId} vehiculoId={vehiculoAsignado?.id} onCancel={() => setRutaFormMode(false)} />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Conductor</h1>
            <p className="text-gray-600">Bienvenido, {conductor.nombreCompleto}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Badge className={`${getEstadoColor(conductor.estado)} border`}>
              {getEstadoIcon(conductor.estado)}
              <span className="ml-1">{conductor.estado}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="perfil">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="vehiculo">
              <Car className="w-4 h-4 mr-2" />
              Vehículo
            </TabsTrigger>
            <TabsTrigger value="rutas">
              <MapPin className="w-4 h-4 mr-2" />
              Rutas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Información Personal</CardTitle>
                  <CardDescription>Datos del conductor</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                      <p className="text-lg font-semibold">{conductor.nombreCompleto}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de documento</p>
                        <p className="font-medium">{conductor.tipoDocumento}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Número de documento</p>
                        <p className="font-medium">{conductor.numeroDocumento}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{conductor.telefono}</span>
                    </div>

                    {conductor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{conductor.email}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span className="font-medium">{conductor.direccion}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fecha de nacimiento
                        </p>
                        <p className="font-medium">{new Date(conductor.fechaNacimiento).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fecha de ingreso
                        </p>
                        <p className="font-medium">{new Date(conductor.fechaIngreso).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-gray-500">Licencia de conducir</p>
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{conductor.licenciaConducir}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Categoría</p>
                        <p className="font-medium">{conductor.categoriaLicencia}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Vencimiento</p>
                        <p className="font-medium">
                          {new Date(conductor.fechaVencimientoLicencia).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Experiencia</p>
                      <p className="font-medium">{conductor.experienciaAnios} años</p>
                    </div>
                  </div>
                </div>

                {conductor.observaciones && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Observaciones</p>
                    <p className="text-sm text-gray-700 mt-1">{conductor.observaciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehiculo">
            {vehiculoAsignado ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Vehículo Asignado</CardTitle>
                  <CardDescription>Información del vehículo que opera</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Placa</p>
                          <p className="text-xl font-bold">{vehiculoAsignado.placa}</p>
                        </div>
                        <Badge className={`${getEstadoColor(vehiculoAsignado.estado)} border`}>
                          {getEstadoIcon(vehiculoAsignado.estado)}
                          <span className="ml-1">{vehiculoAsignado.estado}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Marca</p>
                          <p className="font-medium">{vehiculoAsignado.marca}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Modelo</p>
                          <p className="font-medium">{vehiculoAsignado.modelo}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Año</p>
                          <p className="font-medium">{vehiculoAsignado.anio}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Color</p>
                          <p className="font-medium">{vehiculoAsignado.color}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de vehículo</p>
                        <p className="font-medium">{vehiculoAsignado.tipoVehiculo}</p>
                      </div>

                      {vehiculoAsignado.numeroInterno && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Número interno</p>
                          <p className="font-medium">{vehiculoAsignado.numeroInterno}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Capacidad</p>
                        <p className="text-lg font-semibold">{vehiculoAsignado.cupoMaximo} pasajeros</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tecno-mecánica hasta</p>
                          <p className="font-medium">
                            {new Date(vehiculoAsignado.fechaVencimientoTecnomecanica).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">SOAT hasta</p>
                          <p className="font-medium">
                            {new Date(vehiculoAsignado.fechaVencimientoSoat).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {vehiculoAsignado.observaciones && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Observaciones</p>
                          <p className="text-sm text-gray-700 mt-1">{vehiculoAsignado.observaciones}</p>
                        </div>
                      )}

                      {new Date(vehiculoAsignado.fechaVencimientoTecnomecanica) <=
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            La tecno-mecánica está próxima a vencer o ya venció
                          </AlertDescription>
                        </Alert>
                      )}

                      {new Date(vehiculoAsignado.fechaVencimientoSoat) <=
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            El SOAT está próximo a vencer o ya venció
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sin Vehículo Asignado</CardTitle>
                  <CardDescription>No tiene un vehículo asignado actualmente</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-6">Para operar rutas escolares, necesita tener un vehículo asignado</p>
                  <Button onClick={() => setVehiculoFormMode(true)}>Registrar Vehículo</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rutas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Rutas Asignadas</CardTitle>
                  <CardDescription>Rutas de transporte escolar que opera</CardDescription>
                </div>
                {vehiculoAsignado && (
                  <Button onClick={() => setRutaFormMode(true)} disabled={!vehiculoAsignado}>
                    Registrar Nueva Ruta
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {rutasAsignadas.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">No tiene rutas asignadas actualmente</p>
                    {!vehiculoAsignado && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Necesita tener un vehículo asignado antes de poder registrar rutas
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {rutasAsignadas.map((ruta) => {
                      const institucion = getInstitution(ruta.institucionId)
                      return (
                        <div key={ruta.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{ruta.nombre}</h3>
                              <p className="text-sm text-gray-500">Código: {ruta.codigo}</p>
                            </div>
                            <Badge className={`${getEstadoColor(ruta.estado)} border mt-2 md:mt-0`}>
                              {getEstadoIcon(ruta.estado)}
                              <span className="ml-1">{ruta.estado}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <School className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{institucion?.nombre || "Institución no encontrada"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {ruta.horarioSalida} - {ruta.horarioRegreso}
                              </span>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-800 font-medium">
                                Estudiantes: {ruta.estudiantesAsignados.length}/{vehiculoAsignado?.cupoMaximo || 0}
                              </span>
                            </div>
                            <span className="text-blue-800 font-medium">
                              Cupos disponibles: {ruta.cuposDisponibles}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Días de operación:</p>
                            <div className="flex flex-wrap gap-2">
                              {ruta.diasOperacion.map((dia) => (
                                <Badge key={dia} variant="outline">
                                  {dia}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {ruta.paradas.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-500 mb-2">Paradas:</p>
                              <div className="space-y-2">
                                {ruta.paradas.map((parada) => (
                                  <div key={parada.id} className="bg-gray-50 p-2 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{parada.nombre}</span>
                                      <span className="text-sm text-gray-500">{parada.horario}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{parada.direccion}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
