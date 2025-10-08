"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  UserPlus,
  Users,
  Search,
  Eye,
  Building2,
  GraduationCap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useRectores } from "@/hooks/useRectores"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RectoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [currentPage, setCurrentPage] = useState(1)

  const { rectores, loading, error, pagination, fetchRectores } = useRectores({
    page: currentPage,
    limit: 10,
  })

  const handleSearch = () => {
    fetchRectores({
      page: 1,
      limit: 10,
      search: searchTerm || undefined,
      estado: filterEstado === "todos" ? undefined : (filterEstado as "activo" | "inactivo"),
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterEstado("todos");
    fetchRectores({ page: 1, limit: 10 });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchRectores({
      page: newPage,
      limit: 10,
      search: searchTerm || undefined,
      estado: filterEstado === "todos" ? undefined : (filterEstado as "activo" | "inactivo"),
    });
  };

  const stats = useMemo(() => {
    const totalRectores = pagination.total;
    const activeRectores = rectores.filter((r) => r.estado === "activo").length;
    const inactiveRectores = rectores.filter((r) => r.estado === "inactivo").length;
    const conInstitucion = rectores.filter((r) => r.institucion).length;
    const avgAsignaciones =
      rectores.length > 0
        ? Math.round(
            rectores.reduce((sum, r) => sum + (r._count?.asignaciones || 0), 0) /
              rectores.length
          )
        : 0;

    return {
      total: totalRectores,
      active: activeRectores,
      inactive: inactiveRectores,
      conInstitucion,
      avgAsignaciones,
    };
  }, [rectores, pagination]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Rectores</h1>
            <p className="text-gray-600 mt-1">
              Administra rectores, instituciones educativas y sedes
            </p>
          </div>
          <Link href="/dashboard/rectores/agregar">
            <Button size="lg">
              <UserPlus className="h-5 w-5 mr-2" />
              Crear Rector Completo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rectores</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 h-8">Activos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactivos</p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">{stats.inactive}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% del total
                  </p>
                </div>
                <Badge variant="secondary" className="h-8">Inactivos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Con Institución</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.conInstitucion}</p>
                  <p className="text-xs text-gray-500 mt-1">Asignados</p>
                </div>
                <Building2 className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Asignaciones</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.avgAsignaciones}</p>
                  <p className="text-xs text-gray-500 mt-1">Promedio/rector</p>
                </div>
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lista de Rectores</CardTitle>
            <CardDescription>
              {loading ? "Cargando rectores..." : `${pagination.total} rector${pagination.total !== 1 ? "es" : ""} registrado${pagination.total !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, documento, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterEstado} onValueChange={setFilterEstado} disabled={loading}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="activo">Activos</SelectItem>
                      <SelectItem value="inactivo">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters} disabled={loading}>
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Cargando rectores...</p>
                </div>
              </div>
            ) : rectores.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron rectores</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterEstado !== "todos" ? "Intenta ajustar los filtros de búsqueda" : "Comienza creando tu primer rector"}
                </p>
                <Link href="/dashboard/rectores/agregar">
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear Primer Rector
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rector</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Institución</TableHead>
                        <TableHead>Formación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rectores.map((rector) => (
                        <TableRow key={rector.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{rector.nombre} {rector.apellido}</p>
                              <p className="text-sm text-gray-500">{rector.cargo}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm text-gray-900">{rector.tipo_documento}</p>
                              <p className="text-sm text-gray-500">{rector.documento}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm text-gray-900">{rector.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {rector.institucion ? (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-purple-600" />
                                <span className="text-sm text-gray-900">{rector.institucion.nombre}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Sin asignar</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {rector.informacionAcademica ? (
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="text-sm text-gray-900">{rector.informacionAcademica.nivel_educativo}</p>
                                  <p className="text-xs text-gray-500">{rector.informacionAcademica.titulo}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={rector.estado === "activo" ? "default" : "secondary"}>
                              {rector.estado === "activo" ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/rectores/${rector.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Mostrando <strong>{(currentPage - 1) * pagination.limit + 1}</strong> a{" "}
                      <strong>{Math.min(currentPage * pagination.limit, pagination.total)}</strong> de{" "}
                      <strong>{pagination.total}</strong> rectores
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage || loading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Anterior
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter((page) => page === 1 || page === pagination.totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                          .map((page, index, array) => (
                            <>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span key={`ellipsis-${page}`} className="px-2">...</span>
                              )}
                              <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                disabled={loading}
                              >
                                {page}
                              </Button>
                            </>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
