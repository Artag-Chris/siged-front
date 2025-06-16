"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, FileText, User, Phone, School, Calendar, CheckCircle, Clock, XCircle, Eye } from "lucide-react"

import type { SolicitudCupo } from "@/interfaces/solicitud-cupo"
import { useRouter } from "next/navigation"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useSolicitudCupoStore } from "@/lib/solicitud-cupo-store"

export default function SolicitudConsulta() {
  const router = useRouter()
  const { getSolicitudByRadicado, searchSolicitudes } = useSolicitudCupoStore()
  const { getInstitution } = useInstitutionStore()

  const [searchType, setSearchType] = useState<"radicado" | "datos">("radicado")
  const [radicado, setRadicado] = useState("")
  const [nombreNino, setNombreNino] = useState("")
  const [documentoNino, setDocumentoNino] = useState("")
  const [resultados, setResultados] = useState<SolicitudCupo[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearchByRadicado = () => {
    if (!radicado.trim()) return

    setLoading(true)
    setSearched(true)

    // Simular delay de búsqueda
    setTimeout(() => {
      const solicitud = getSolicitudByRadicado(radicado.trim())
      setResultados(solicitud ? [solicitud] : [])
      setLoading(false)
    }, 500)
  }

  const handleSearchByDatos = () => {
    if (!nombreNino.trim() && !documentoNino.trim()) return

    setLoading(true)
    setSearched(true)

    // Simular delay de búsqueda
    setTimeout(() => {
      const query = nombreNino.trim() || documentoNino.trim()
      const solicitudes = searchSolicitudes(query)
      setResultados(solicitudes)
      setLoading(false)
    }, 500)
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Aceptado":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Rechazado":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
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

  const resetSearch = () => {
    setRadicado("")
    setNombreNino("")
    setDocumentoNino("")
    setResultados([])
    setSearched(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultar Solicitud</h1>
          <p className="text-gray-600">Busque una solicitud por número de radicado o datos del estudiante</p>
        </div>

        {/* Formulario de búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Solicitud
            </CardTitle>
            <CardDescription>Seleccione el método de búsqueda que prefiera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selector de tipo de búsqueda */}
            <div className="flex gap-4">
              <Button
                variant={searchType === "radicado" ? "default" : "outline"}
                onClick={() => {
                  setSearchType("radicado")
                  resetSearch()
                }}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Por Radicado
              </Button>
              <Button
                variant={searchType === "datos" ? "default" : "outline"}
                onClick={() => {
                  setSearchType("datos")
                  resetSearch()
                }}
                className="flex-1"
              >
                <User className="w-4 h-4 mr-2" />
                Por Datos del Estudiante
              </Button>
            </div>

            <Separator />

            {/* Búsqueda por radicado */}
            {searchType === "radicado" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="radicado">Número de radicado</Label>
                  <Input
                    id="radicado"
                    value={radicado}
                    onChange={(e) => setRadicado(e.target.value.toUpperCase())}
                    placeholder="Ej: RAD-2024-000123"
                    className="font-mono"
                  />
                </div>
                <Button onClick={handleSearchByRadicado} disabled={!radicado.trim() || loading} className="w-full">
                  {loading ? "Buscando..." : "Buscar por Radicado"}
                </Button>
              </div>
            )}

            {/* Búsqueda por datos */}
            {searchType === "datos" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreNino">Nombre del estudiante</Label>
                    <Input
                      id="nombreNino"
                      value={nombreNino}
                      onChange={(e) => setNombreNino(e.target.value)}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentoNino">Documento del estudiante</Label>
                    <Input
                      id="documentoNino"
                      value={documentoNino}
                      onChange={(e) => setDocumentoNino(e.target.value)}
                      placeholder="Número de documento"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSearchByDatos}
                  disabled={(!nombreNino.trim() && !documentoNino.trim()) || loading}
                  className="w-full"
                >
                  {loading ? "Buscando..." : "Buscar por Datos"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        {searched && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados de la búsqueda</CardTitle>
              <CardDescription>
                {loading ? "Buscando solicitudes..." : `Se encontraron ${resultados.length} resultado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Buscando...</p>
                </div>
              ) : resultados.length === 0 ? (
                <Alert>
                  <Search className="h-4 w-4" />
                  <AlertDescription>
                    No se encontraron solicitudes con los criterios de búsqueda especificados.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {resultados.map((solicitud) => {
                    const institucion = getInstitution(solicitud.colegioSeleccionado)
                    return (
                      <div key={solicitud.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{solicitud.nombreNino}</h3>
                            <p className="text-sm text-gray-600">
                              {solicitud.tipoDocumentoNino}: {solicitud.documentoNino}
                            </p>
                          </div>
                          <Badge className={`${getEstadoColor(solicitud.estadoCupo)} border`}>
                            {getEstadoIcon(solicitud.estadoCupo)}
                            <span className="ml-1">{solicitud.estadoCupo}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{solicitud.radicado}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <School className="w-4 h-4 text-gray-400" />
                            <span>{institucion?.nombre || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>Grado {solicitud.gradoSolicitado}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(solicitud.fechaCreacion).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <Phone className="w-4 h-4" />
                          <span>Acudiente: {solicitud.nombreAcudiente}</span>
                          <span>•</span>
                          <span>{solicitud.telefonoContacto}</span>
                        </div>

                        <Button
                          onClick={() => router.push(`/solicitud-cupo/detalle/${solicitud.radicado}`)}
                          size="sm"
                          className="w-full md:w-auto"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles completos
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Acciones adicionales */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => router.push("/solicitud-cupo")}>
            Nueva solicitud
          </Button>
          {searched && (
            <Button variant="outline" onClick={resetSearch}>
              Nueva búsqueda
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
