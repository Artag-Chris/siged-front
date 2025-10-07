// app/dashboard/actos-administrativos/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActosAdministrativos, useDeleteActoAdministrativo } from '@/hooks/useActosAdministrativos';
import { useInstituciones } from '@/hooks/useInstituciones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  Building2,
  Loader2,
} from 'lucide-react';

export default function ActosAdministrativosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [institucionId, setInstitucionId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actoToDelete, setActoToDelete] = useState<number | null>(null);

  const {
    actosAdministrativos,
    loading,
    error,
    pagination,
    fetchActosAdministrativos,
    refresh,
  } = useActosAdministrativos({ page: currentPage, limit: 10 });

  const { deleteActoAdministrativo, loading: deleting } = useDeleteActoAdministrativo();
  const { instituciones, loading: loadingInstituciones } = useInstituciones({ autoLoad: true });

  // Búsqueda
  const handleSearch = () => {
    fetchActosAdministrativos({
      page: 1,
      limit: 10,
      search: searchTerm || undefined,
      institucion_educativa_id: institucionId === 'all' ? undefined : institucionId,
    });
    setCurrentPage(1);
  };

  // Paginación
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchActosAdministrativos({
      page: newPage,
      limit: 10,
      search: searchTerm || undefined,
      institucion_educativa_id: institucionId === 'all' ? undefined : institucionId,
    });
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setInstitucionId('all');
    fetchActosAdministrativos({
      page: 1,
      limit: 10,
    });
    setCurrentPage(1);
  };

  // Eliminar
  const handleDeleteClick = (id: number) => {
    setActoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!actoToDelete) return;

    try {
      await deleteActoAdministrativo(actoToDelete);
      console.log('✅ Acto administrativo eliminado');
      refresh();
    } catch (error: any) {
      console.error('❌ Error eliminando acto:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setActoToDelete(null);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actos Administrativos</h1>
          <p className="text-gray-500 mt-1">
            Gestión de resoluciones y actos administrativos de las instituciones educativas
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/actos-administrativos/crear')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Acto
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>
            Busca por nombre de resolución, descripción o institución educativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Fila 1: Búsqueda por texto */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar acto administrativo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Fila 2: Filtro por institución */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Institución Educativa
                </label>
                <Select
                  value={institucionId}
                  onValueChange={setInstitucionId}
                  disabled={loadingInstituciones}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las instituciones educativas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        Todas las instituciones educativas
                      </div>
                    </SelectItem>
                    {loadingInstituciones ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cargando instituciones...
                        </div>
                      </SelectItem>
                    ) : (
                      instituciones.map((institucion) => (
                        <SelectItem key={institucion.id} value={institucion.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {institucion.nombre}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Buscar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={loading}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lista de Actos Administrativos</CardTitle>
              <CardDescription>
                {pagination.totalItems} acto(s) administrativo(s) encontrado(s)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre (Resolución)</TableHead>
                      <TableHead>Institución</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actosAdministrativos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No se encontraron actos administrativos
                        </TableCell>
                      </TableRow>
                    ) : (
                      actosAdministrativos.map((acto) => (
                        <TableRow key={acto.id}>
                          <TableCell className="font-medium">{acto.id}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{acto.nombre}</div>
                              {acto.descripcion && (
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {acto.descripcion}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {acto.institucion_educativa?.nombre || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {formatDate(acto.fecha_creacion)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              <FileText className="h-3 w-3" />
                              {acto.documentos_actos_administrativos?.length || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/dashboard/actos-administrativos/${acto.id}`)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/dashboard/actos-administrativos/${acto.id}/editar`)
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(acto.id)}
                                disabled={deleting}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Página {pagination.currentPage} de {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el acto administrativo y todos sus
              documentos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
