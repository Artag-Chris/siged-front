// app/dashboard/suplencias/estadisticas/page.tsx
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useEstadisticasSuplencias } from '@/hooks/useSuplencias';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  BarChart3, 
  Clock,
  Calendar,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

function EstadisticasContent() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { estadisticas, loading, reload } = useEstadisticasSuplencias({ año: year });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
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
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Estadísticas de Suplencias</h1>
                <p className="text-sm text-gray-500">Resumen y análisis de reemplazos docentes</p>
              </div>
            </div>

            <Button 
              onClick={reload} 
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
          </div>
        )}

        {/* Estadísticas */}
        {!loading && estadisticas && (
          <>
            {/* Cards principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Total Suplencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-900">
                    {estadisticas.total_suplencias}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Registradas en {year}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                    Horas Cubiertas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-900">
                    {estadisticas.horas_totales_cubiertas}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Horas totales de reemplazo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Promedio por Suplencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-900">
                    {estadisticas.total_suplencias > 0 
                      ? (estadisticas.horas_totales_cubiertas / estadisticas.total_suplencias).toFixed(1)
                      : '0'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Horas promedio por suplencia
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Suplencias por jornada */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Distribución por Jornada</CardTitle>
                <CardDescription>
                  Suplencias registradas por turno de trabajo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estadisticas.suplencias_por_jornada.map((item) => (
                    <div key={item.jornada} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {item.jornada.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.total} suplencias - {item.horas}h
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(item.total / estadisticas.total_suplencias) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suplencias recientes */}
            {estadisticas.suplencias_recientes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Suplencias Recientes</CardTitle>
                  <CardDescription>
                    Últimas 10 suplencias registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estadisticas.suplencias_recientes.slice(0, 10).map((suplencia) => (
                      <div 
                        key={suplencia.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {suplencia.empleado_suplencias_docente_ausente_idToempleado.nombre}{' '}
                            {suplencia.empleado_suplencias_docente_ausente_idToempleado.apellido}
                          </p>
                          <p className="text-xs text-gray-500">
                            {suplencia.causa_ausencia}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{suplencia.horas_cubiertas}h</p>
                          <p className="text-xs text-gray-500">
                            {new Date(suplencia.created_at).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default function EstadisticasPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <EstadisticasContent />
    </ProtectedRoute>
  );
}
