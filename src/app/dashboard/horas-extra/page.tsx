// app/dashboard/horas-extra/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHorasExtra } from '@/hooks/useHorasExtra';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { HorasExtraFilters } from '@/types/horas-extra.types';

function HorasExtraContent() {
  const router = useRouter();
  const { 
    horasExtra, 
    loading, 
    error, 
    pagination,
    loadHorasExtra,
    eliminarHoraExtra 
  } = useHorasExtra();

  const [filters, setFilters] = useState<HorasExtraFilters>({
    page: 1,
    limit: 10,
    jornada: undefined,
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Cargar horas extra al montar y cuando cambien filtros
  useEffect(() => {
    loadHorasExtra(filters);
  }, [filters, loadHorasExtra]);

  const handleFilterChange = (field: keyof HorasExtraFilters, value: any) => {
    const newFilters = { 
      ...filters, 
      [field]: value === 'all' ? undefined : value,
      page: 1
    };
    setFilters(newFilters);
    loadHorasExtra(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    loadHorasExtra(newFilters);
  };

  const handleDelete = async (id: string, empleado: string) => {
    if (!confirm(`¿Estás seguro de eliminar el registro de horas extra de ${empleado}?`)) {
      return;
    }

    try {
      await eliminarHoraExtra(id);
      alert('Registro eliminado exitosamente');
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Horas Extra</h1>
                <p className="text-sm text-gray-500">Gestión de registros de horas extra</p>
              </div>
            </div>
            
            <Link href="/dashboard/horas-extra/crear">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Horas Extra
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <CardTitle>Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Filtro por jornada */}
              <Select
                value={filters.jornada || 'all'}
                onValueChange={(value) => handleFilterChange('jornada', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las jornadas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="ma_ana">Mañana</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="sabatina">Sabatina</SelectItem>
                  <SelectItem value="nocturna">Nocturna</SelectItem>
                </SelectContent>
              </Select>

              {/* Botón refrescar */}
              <Button 
                variant="outline" 
                onClick={() => loadHorasExtra(filters)}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>

            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && !error && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Cargando registros de horas extra...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Horas Extra */}
        {!loading && !error && (
          <>
            <div className="grid gap-4 mb-6">
              {horasExtra.length === 0 ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay registros de horas extra
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Comienza registrando las primeras horas extra
                      </p>
                      <Link href="/dashboard/horas-extra/crear">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Registrar Horas Extra
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                horasExtra.map((hora) => (
                  <Card key={hora.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        
                        {/* Info principal */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="h-5 w-5 text-purple-600" />
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {hora.empleado?.nombre} {hora.empleado?.apellido}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {hora.empleado?.documento}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            
                            {/* Sede */}
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Sede</p>
                                <p className="text-sm font-medium">{hora.sede?.nombre}</p>
                              </div>
                            </div>

                            {/* Cantidad */}
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Horas</p>
                                <p className="text-sm font-medium">{hora.cantidad_horas}h</p>
                              </div>
                            </div>

                            {/* Fecha */}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Fecha</p>
                                <p className="text-sm font-medium">{formatDate(hora.fecha_realizacion)}</p>
                              </div>
                            </div>

                            {/* Jornada */}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Jornada</p>
                              {getJornadaBadge(hora.jornada)}
                            </div>

                          </div>

                          {/* Observación */}
                          {hora.observacion && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-600">{hora.observacion}</p>
                            </div>
                          )}

                          {/* Documentos */}
                          {hora.documentos_horas_extra && hora.documentos_horas_extra.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <p className="text-sm text-blue-600">
                                {hora.documentos_horas_extra.length} documento(s) adjunto(s)
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/horas-extra/${hora.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/horas-extra/${hora.id}/editar`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(
                              hora.id, 
                              `${hora.empleado?.nombre} ${hora.empleado?.apellido}`
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Página {pagination.currentPage} de {pagination.totalPages} 
                      ({pagination.totalItems} registros)
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNextPage}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
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

export default function HorasExtraPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <HorasExtraContent />
    </ProtectedRoute>
  );
}
