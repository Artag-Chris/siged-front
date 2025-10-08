// app/dashboard/actos-administrativos/[id]/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText,
  ArrowLeft,
  Calendar,
  Building2,
  Edit,
  Loader2,
  Eye,
  Download,
  ClipboardList
} from 'lucide-react';
import { ActoAdministrativo } from '@/types/actos-administrativos.types';
import actosAdministrativosService from '@/services/actos-administrativos.service';

function ActoAdministrativoDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [acto, setActo] = useState<ActoAdministrativo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Cargar datos del acto administrativo
  useEffect(() => {
    const fetchActo = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 [ACTO-ADMIN-DETAIL] Cargando acto administrativo:', id);
        
        if (isNaN(id)) {
          throw new Error('ID de acto administrativo inválido');
        }

        const data = await actosAdministrativosService.getActoAdministrativoById(id);
        setActo(data);
        
        console.log('✅ [ACTO-ADMIN-DETAIL] Acto administrativo cargado:', data);
        console.log('📄 [ACTO-ADMIN-DETAIL] Documentos encontrados:', data.documentos_actos_administrativos?.length || 0);
        
        if (data.documentos_actos_administrativos && data.documentos_actos_administrativos.length > 0) {
          console.log('📋 [ACTO-ADMIN-DETAIL] Primer documento:', {
            id: data.documentos_actos_administrativos[0].id,
            nombre: data.documentos_actos_administrativos[0].nombre,
            ruta_relativa: data.documentos_actos_administrativos[0].ruta_relativa,
            tiene_ruta: !!data.documentos_actos_administrativos[0].ruta_relativa,
            tipo_ruta: typeof data.documentos_actos_administrativos[0].ruta_relativa
          });
        }
      } catch (err: any) {
        console.error('❌ [ACTO-ADMIN-DETAIL] Error:', err);
        setError(err.message || 'Error al cargar el acto administrativo');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActo();
    }
  }, [id]);

  // Handlers para documentos
  const handleDownloadDocument = async (rutaRelativa: string, nombreArchivo: string) => {
    try {
      console.log('🎯 [ACTO-ADMIN-DETAIL] Intentando descargar documento:', {
        rutaRelativa,
        nombreArchivo,
        tiene_ruta: !!rutaRelativa,
        tipo_ruta: typeof rutaRelativa,
        longitud: rutaRelativa?.length
      });
      
      await actosAdministrativosService.descargarDocumento(rutaRelativa, nombreArchivo);
      setDownloadSuccess(`Documento "${nombreArchivo}" descargado correctamente`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error: any) {
      console.error('❌ [ACTO-ADMIN-DETAIL] Error en handleDownloadDocument:', error);
      setDownloadError(error.message || 'Error al descargar el documento');
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  const handleViewDocument = async (rutaRelativa: string, nombreArchivo: string) => {
    try {
      console.log('🎯 [ACTO-ADMIN-DETAIL] Intentando ver documento:', {
        rutaRelativa,
        nombreArchivo,
        tiene_ruta: !!rutaRelativa,
        tipo_ruta: typeof rutaRelativa,
        longitud: rutaRelativa?.length
      });
      
      await actosAdministrativosService.verDocumento(rutaRelativa);
      setDownloadSuccess(`Visualizando "${nombreArchivo}" en nueva pestaña`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error: any) {
      console.error('❌ [ACTO-ADMIN-DETAIL] Error en handleViewDocument:', error);
      setDownloadError(error.message || 'Error al visualizar el documento');
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Cargando acto administrativo...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !acto) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Error al cargar el acto administrativo
                </h3>
                <p className="text-red-600 mb-4">{error || 'Acto administrativo no encontrado'}</p>
                <Button onClick={() => router.push('/dashboard/actos-administrativos')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/actos-administrativos')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle del Acto Administrativo
              </h1>
            </div>
          </div>
          
          <Link href={`/dashboard/actos-administrativos/${id}/editar`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        {/* Alertas */}
        {downloadSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-600">
              {downloadSuccess}
            </AlertDescription>
          </Alert>
        )}

        {downloadError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-600">
              {downloadError}
            </AlertDescription>
          </Alert>
        )}

        {/* Información Principal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información del Acto Administrativo</CardTitle>
            <CardDescription>Detalles de la resolución generada automáticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ClipboardList className="h-4 w-4" />
                  <span className="font-medium">ID del Acto</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-xl text-blue-600">
                    #{acto.id}
                  </p>
                </div>
              </div>

              {/* Nombre (Resolución) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Nombre de la Resolución</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-lg text-gray-900">
                    {acto.nombre}
                  </p>
                  {acto.consecutivo && (
                    <p className="text-sm text-gray-500">
                      Consecutivo: {acto.consecutivo}
                    </p>
                  )}
                </div>
              </div>

              {/* Institución Educativa */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Institución Educativa</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-lg">
                    {acto.institucion_educativa?.nombre || 'No disponible'}
                  </p>
                </div>
              </div>

              {/* Fecha de Creación */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de Creación</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-lg">
                    {formatDate(acto.fecha_creacion)}
                  </p>
                </div>
              </div>

              {/* Fecha de Registro */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de Registro en Sistema</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm text-gray-600">
                    {formatDate(acto.created_at)}
                  </p>
                </div>
              </div>

              {/* Última Actualización */}
              {acto.updated_at && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Última Actualización</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-sm text-gray-600">
                      {formatDate(acto.updated_at)}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Descripción */}
            {acto.descripcion && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                  {acto.descripcion}
                </p>
              </div>
            )}

            {/* Badge de generación automática */}
            {acto.patron_generado && (
              <div className="mt-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  ✓ Nombre generado automáticamente
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentos Adjuntos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documentos Adjuntos</CardTitle>
                <CardDescription>
                  Archivos asociados al acto administrativo
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {acto.documentos_actos_administrativos?.length || 0} documento(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!acto.documentos_actos_administrativos || acto.documentos_actos_administrativos.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No hay documentos adjuntos</p>
                <p className="text-sm text-gray-400 mt-1">
                  Los documentos son obligatorios al crear un acto administrativo
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {acto.documentos_actos_administrativos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {doc.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Subido el {formatDate(doc.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(doc.ruta_relativa, doc.nombre)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadDocument(doc.ruta_relativa, doc.nombre)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default function ActoAdministrativoDetailPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <ActoAdministrativoDetailContent />
    </ProtectedRoute>
  );
}
