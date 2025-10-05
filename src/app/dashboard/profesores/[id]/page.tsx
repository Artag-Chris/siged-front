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

// Importar la nueva arquitectura de empleados
import { useEmpleados } from '@/hooks/useEmpleados';
import { Empleado } from '@/types/empleados.types';
import { ProtectedRoute } from '@/components/protected-route';

function ProfessorDetailContent() {
  const params = useParams()
  const professorId = params.id as string
  
  // Usar el hook de empleados
  const {
    selectedEmpleado,
    isLoading,
    error,
    
    // Operaciones
    getEmpleadoById,
    uploadDocument,
    clearErrors,
    
    // Auth
    isUserAuthenticated,
    currentUser
  } = useEmpleados();

  const [professor, setProfessor] = useState<Empleado | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [documents, setDocuments] = useState<any[]>([]) // Para almacenar documentos cargados
  const [refreshDocuments, setRefreshDocuments] = useState(0) // Para triggear recarga de documentos

  // Cargar profesor al montar el componente
  useEffect(() => {
    if (professorId && isUserAuthenticated) {
      loadProfessor()
    }
  }, [professorId, isUserAuthenticated])

  const loadProfessor = async () => {
    try {
      console.log('🔍 [PROFESSOR] Cargando profesor con UUID:', professorId);
      const empleado = await getEmpleadoById(professorId);
      
      if (empleado && empleado.cargo === 'Docente') {
        setProfessor(empleado);
        console.log('✅ [PROFESSOR] Profesor cargado:', {
          uuid: empleado.id,
          nombre: `${empleado.nombre} ${empleado.apellido}`,
          documento: empleado.documento,
          email: empleado.email
        });
      } else {
        console.warn('⚠️ [PROFESSOR] Empleado no es Docente o no existe');
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
    
    // Agregar el documento a la lista local
    setDocuments(prev => [document, ...prev]);
    
    // Triggear recarga de documentos en el componente de búsqueda
    setRefreshDocuments(prev => prev + 1);
    
    // Cambiar a la pestaña de documentos para ver el resultado
    setActiveTab("documents");
  }

  const handleCVUploadError = (error: string) => {
    console.error('❌ [CV-UPLOAD] Error subiendo documento:', error);
    // El error se maneja en el componente CVUploadForm
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

        {/* Error */}
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

        {/* Usuario actual */}
        {currentUser && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>Sesión Activa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Usuario</p>
                  <p className="text-green-900 font-semibold">{currentUser.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-green-900">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Rol</p>
                  <Badge variant="default">{currentUser.rol}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
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
              {/* Información del profesor para CV Upload */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-700">
                    <Upload className="h-5 w-5" />
                    <span>Sistema de Upload Real - CV API</span>
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Subir documentos PDF usando la API real de procesamiento de hojas de vida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">UUID Real</p>
                      <p className="text-blue-900 font-mono text-sm">{professor.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nombre Completo</p>
                      <p className="text-blue-900 font-semibold">{professor.nombre} {professor.apellido}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Documento</p>
                      <p className="text-blue-900">{professor.tipo_documento}: {professor.documento}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

              {/* Info del sistema de búsqueda */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <Eye className="h-5 w-5" />
                    <span>Sistema Específico del Empleado - Nueva API</span>
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Usando <code>/api/retrieval/employee/{professor.id}</code> para filtrar solo documentos de este profesor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Endpoint Optimizado</p>
                      <Badge variant="default" className="font-mono text-xs">
                        /employee/{professor.id.slice(0, 8)}...
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Beneficios</p>
                      <p className="text-green-900 text-sm">Solo docs del profesor, búsqueda rápida</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Refresh Trigger</p>
                      <p className="text-green-900 text-sm">Auto-recarga: {refreshDocuments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EmployeeDocumentSearch con API específica */}
              <EmployeeDocumentSearch
                employeeUuid={professor.id}
                employeeName={`${professor.nombre} ${professor.apellido}`}
                onDocumentSelect={(doc) => {
                  console.log('📄 [DOCUMENT] Documento seleccionado:', doc);
                  // Opcional: agregar lógica adicional cuando se selecciona un documento
                }}
                autoLoad={true}
                key={refreshDocuments} // Force re-render when documents are uploaded
              />
              
              {/* Debug Section - Testing con UUID conocido */}
              <Card className="border-orange-200 bg-orange-50 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-700">
                    <AlertCircle className="h-5 w-5" />
                    <span>Debug: Testing con UUID Conocido</span>
                  </CardTitle>
                  <CardDescription className="text-orange-600">
                    Prueba temporal con el UUID que sabemos que funciona
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">UUID Actual del Profesor:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{professor.id}</code>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">UUID de Prueba (que funciona):</p>
                      <code className="bg-green-100 px-2 py-1 rounded text-sm">3389ecbe-a18c-11f0-99f3-0242ac120002</code>
                    </div>
                    <Button 
                      onClick={() => {
                        const testUuid = '3389ecbe-a18c-11f0-99f3-0242ac120002';
                        console.log('🧪 [TEST] Probando con UUID conocido:', testUuid);
                        window.open(`https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/employee/${testUuid}`, '_blank');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      🧪 Probar API con UUID Conocido (abrir en nueva pestaña)
                    </Button>
                    
                    {/* Botón para probar con fetch directo */}
                    <Button 
                      onClick={async () => {
                        const testUrl = 'https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/employee/3389ecbe-a18c-11f0-99f3-0242ac120002';
                        console.log('🔬 [FETCH-TEST] Probando con fetch directo:', testUrl);
                        
                        try {
                          const response = await fetch(testUrl, {
                            method: 'GET',
                            headers: {
                              'Accept': 'application/json'
                            }
                          });
                          
                          console.log('🔬 [FETCH-TEST] Response status:', response.status);
                          console.log('🔬 [FETCH-TEST] Response ok:', response.ok);
                          
                          if (response.ok) {
                            const data = await response.json();
                            console.log('✅ [FETCH-TEST] SUCCESS! Data:', data);
                            alert(`¡Fetch directo funcionó! Total documentos: ${data.documents?.length || 0}`);
                          } else {
                            console.error('❌ [FETCH-TEST] Error:', response.statusText);
                            alert(`Fetch directo falló: ${response.status} ${response.statusText}`);
                          }
                        } catch (error) {
                          console.error('❌ [FETCH-TEST] Error:', error);
                          alert(`Error: ${error}`);
                        }
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      🔬 Probar con Fetch Directo (Console)
                    </Button>
                    
                    {/* Debugging directo - comparar UUIDs */}
                    <div className="border-2 border-red-300 p-4 rounded-lg bg-red-50">
                      <p className="text-sm font-medium text-red-700 mb-2">🚨 DEBUGGING CRÍTICO:</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-bold">UUID del profesor actual:</span>
                          <br />
                          <code className="bg-red-100 px-1 rounded">{professor.id}</code>
                        </div>
                        <div>
                          <span className="font-bold">UUID que funciona:</span>
                          <br />
                          <code className="bg-green-100 px-1 rounded">3389ecbe-a18c-11f0-99f3-0242ac120002</code>
                        </div>
                        <div>
                          <span className="font-bold">¿Son iguales?</span>
                          <br />
                          <Badge variant={professor.id === '3389ecbe-a18c-11f0-99f3-0242ac120002' ? 'default' : 'destructive'}>
                            {professor.id === '3389ecbe-a18c-11f0-99f3-0242ac120002' ? 'SÍ ✅' : 'NO ❌'}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => {
                          console.log('🔍 DEBUGGING INFO:');
                          console.log('- Professor ID:', professor.id);
                          console.log('- Professor ID length:', professor.id.length);
                          console.log('- Working UUID:', '3389ecbe-a18c-11f0-99f3-0242ac120002');
                          console.log('- Working UUID length:', '3389ecbe-a18c-11f0-99f3-0242ac120002'.length);
                          console.log('- Are equal?:', professor.id === '3389ecbe-a18c-11f0-99f3-0242ac120002');
                          console.log('- Character by character comparison:');
                          for (let i = 0; i < Math.max(professor.id.length, 36); i++) {
                            const char1 = professor.id[i] || 'undefined';
                            const char2 = '3389ecbe-a18c-11f0-99f3-0242ac120002'[i] || 'undefined';
                            console.log(`  [${i}]: "${char1}" vs "${char2}" ${char1 === char2 ? '✅' : '❌'}`);
                          }
                        }}
                        variant="destructive" 
                        size="sm"
                        className="mt-2 w-full"
                      >
                        🔍 Debug UUID Comparison (Console)
                      </Button>
                    </div>
                    
                    {/* Componente temporal para testing */}
                    <div className="border-2 border-dashed border-orange-300 p-4 rounded-lg">
                      <p className="text-sm font-medium text-orange-700 mb-2">Testing Temporal:</p>
                      <EmployeeDocumentSearch
                        employeeUuid="3389ecbe-a18c-11f0-99f3-0242ac120002"
                        employeeName="Pepa Pig (Test)"
                        onDocumentSelect={(doc) => {
                          console.log('📄 [TEST-DOCUMENT] Documento de prueba seleccionado:', doc);
                        }}
                        autoLoad={true}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
