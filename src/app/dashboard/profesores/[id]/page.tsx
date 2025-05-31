"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import { useDocumentStore } from "@/lib/document-store"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentViewer } from "@/components/document-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Download,
  Trash2,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { useProfessorStore, Professor } from "@/lib/profesor-store"

export default function ProfessorDetailPage() {
  const params = useParams()
  const professorId = params.id as string

  const { getProfessor } = useProfessorStore()
  const { getDocumentsByProfessor, deleteDocument } = useDocumentStore()

  const [professor, setProfessor] = useState<Professor | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const prof = getProfessor(professorId)
    if (prof) {
      setProfessor(prof)
      const docs = getDocumentsByProfessor(professorId)
      setDocuments(docs)
    }
  }, [professorId, getProfessor, getDocumentsByProfessor, refreshKey])

  const handleDocumentUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este documento?")) {
      const success = await deleteDocument(documentId)
      if (success) {
        setRefreshKey((prev) => prev + 1)
      }
    }
  }

  const handleDownloadDocument = (doc: any) => {
    // En producción, esto descargaría el archivo real
    const link = document.createElement("a")
    link.href = doc.fileUrl
    link.download = doc.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      contrato: "Contrato",
      hoja_vida: "Hoja de Vida",
      certificados: "Certificados",
      evaluaciones: "Evaluaciones",
      otros: "Otros",
    }
    return categories[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      contrato: "bg-blue-100 text-blue-800",
      hoja_vida: "bg-green-100 text-green-800",
      certificados: "bg-purple-100 text-purple-800",
      evaluaciones: "bg-orange-100 text-orange-800",
      otros: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  if (!professor) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Profesor no encontrado</AlertDescription>
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
            <Link href="/dashboard/profesores">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {professor.nombres} {professor.apellidos}
              </h1>
              <p className="text-gray-600">{professor.cargo}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/profesores/${professorId}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Badge variant={professor.estado === "activa" ? "default" : "secondary"}>
              {professor.estado === "activa" ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del Profesor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos Personales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cédula</p>
                      <p className="text-sm text-gray-900">{professor.cedula}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-900">{professor.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Teléfono</p>
                      <p className="text-sm text-gray-900">{professor.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fecha de Nacimiento</p>
                      <p className="text-sm text-gray-900">
                        {new Date(professor.fechaNacimiento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dirección</p>
                      <p className="text-sm text-gray-900">{professor.direccion}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Académica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Información Académica</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nivel Educativo</p>
                    <p className="text-sm text-gray-900 capitalize">{professor.nivelEducativo.replace("_", " ")}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Años de Experiencia</p>
                    <p className="text-sm text-gray-900">{professor.experienciaAnios} años</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha de Vinculación</p>
                    <p className="text-sm text-gray-900">{new Date(professor.fechaVinculacion).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Institución de Graduación</p>
                    <p className="text-sm text-gray-900">{professor.institucionGraduacion}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Materias que puede enseñar</p>
                  <div className="flex flex-wrap gap-1">
                    {professor.materias.map((materia) => (
                      <Badge key={materia} variant="outline">
                        {materia}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Materias asignadas actualmente</p>
                  <div className="flex flex-wrap gap-1">
                    {professor.materiasAsignadas.map((materia) => (
                      <Badge key={materia} variant="default">
                        {materia}
                      </Badge>
                    ))}
                  </div>
                </div>

                {professor.observaciones && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Observaciones</p>
                    <p className="text-sm text-gray-900">{professor.observaciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documentos ({documents.length})</span>
                </CardTitle>
                <CardDescription>Documentos relacionados con el profesor</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay documentos subidos</p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getCategoryColor(doc.category)}`}>
                                {getCategoryLabel(doc.category)}
                              </Badge>
                              <span className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(doc.uploadDate).toLocaleDateString()}
                              </span>
                            </div>
                            {doc.description && (
                              <p className="text-xs text-gray-600 mt-1 truncate">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0">
                          <DocumentViewer fileName={doc.fileName}  fileType={doc.fileType} />
                          <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Upload de documentos */}
          <div>
            <DocumentUpload professorId={professorId} onUploadSuccess={handleDocumentUploadSuccess} />
          </div>
        </div>
      </div>
    </div>
  )
}
