"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CVUploadForm from "@/components/cv-upload-form"
import EmployeeDocumentSearch from "@/components/employee-document-search"
import EmployeeDocumentStats from "@/components/employee-document-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Edit,
  Upload,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck
} from "lucide-react"

import Link from "next/link"
import { useEmpleados } from '@/hooks/useEmpleados';
import { Empleado } from '@/types/empleados.types';
import { ProtectedRoute } from '@/components/protected-route';

function ProfessorDetailContent() {
  const params = useParams()
  const professorId = params.id as string

  const {
    isLoading,
    error,
    getEmpleadoById,
    clearErrors,
    isUserAuthenticated,
  } = useEmpleados();

  const [professor, setProfessor] = useState<Empleado | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [refreshDocuments, setRefreshDocuments] = useState(0) 
  
  useEffect(() => {
    if (professorId && isUserAuthenticated) {
      loadProfessor()
    }
  }, [professorId, isUserAuthenticated])

  const loadProfessor = async () => {
    try {

      const empleado = await getEmpleadoById(professorId);

      if (empleado && empleado.cargo === 'Docente') {
        setProfessor(empleado);

      } else {

        setProfessor(null);
      }
    } catch (error) {
      console.error('❌ [PROFESSOR] Error cargando profesor:', error);
      setProfessor(null);
    }
  }

  // Callbacks para CV Upload (arquitectura real)
  const handleCVUploadSuccess = (document: any) => {
    console.log('✅ [CV-UPLOAD] Documento subido exitosamente:', {
      id: document.id,
      filename: document.filename,
      empleadoUuid: professor?.id
    });

    setRefreshDocuments(prev => prev + 1);

    setActiveTab("documents");
  }

  const handleCVUploadError = (error: string) => {
    console.error('❌ [CV-UPLOAD] Error subiendo documento:', error);
  }

  if (!isUserAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Debes estar autenticado para ver esta página</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del profesor...</p>
        </div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profesor no encontrado</h2>
            <p className="text-gray-600 mb-6">
              El profesor con ID {professorId} no existe o no es un Docente válido.
            </p>
            <Link href="/dashboard/profesores">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Profesores
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/profesores">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {professor.nombre} {professor.apellido}
              </h1>
              <p className="text-gray-600">Perfil del Profesor - Arquitectura JWT</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/profesores/${professor.id}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button onClick={loadProfessor} variant="outline" size="sm" disabled={isLoading}>
              <Clock className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button onClick={clearErrors} variant="ghost" size="sm" className="ml-2">
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}
 

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Subir CV (API Real)
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Eye className="h-4 w-4 mr-2" />
              Buscar & Ver Documentos
            </TabsTrigger>
          </TabsList>

          {/* TAB: Perfil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Datos personales y profesionales del docente (UUID: {professor.id})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Datos Personales</h3>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                          <p className="text-gray-900">{professor.nombre} {professor.apellido}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Documento</p>
                          <p className="text-gray-900">{professor.tipo_documento}: {professor.documento}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900">{professor.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dirección</p>
                          <p className="text-gray-900">{professor.direccion}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información Profesional */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Profesional</h3>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cargo</p>
                          <Badge variant="default">{professor.cargo}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Estado</p>
                          <Badge variant={professor.estado === "activo" ? "default" : "secondary"}>
                            {professor.estado}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                          <p className="text-gray-900">
                            {new Date(professor.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                          <p className="text-gray-900">
                            {new Date(professor.updated_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: Subir CV - Arquitectura Real */}
          <TabsContent value="upload">
            <div className="space-y-6">
             

              {/* CV Upload Form - Componente Real */}
              <CVUploadForm
                professorId={professor.id}
                professorData={{
                  name: `${professor.nombre} ${professor.apellido}`,
                  cedula: professor.documento
                }}
                onUploadSuccess={handleCVUploadSuccess}
                onUploadError={handleCVUploadError}
              />
            </div>
          </TabsContent>

          {/* TAB: Buscar y Ver Documentos - Arquitectura Real */}
          <TabsContent value="documents">
            <div className="space-y-6">
              {/* Estadísticas de documentos */}
              <EmployeeDocumentStats
                employeeUuid={professor.id}
                refreshTrigger={refreshDocuments}
              />

              {/* EmployeeDocumentSearch con API específica */}
              <EmployeeDocumentSearch
                employeeUuid={professor.id}
                employeeName={`${professor.nombre} ${professor.apellido}`}
                onDocumentSelect={(doc) => {
                  // console.log('📄 [DOCUMENT] Documento seleccionado:', doc);
                  // Opcional: agregar lógica adicional cuando se selecciona un documento
                }}
                autoLoad={true}
                key={`${professor.id}-${refreshDocuments}`} // Force re-render cuando cambie UUID o refresh
              />             
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ProfessorDetailPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <ProfessorDetailContent />
    </ProtectedRoute>
  );
}
