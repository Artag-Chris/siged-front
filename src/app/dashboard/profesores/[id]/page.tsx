"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useDocumentStore } from "@/lib/document-store"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentViewer } from "@/components/document-viewer"
import DocumentSearch from "@/components/document-search"
import CVUploadForm from "@/components/cv-upload-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Search,
  Upload,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { Professor } from "@/interfaces/Professor"
import { useProfessorStore } from "@/lib/profesor-store"
import { getCategoryColor, getCategoryLabel } from "@/funtions/professor"
import { Document } from "@/types/documentSearch"


export default function ProfessorDetailPage() {
  const params = useParams()
  const professorId = params.id as string
  const { getProfessor } = useProfessorStore()
  const { getDocumentsByProfessor, deleteDocument } = useDocumentStore()
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [activeTab, setActiveTab] = useState("search")

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
    // Cambiar a la pestaña de búsqueda para ver el documento subido
    setActiveTab("search")
  }

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document)
    console.log('Documento seleccionado:', document)
    // Aquí puedes abrir un modal, navegar a otra página, etc.
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
                    {professor.materias.map((materia:any) => (
                      <Badge key={materia} variant="outline">
                        {materia}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Materias asignadas actualmente</p>
                  <div className="flex flex-wrap gap-1">
                    {professor.materiasAsignadas.map((materia:any) => (
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

            {/* Gestión de Documentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Gestión de Documentos</span>
                </CardTitle>
                <CardDescription>
                  Busca documentos existentes o sube nuevos documentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="search" className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>Buscar</span>
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Subir</span>
                    </TabsTrigger>
                    <TabsTrigger value="local" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Locales ({documents.length})</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="search" className="space-y-4">
                    <DocumentSearch
                      professorId={professorId}
                      professorName={`${professor?.nombres} ${professor?.apellidos}`}
                      onDocumentSelect={handleDocumentSelect}
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    {/* Nuevo componente de subida CV */}
                    <CVUploadForm
                      professorId={professorId}
                      professorData={{
                        name: `${professor.nombres} ${professor.apellidos}`,
                        cedula: professor.cedula
                      }}
                      onUploadSuccess={(document) => {
                        console.log('✅ Documento CV subido:', document);
                        handleDocumentUploadSuccess();
                      }}
                      onUploadError={(error) => {
                        console.error('❌ Error subiendo CV:', error);
                      }}
                    />
                    
                    {/* Separador */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          O usar subida tradicional
                        </span>
                      </div>
                    </div>
                    
                    {/* Componente tradicional de subida */}
                    <DocumentUpload 
                      professorId={professorId} 
                      onUploadSuccess={handleDocumentUploadSuccess} 
                    />
                  </TabsContent>

                  <TabsContent value="local" className="space-y-4">
                    {documents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay documentos subidos localmente</p>
                        <p className="text-sm">Usa la pestaña "Subir" para agregar documentos</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
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
                              <DocumentViewer fileName={doc.fileName} fileType={doc.fileType} />
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Información adicional */}
          <div className="space-y-6">
            {selectedDocument && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Documento Seleccionado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedDocument.title || selectedDocument.filename}</p>
                    <p className="text-sm text-gray-600">{selectedDocument.description}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => window.open(selectedDocument.viewUrl, '_blank')}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(selectedDocument.downloadUrl, '_blank')}>
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Documentos locales:</span>
                    <span className="font-medium">{documents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última actualización:</span>
                    <span className="font-medium">
                      {documents.length > 0 
                        ? new Date(Math.max(...documents.map(d => new Date(d.uploadDate).getTime()))).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
