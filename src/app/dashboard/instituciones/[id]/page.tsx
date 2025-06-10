"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2, MapPin, Phone, Mail, User, Calendar, Clock, Edit, FileText } from "lucide-react"
import Link from "next/link"
import { useInstitutionStore } from "@/lib/instituition-store"
import { Institution } from "@/interfaces/intex"
import { getZonaLabel } from "@/funtions"


export default function InstitutionDetailPage() {
  const params = useParams()
  const institutionId = params.id as string

  const { getInstitution } = useInstitutionStore()
  const [institution, setInstitution] = useState<Institution | null>(null)

  useEffect(() => {
    const inst = getInstitution(institutionId)
    if (inst) {
      setInstitution(inst)
    }
  }, [institutionId, getInstitution])


  if (!institution) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Institución no encontrada</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/instituciones">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{institution.nombre}</h1>
              <p className="text-gray-600">{institution.comuna}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/instituciones/${institutionId}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Badge variant={institution.activa ? "default" : "secondary"}>
              {institution.activa ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Información Básica</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nombre de la Institución</p>
                      <p className="text-sm text-gray-900">{institution.nombre}</p>
                    </div>
                  </div>

                  {institution.codigoDane && (
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Código DANE</p>
                        <p className="text-sm text-gray-900">{institution.codigoDane}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dirección</p>
                      <p className="text-sm text-gray-900">{institution.direccion}</p>
                    </div>
                  </div>

                  {institution.telefono && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Teléfono</p>
                        <p className="text-sm text-gray-900">{institution.telefono}</p>
                      </div>
                    </div>
                  )}

                  {institution.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Correo Electrónico</p>
                        <p className="text-sm text-gray-900">{institution.email}</p>
                      </div>
                    </div>
                  )}

                  {institution.rector && (
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Rector / Encargado</p>
                        <p className="text-sm text-gray-900">{institution.rector}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información Territorial y Operativa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Información Territorial y Operativa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Zona</p>
                    <Badge variant="outline" className="mt-1">
                      {getZonaLabel(institution.zona)}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Estado</p>
                    <Badge variant={institution.activa ? "default" : "secondary"} className="mt-1">
                      {institution.activa ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">Comuna / Corregimiento</p>
                    <p className="text-sm text-gray-900 mt-1">{institution.comuna}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Jornadas</p>
                  <div className="flex flex-wrap gap-1">
                    {institution.jornadas.map((jornada:any) => (
                      <Badge key={jornada} variant="default">
                        {jornada.charAt(0).toUpperCase() + jornada.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {institution.observaciones && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Observaciones</p>
                    <p className="text-sm text-gray-900 mt-1">{institution.observaciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Historial</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fecha de Creación</p>
                      <p className="text-xs text-gray-500">
                        {new Date(institution.fechaCreacion).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Última Actualización</p>
                      <p className="text-xs text-gray-500">
                        {new Date(institution.fechaActualizacion).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Información Adicional */}
          <div className="space-y-6">
            {/* Resumen Rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Zona:</span>
                  <Badge variant="outline">{getZonaLabel(institution.zona)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <Badge variant={institution.activa ? "default" : "secondary"}>
                    {institution.activa ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jornadas:</span>
                  <span className="text-sm text-gray-900">{institution.jornadas.length}</span>
                </div>
                {institution.codigoDane && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Código DANE:</span>
                    <span className="text-sm text-gray-900 font-mono">{institution.codigoDane}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/dashboard/instituciones/${institutionId}/editar`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                </Link>
                <Link href={`/dashboard/instituciones/${institutionId}/cupos`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Gestionar Cupos
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Documentos
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <User className="h-4 w-4 mr-2" />
                  Ver Profesores
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
