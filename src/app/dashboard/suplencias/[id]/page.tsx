"use client"

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSuplencia } from '@/hooks/useSuplencias';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import suplenciaService from '@/services/suplencia.service';
import { 
  ArrowLeft, 
  UserX, 
  Calendar,
  Clock,
  MapPin,
  FileText,
  Edit,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function DetalleSuplenciaContent() {
  const params = useParams();
  const router = useRouter();
  const suplenciaId = params?.id as string;

  const { suplencia, loading, error } = useSuplencia(suplenciaId);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Obtener documentos directamente de la suplencia (ya vienen incluidos del backend)
  const documentos = suplencia?.documentos_suplencia || [];

  const handleDownloadDocument = async (rutaRelativa: string, nombreArchivo: string) => {
    try {
      console.log('📥 [SUPLENCIA-DETAIL] Iniciando descarga:', { rutaRelativa, nombreArchivo });
      await suplenciaService.descargarDocumento(rutaRelativa, nombreArchivo);
      setDownloadSuccess(`Documento "${nombreArchivo}" descargado correctamente`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-DETAIL] Error descargando documento:', error);
      setDownloadError(error.message || "No se pudo descargar el documento");
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  const handleViewDocument = async (rutaRelativa: string, nombreArchivo: string) => {
    try {
      console.log('👁️ [SUPLENCIA-DETAIL] Visualizando documento:', { rutaRelativa, nombreArchivo });
      await suplenciaService.verDocumento(rutaRelativa);
      setDownloadSuccess(`Visualizando "${nombreArchivo}" en nueva pestaña`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-DETAIL] Error visualizando documento:', error);
      setDownloadError(error.message || "No se pudo visualizar el documento");
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJornadaLabel = (jornada: string) => {
    const labels: Record<string, string> = {
      'ma_ana': 'Mañana',
      'tarde': 'Tarde',
      'sabatina': 'Sabatina'
    };
    return labels[jornada] || jornada;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-2 text-gray-600">Cargando suplencia...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !suplencia) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-6">
              <p className="text-red-600">❌ {error || 'Suplencia no encontrada'}</p>
              <Link href="/dashboard/suplencias">
                <Button variant="outline" size="sm" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
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
        <div className="mb-6">
          <Link href="/dashboard/suplencias">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Suplencias
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {suplencia.causa_ausencia}
                </h1>
                <p className="text-sm text-gray-500">
                  Detalles de la suplencia
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/dashboard/suplencias/${suplenciaId}/editar`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>

        {/* Información Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Docente Ausente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Docente Ausente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold text-lg">
                  {suplencia.empleado_suplencias_docente_ausente_idToempleado.nombre}{' '}
                  {suplencia.empleado_suplencias_docente_ausente_idToempleado.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Documento</p>
                <p className="font-medium">
                  {suplencia.empleado_suplencias_docente_ausente_idToempleado.documento}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">
                  {suplencia.empleado_suplencias_docente_ausente_idToempleado.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Periodo de Ausencia</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {formatDate(suplencia.fecha_inicio_ausencia)} - {formatDate(suplencia.fecha_fin_ausencia)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Docente de Reemplazo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Docente de Reemplazo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold text-lg">
                  {suplencia.empleado_suplencias_docente_reemplazo_idToempleado.nombre}{' '}
                  {suplencia.empleado_suplencias_docente_reemplazo_idToempleado.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Documento</p>
                <p className="font-medium">
                  {suplencia.empleado_suplencias_docente_reemplazo_idToempleado.documento}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">
                  {suplencia.empleado_suplencias_docente_reemplazo_idToempleado.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Periodo de Reemplazo</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {formatDate(suplencia.fecha_inicio_reemplazo)} - {formatDate(suplencia.fecha_fin_reemplazo)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Detalles del Reemplazo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles del Reemplazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Horas Cubiertas</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">{suplencia.horas_cubiertas}h</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Jornada</p>
                <Badge variant="default" className="text-sm px-3 py-1">
                  {getJornadaLabel(suplencia.jornada)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Sede</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">{suplencia.sede.nombre}</p>
                    <p className="text-xs text-gray-500 capitalize">{suplencia.sede.zona}</p>
                  </div>
                </div>
              </div>

            </div>

            {suplencia.observacion && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Observaciones</p>
                <p className="text-gray-900">{suplencia.observacion}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Documentos de Soporte
            </CardTitle>
            <CardDescription>
              Certificados médicos, permisos y otros documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mensajes de estado de descarga */}
            {downloadSuccess && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {downloadSuccess}
                </AlertDescription>
              </Alert>
            )}

            {downloadError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {downloadError}
                </AlertDescription>
              </Alert>
            )}

            {loading && (
              <p className="text-gray-500">Cargando documentos...</p>
            )}

            {!loading && documentos.length === 0 && (
              <p className="text-gray-500">No hay documentos adjuntos</p>
            )}

            {!loading && documentos.length > 0 && (
              <div className="space-y-2">
                {documentos.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.nombre}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString('es-CO')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Ruta: {doc.ruta_relativa}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDocument(doc.ruta_relativa, doc.nombre)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
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

export default function DetalleSuplenciaPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <DetalleSuplenciaContent />
    </ProtectedRoute>
  );
}
