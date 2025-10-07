// app/dashboard/suplencias/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSuplencias } from '@/hooks/useSuplencias';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserX, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  FileText,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { SuplenciaFilters } from '@/types/suplencia.types';

function SuplenciasContent() {
  const router = useRouter();
  const { 
    suplencias, 
    loading, 
    error, 
    pagination,
    loadSuplencias,
    eliminarSuplencia 
  } = useSuplencias();

  const [filters, setFilters] = useState<SuplenciaFilters>({
    page: 1,
    limit: 10,
    search: '',
    jornada: undefined,
  });

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    loadSuplencias(filters);
  }, [filters, loadSuplencias]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleFilterChange = (field: keyof SuplenciaFilters, value: any) => {
    const newFilters = { 
      ...filters, 
      [field]: value === 'all' ? undefined : value, 
      page: 1 
    };
    setFilters(newFilters);
    loadSuplencias(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDelete = async (id: string, causa: string) => {
    if (!confirm(`¿Estás seguro de eliminar la suplencia "${causa}"?`)) {
      return;
    }

    try {
      await eliminarSuplencia(id);
      alert('Suplencia eliminada exitosamente');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJornadaBadge = (jornada: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      'ma_ana': { label: 'Mañana', variant: 'default' },
      'tarde': { label: 'Tarde', variant: 'secondary' },
      'sabatina': { label: 'Sabatina', variant: 'outline' }
    };

    const config = variants[jornada] || { label: jornada, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Suplencias</h1>
                <p className="text-sm text-gray-500">Gestión de reemplazos docentes</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard/suplencias/estadisticas">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Estadísticas
                </Button>
              </Link>
              <Link href="/dashboard/suplencias/crear">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Suplencia
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Búsqueda general */}
              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar por docente, causa, sede..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

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
                </SelectContent>
              </Select>

              {/* Botón refrescar */}
              <Button 
                variant="outline" 
                onClick={() => loadSuplencias(filters)}
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
              <p className="text-red-600">❌ {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-2 text-gray-600">Cargando suplencias...</span>
          </div>
        )}

        {/* Lista de Suplencias */}
        {!loading && suplencias.length > 0 && (
          <>
            <div className="grid gap-4 mb-6">
              {suplencias.map((suplencia) => (
                <Card key={suplencia.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Información principal */}
                      <div className="md:col-span-5">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {suplencia.causa_ausencia}
                        </h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <UserX className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <span className="text-gray-600">Ausente: </span>
                              <span className="font-medium">
                                {suplencia.empleado_suplencias_docente_ausente_idToempleado.nombre}{' '}
                                {suplencia.empleado_suplencias_docente_ausente_idToempleado.apellido}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div>
                              <span className="text-gray-600">Reemplazo: </span>
                              <span className="font-medium">
                                {suplencia.empleado_suplencias_docente_reemplazo_idToempleado.nombre}{' '}
                                {suplencia.empleado_suplencias_docente_reemplazo_idToempleado.apellido}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fechas y detalles */}
                      <div className="md:col-span-4 space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Ausencia: </span>
                          <span className="font-medium">
                            {formatDate(suplencia.fecha_inicio_ausencia)} - {formatDate(suplencia.fecha_fin_ausencia)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reemplazo: </span>
                          <span className="font-medium">
                            {formatDate(suplencia.fecha_inicio_reemplazo)} - {formatDate(suplencia.fecha_fin_reemplazo)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{suplencia.horas_cubiertas}h</span>
                          </div>
                          {getJornadaBadge(suplencia.jornada)}
                        </div>
                        <div className="text-xs text-gray-500">
                          📍 {suplencia.sede.nombre}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="md:col-span-3 flex items-center justify-end gap-2">
                        {suplencia._count && suplencia._count.documentos_suplencia > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {suplencia._count.documentos_suplencia}
                          </Badge>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/suplencias/${suplencia.id}`)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/suplencias/${suplencia.id}/editar`)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(suplencia.id, suplencia.causa_ausencia)}
                          className="text-red-600 hover:text-red-700"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                    </div>

                    {/* Observación */}
                    {suplencia.observacion && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Observación:</span> {suplencia.observacion}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando {suplencias.length} de {pagination.totalItems} suplencias
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <span className="text-sm text-gray-600">
                    Página {pagination.currentPage} de {pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Sin resultados */}
        {!loading && suplencias.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <UserX className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay suplencias registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando tu primera suplencia
                </p>
                <Link href="/dashboard/suplencias/crear">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Suplencia
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

export default function SuplenciasPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <SuplenciasContent />
    </ProtectedRoute>
  );
}
