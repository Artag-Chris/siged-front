"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  Clock,
  XCircle,
  User,
  Phone,
  MapPin,
  School,
  GraduationCap,
  Calendar,
  FileText,
  Bus,
  Copy,
  ArrowLeft,
} from "lucide-react"

import type { SolicitudCupo } from "@/interfaces/solicitud-cupo"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useSolicitudCupoStore } from "@/lib/solicitud-cupo-store"

interface SolicitudDetalleProps {
  radicado: string
}

export default function SolicitudDetalle({ radicado }: SolicitudDetalleProps) {
  const router = useRouter()
  const { getSolicitudByRadicado } = useSolicitudCupoStore()
  const { getInstitution } = useInstitutionStore()
  const [solicitud, setSolicitud] = useState<SolicitudCupo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSolicitud = () => {
      const found = getSolicitudByRadicado(radicado)
      setSolicitud(found || null)
      setLoading(false)
    }

    fetchSolicitud()
  }, [radicado, getSolicitudByRadicado])

  const copyRadicado = () => {
    navigator.clipboard.writeText(radicado)
    toast.success("Radicado copiado al portapapeles")
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Aceptado":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "Rechazado":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Aceptado":
        return "bg-green-100 text-green-800 border-green-200"
      case "Rechazado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
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

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">Solicitud no encontrada</CardTitle>
            <CardDescription>No se encontró una solicitud con el radicado: {radicado}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/solicitud-cupo/consulta")} className="w-full">
              Realizar nueva búsqueda
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const institucion = getInstitution(solicitud.colegioSeleccionado)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalle de Solicitud</h1>
              <p className="text-gray-600">Información completa de la solicitud de cupo escolar</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getEstadoColor(solicitud.estadoCupo)} border`}>
                  {getEstadoIcon(solicitud.estadoCupo)}
                  <span className="ml-1">{solicitud.estadoCupo}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Creado: {new Date(solicitud.fechaCreacion).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Radicado destacado */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Número de Radicado</p>
                <p className="text-2xl font-bold text-blue-800">{solicitud.radicado}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyRadicado}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Estudiante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Estudiante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                <p className="text-lg font-semibold">{solicitud.nombreNino}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de documento</p>
                  <p className="font-medium">{solicitud.tipoDocumentoNino}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Número de documento</p>
                  <p className="font-medium">{solicitud.documentoNino}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500">Acudiente responsable</p>
                <p className="font-medium">{solicitud.nombreAcudiente}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{solicitud.telefonoContacto}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="font-medium">{solicitud.direccion}</span>
              </div>
            </CardContent>
          </Card>

          {/* Información Académica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="w-5 h-5" />
                Información Académica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Institución seleccionada</p>
                <p className="text-lg font-semibold">{institucion?.nombre || "Institución no encontrada"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Grado solicitado
                  </p>
                  <p className="font-medium">{solicitud.gradoSolicitado}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Jornada
                  </p>
                  <p className="font-medium capitalize">{solicitud.jornada}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Año escolar: {solicitud.anioEscolar}</span>
              </div>

              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  Transporte: {solicitud.necesitaTransporte ? "Sí requiere" : "No requiere"}
                </span>
              </div>

              {solicitud.observaciones && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Observaciones</p>
                    <p className="text-sm text-gray-700 mt-1">{solicitud.observaciones}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Adjuntos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Notas del estudiante</span>
                </div>
                <Badge variant={solicitud.documentos.notas ? "default" : "secondary"}>
                  {solicitud.documentos.notas ? "Cargado" : "Pendiente"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Información de EPS</span>
                </div>
                <Badge variant={solicitud.documentos.eps ? "default" : "secondary"}>
                  {solicitud.documentos.eps ? "Cargado" : "Pendiente"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Estado y Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Estado y Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {getEstadoIcon(solicitud.estadoCupo)}
                <div>
                  <p className="font-medium">Estado actual</p>
                  <p className="text-sm text-gray-500">{solicitud.estadoCupo}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de creación</p>
                <p className="font-medium">
                  {new Date(solicitud.fechaCreacion).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Última actualización</p>
                <p className="font-medium">
                  {new Date(solicitud.fechaActualizacion).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas según el estado */}
        <div className="mt-6">
          {solicitud.estadoCupo === "Pendiente" && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Su solicitud está siendo revisada. Le notificaremos cualquier cambio en el estado.
              </AlertDescription>
            </Alert>
          )}

          {solicitud.estadoCupo === "Aceptado" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Felicitaciones! Su solicitud ha sido aceptada. Pronto recibirá información sobre el proceso de
                matrícula.
              </AlertDescription>
            </Alert>
          )}

          {solicitud.estadoCupo === "Rechazado" && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Su solicitud no pudo ser aprobada. Puede contactar a la institución para más información.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-8 flex gap-4">
          <Button onClick={() => router.push("/solicitud-cupo/consulta")}>Consultar otra solicitud</Button>
          <Button variant="outline" onClick={() => router.push("/solicitud-cupo")}>
            Nueva solicitud
          </Button>
        </div>
      </div>
    </div>
  )
}
