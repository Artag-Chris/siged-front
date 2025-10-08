// app/dashboard/horas-extra/[id]/page.tsx
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
  Clock,
  ArrowLeft,
  Calendar,
  User,
  Building2,
  FileText,
  Edit,
  RefreshCw,
  Eye,
  Download,
  Loader2
} from 'lucide-react';
import { HoraExtra } from '@/types/horas-extra.types';
import horasExtraService from '@/services/horas-extra.service';

function HoraExtraDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [horaExtra, setHoraExtra] = useState<HoraExtra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Cargar datos de la hora extra
  useEffect(() => {
    const fetchHoraExtra = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 [HORAS-EXTRA-DETAIL] Cargando hora extra:', id);
        
        const data = await horasExtraService.getHoraExtraById(id);
        setHoraExtra(data);
        
        console.log('✅ [HORAS-EXTRA-DETAIL] Hora extra cargada:', data);
      } catch (err: any) {
        console.error('❌ [HORAS-EXTRA-DETAIL] Error:', err);
        setError(err.message || 'Error al cargar el registro');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHoraExtra();
    }
  }, [id]);

  // Handlers para documentos
  const handleDownloadDocument = async (rutaRelativa: string, nombreArchivo: string) => {
    try {
      await horasExtraService.descargarDocumento(rutaRelativa, nombreArchivo);
      setDownloadSuccess(`Documento "${nombreArchivo}" descargado correctamente`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error: any) {
      setDownloadError(error.message || 'Error al descargar el documento');
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  const handleViewDocument = async (rutaRelativa: string, nombreArchivo: string) => {
    try {
      await horasExtraService.verDocumento(rutaRelativa);
      setDownloadSuccess(`Visualizando "${nombreArchivo}" en nueva pestaña`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error: any) {
      setDownloadError(error.message || 'Error al visualizar el documento');
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  const getJornadaBadge = (jornada: string) => {
    const badges = {
      'ma_ana': <Badge className="bg-yellow-100 text-yellow-800">Mañana</Badge>,
      'tarde': <Badge className="bg-orange-100 text-orange-800">Tarde</Badge>,
      'sabatina': <Badge className="bg-purple-100 text-purple-800">Sabatina</Badge>,
      'nocturna': <Badge className="bg-blue-100 text-blue-800">Nocturna</Badge>,
    };
    return badges[jornada as keyof typeof badges] || <Badge>{jornada}</Badge>;
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
                <p className="text-gray-500">Cargando registro de horas extra...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !horaExtra) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Error al cargar el registro
                </h3>
                <p className="text-red-600 mb-4">{error || 'Registro no encontrado'}</p>
                <Button onClick={() => router.push('/dashboard/horas-extra')}>
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
              onClick={() => router.push('/dashboard/horas-extra')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Horas Extra
              </h1>
            </div>
          </div>
          
          <Link href={`/dashboard/horas-extra/${id}/editar`}>
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
            <CardTitle>Información del Registro</CardTitle>
            <CardDescription>Detalles de las horas extra realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Empleado */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Empleado</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-lg">
                    {horaExtra.empleado?.nombre} {horaExtra.empleado?.apellido}
                  </p>
                  <p className="text-sm text-gray-600">
                    Documento: {horaExtra.empleado?.documento}
                  </p>
                  {horaExtra.empleado?.email && (
                    <p className="text-sm text-gray-600">
                      Email: {horaExtra.empleado.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Sede */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Sede</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-lg">{horaExtra.sede?.nombre}</p>
                  {horaExtra.sede?.direccion && (
                    <p className="text-sm text-gray-600">{horaExtra.sede.direccion}</p>
                  )}
                </div>
              </div>

              {/* Cantidad de Horas */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Cantidad de Horas</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-2xl text-blue-600">
                    {horaExtra.cantidad_horas} horas
                  </p>
                </div>
              </div>

              {/* Fecha de Realización */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de Realización</span>
                </div>
                <div className="pl-6">
                  <p className="font-semibold text-lg">
                    {formatDate(horaExtra.fecha_realizacion)}
                  </p>
                </div>
              </div>

              {/* Jornada */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Jornada</span>
                </div>
                <div className="pl-6">
                  {getJornadaBadge(horaExtra.jornada)}
                </div>
              </div>

              {/* Fecha de Registro */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha de Registro</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm text-gray-600">
                    {formatDate(horaExtra.created_at)}
                  </p>
                </div>
              </div>

            </div>

            {/* Observación */}
            {horaExtra.observacion && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-700 mb-2">Observación</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                  {horaExtra.observacion}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentos de Soporte */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documentos de Soporte</CardTitle>
                <CardDescription>
                  Archivos adjuntos al registro de horas extra
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {horaExtra.documentos_horas_extra?.length || 0} documento(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!horaExtra.documentos_horas_extra || horaExtra.documentos_horas_extra.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No hay documentos adjuntos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {horaExtra.documentos_horas_extra.map((doc) => (
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

export default function HoraExtraDetailPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <HoraExtraDetailContent />
    </ProtectedRoute>
  );
}
