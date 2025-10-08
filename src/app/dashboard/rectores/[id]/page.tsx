"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Loader2,
  School,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useRector } from "@/hooks/useRectores"

export default function RectorDetailPage() {
  const params = useParams()
  const rectorId = params.id as string
  const { rector, loading, error, refresh } = useRector(rectorId)

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Cargando información del rector...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/dashboard/rectores">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        </Link>
      </div>
    )
  }

  if (!rector) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>Rector no encontrado</AlertDescription>
        </Alert>
        <Link href="/dashboard/rectores">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        </Link>
      </div>
    )
  }

  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return "No especificada"
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/rectores">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {rector.rector.nombre} {rector.rector.apellido}
              </h1>
              <p className="text-gray-600">
                {rector.institucion?.nombre 
                  ? `Rector de ${rector.institucion.nombre}`
                  : "Rector sin institución asignada"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={rector.rector.estado === "activo" ? "default" : "secondary"}
            >
              {rector.rector.estado === "activo" ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Activo
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactivo
                </>
              )}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rector.estadisticas?.totalSedes || 0}
                  </p>
                  <p className="text-sm text-gray-600">Sedes Asignadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rector.estadisticas?.totalAsignaciones || 0}
                  </p>
                  <p className="text-sm text-gray-600">Asignaciones Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rector.estadisticas?.jornadasCubiertas || 0}
                  </p>
                  <p className="text-sm text-gray-600">Jornadas Cubiertas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>Datos de contacto y personales del rector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Documento</p>
                      <p className="text-sm text-gray-900">
                        {rector.rector.tipo_documento} {rector.rector.documento}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-900 break-all">
                        {rector.rector.email}
                      </p>
                    </div>
                  </div>

                  {rector.rector.direccion && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dirección</p>
                        <p className="text-sm text-gray-900">{rector.rector.direccion}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cargo</p>
                      <p className="text-sm text-gray-900">{rector.rector.cargo}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Fecha de Creación
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(rector.rector.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {rector.rector.informacionAcademica && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Información Académica</span>
                  </CardTitle>
                  <CardDescription>
                    Formación y experiencia profesional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <School className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Nivel Educativo
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {rector.rector.informacionAcademica.nivel_educativo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Título</p>
                        <p className="text-sm text-gray-900">
                          {rector.rector.informacionAcademica.titulo}
                        </p>
                      </div>
                    </div>

                    {rector.rector.informacionAcademica.institucion_educativa && (
                      <div className="flex items-start space-x-3">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Institución Educativa
                          </p>
                          <p className="text-sm text-gray-900">
                            {rector.rector.informacionAcademica.institucion_educativa}
                          </p>
                        </div>
                      </div>
                    )}

                    {rector.rector.informacionAcademica.anos_experiencia !== null &&
                      rector.rector.informacionAcademica.anos_experiencia !==
                        undefined && (
                        <div className="flex items-start space-x-3">
                          <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Años de Experiencia
                            </p>
                            <p className="text-sm text-gray-900">
                              {rector.rector.informacionAcademica.anos_experiencia} años
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Sedes Asignadas ({rector.sedes?.length || 0})</span>
                </CardTitle>
                <CardDescription>Sedes bajo la dirección de este rector</CardDescription>
              </CardHeader>
              <CardContent>
                {!rector.sedes || rector.sedes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No hay sedes asignadas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rector.sedes.map((sede) => (
                      <div
                        key={sede.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {sede.nombre}
                              </h4>
                              <Badge
                                variant={
                                  sede.estado === "activa" ? "default" : "secondary"
                                }
                              >
                                {sede.estado}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {sede.zona}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {sede.direccion}
                              </p>
                              {sede.codigo_DANE && (
                                <p className="text-xs text-gray-500">
                                  Código DANE: {sede.codigo_DANE}
                                </p>
                              )}
                            </div>
                            {sede.jornadas && sede.jornadas.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                  Jornadas:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {sede.jornadas.map((jornada) => (
                                    <Badge
                                      key={jornada.id}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {jornada.nombre}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {rector.institucion ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Institución</span>
                  </CardTitle>
                  <CardDescription>Institución educativa asignada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Nombre</p>
                    <p className="text-sm text-gray-900">{rector.institucion.nombre}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Rector Encargado
                    </p>
                    <p className="text-sm text-gray-900">
                      {rector.rector.nombre} {rector.rector.apellido}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Fecha de Creación
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(rector.institucion.created_at)}
                    </p>
                  </div>

                  {rector.institucion.sedes && rector.institucion.sedes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Total de Sedes
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <span className="text-lg font-bold text-blue-600">
                            {rector.institucion.sedes.length}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          sede{rector.institucion.sedes.length !== 1 ? "s" : ""}{" "}
                          registrada
                          {rector.institucion.sedes.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Institución</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No hay institución asignada</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/dashboard/rectores/${rectorId}/editar`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={refresh}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Actualizar Datos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
