"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
    GraduationCap,
    FileText,
    Download,
    Trash2,
    Edit,
    Building2,
} from "lucide-react"
import Link from "next/link"
import { getCategoryColor, getCategoryLabel } from "@/funtions"
import { Rector } from "@/interfaces"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRectorStore } from "@/lib/principals-store"
import { useRectorDocumentStore } from "@/lib/PrincipalDocument-store"


export default function RectorDetailPage() {
    const params = useParams()
    const rectorId = params.id as string
    const { getRector } = useRectorStore()
    const { getDocumentsByRector, deleteDocument } = useRectorDocumentStore()

    const { getInstitution } = useInstitutionStore()
    const [rector, setRector] = useState<Rector | null>(null)
    const [institution, setInstitution] = useState<any>(null)
    const [documents, setDocuments] = useState<any[]>([])
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const rect = getRector(rectorId)
        if (rect) {
            setRector(rect)
            const inst = getInstitution(rect.institucionId)
            setInstitution(inst)
            const docs = getDocumentsByRector(rectorId)
            setDocuments(docs)
        }
    }, [rectorId, getRector, getInstitution, getDocumentsByRector, refreshKey])

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

    if (!rector) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Alert variant="destructive">
                    <AlertDescription>Rector no encontrado</AlertDescription>
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
                        <Link href="/dashboard/rectores">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {rector.nombres} {rector.apellidos}
                            </h1>
                            <p className="text-gray-600">Rector de {institution?.nombre || "institución"}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={`/dashboard/rectores/${rectorId}/editar`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                        <Link href={`/dashboard/rectores/${rectorId}/pae`}>
                            <Button>
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Gestionar PAE
                            </Button>
                        </Link>
                        <Badge variant={rector.estado === "activa" ? "default" : "secondary"}>
                            {rector.estado === "activa" ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información del Rector */}
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
                                            <p className="text-sm text-gray-900">{rector.cedula}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Email</p>
                                            <p className="text-sm text-gray-900">{rector.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Teléfono</p>
                                            <p className="text-sm text-gray-900">{rector.telefono}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información Profesional */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <GraduationCap className="h-5 w-5" />
                                    <span>Información Profesional</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Años de Experiencia</p>
                                        <p className="text-sm text-gray-900">{rector.experienciaAnios} años</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Fecha de Vinculación</p>
                                        <p className="text-sm text-gray-900">{new Date(rector.fechaVinculacion).toLocaleDateString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Estado</p>
                                        <p className="text-sm text-gray-900 capitalize">{rector.estado}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información de la Institución */}
                        {institution && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Building2 className="h-5 w-5" />
                                        <span>Institución Asignada</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Nombre</p>
                                                <p className="text-sm text-gray-900">{institution.nombre}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Código DANE</p>
                                                <p className="text-sm text-gray-900">{institution.codigoDane || "No disponible"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Dirección</p>
                                                <p className="text-sm text-gray-900">{institution.direccion}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Teléfono</p>
                                                <p className="text-sm text-gray-900">{institution.telefono || "No disponible"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Zona</p>
                                                <p className="text-sm text-gray-900 capitalize">{institution.zona}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Comuna</p>
                                                <p className="text-sm text-gray-900">{institution.comuna}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Documentos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Documentos ({documents.length})</span>
                                </CardTitle>
                                <CardDescription>Documentos relacionados con el rector</CardDescription>
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Upload de documentos */}
                    <div>
                        <DocumentUpload rectorId={rectorId} onUploadSuccess={handleDocumentUploadSuccess} />
                    </div>
                </div>
            </div>
        </div>
    )
}