"use client";

import { useState, useEffect } from "react";
import { useAdvancedSearch, useDocumentStats, useRecentDocuments } from "@/hooks/useAdvancedDocumentSearch";
import documentSearchService, { CATEGORIES, DOCUMENT_TYPES, type Document } from "@/services/document-search.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FileText,
  Download,
  Eye,
  Filter,
  X,
  Loader2,
  Calendar,
  File,
  AlertCircle,
  BarChart3,
  Clock,
  FolderOpen,
  SlidersHorizontal
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import Link from "next/link";

function DocumentSearchContent() {
  const { documents, loading, error, total, took, facets, search, reset } = useAdvancedSearch();
  const { stats, loading: loadingStats, fetchStats } = useDocumentStats();
  const { documents: recentDocs, loading: loadingRecent, fetchRecent } = useRecentDocuments(5);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [fuzzySearch, setFuzzySearch] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "size" | "filename">("relevance");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Cargar estadísticas y documentos recientes al iniciar
  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, [fetchStats, fetchRecent]);

  // Función de búsqueda
  const handleSearch = async () => {
    await search({
      query: searchQuery || undefined,
      category: category || undefined,
      documentType: documentType || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      fuzzy: fuzzySearch,
      size: pageSize,
      from: currentPage * pageSize,
      sortBy,
      sortOrder: "desc",
    });
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setDocumentType("");
    setDateFrom("");
    setDateTo("");
    setFuzzySearch(false);
    setSortBy("relevance");
    setCurrentPage(0);
    reset();
  };

  // Descargar documento
  const handleDownload = async (documentId: string, filename: string) => {
    try {
      await documentSearchService.downloadDocument(documentId, filename);
    } catch (error) {
      console.error("Error descargando documento:", error);
    }
  };

  // Ver documento
  const handleView = (documentId: string) => {
    const viewUrl = documentSearchService.getViewUrl(documentId);
    window.open(viewUrl, "_blank");
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Formatear fecha
  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda de Documentos</h1>
          <p className="text-gray-600">
            Busca, filtra y gestiona todos los documentos del sistema
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Búsqueda
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              Recientes
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* TAB: Búsqueda */}
          <TabsContent value="search" className="space-y-6">
            {/* Filtros de búsqueda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros de Búsqueda</span>
                </CardTitle>
                <CardDescription>
                  Utiliza los filtros para encontrar documentos específicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barra de búsqueda principal */}
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="search">Buscar en documentos</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Buscar por nombre, contenido, palabras clave..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-end space-x-2">
                    <Button onClick={handleSearch} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Buscar
                        </>
                      )}
                    </Button>
                    {(searchQuery || category || documentType || dateFrom || dateTo) && (
                      <Button variant="outline" onClick={handleClearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filtros avanzados */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documentType">Tipo de Documento</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger id="documentType">
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFrom">Fecha Desde</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateTo">Fecha Hasta</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Opciones adicionales */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="fuzzy"
                      checked={fuzzySearch}
                      onChange={(e) => setFuzzySearch(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="fuzzy" className="text-sm font-normal">
                      Búsqueda aproximada (tolera errores de escritura)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sortBy" className="text-sm">
                      Ordenar por:
                    </Label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger id="sortBy" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevancia</SelectItem>
                        <SelectItem value="date">Fecha</SelectItem>
                        <SelectItem value="size">Tamaño</SelectItem>
                        <SelectItem value="filename">Nombre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && documents.length === 0 && searchQuery && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No se encontraron documentos
                  </h3>
                  <p className="text-gray-600">
                    Intenta ajustar los filtros de búsqueda o usa términos diferentes
                  </p>
                </CardContent>
              </Card>
            )}

            {documents.length > 0 && (
              <>
                {/* Info de resultados */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Encontrados <strong>{total}</strong> documentos en{" "}
                    <strong>{took}ms</strong>
                  </div>
                  <div className="text-sm text-gray-600">
                    Mostrando {currentPage * pageSize + 1} -{" "}
                    {Math.min((currentPage + 1) * pageSize, total)} de {total}
                  </div>
                </div>

                {/* Grid de documentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc: Document) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(doc.id)}
                              title="Ver documento"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(doc.id, doc.filename)}
                              title="Descargar"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-base line-clamp-2">
                          {doc.originalname}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {doc.filename}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {doc.metadata?.category && (
                              <Badge variant="outline">
                                <FolderOpen className="h-3 w-3 mr-1" />
                                {doc.metadata.category}
                              </Badge>
                            )}
                            {doc.metadata?.documentType && (
                              <Badge variant="secondary">
                                {doc.metadata.documentType}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="flex items-center">
                              <File className="h-3 w-3 mr-1" />
                              {formatFileSize(doc.size)}
                            </p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(doc.uploadDate)}
                            </p>
                          </div>
                          {doc.metadata?.tags && doc.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2">
                              {doc.metadata.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Paginación */}
                {total > pageSize && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                        handleSearch();
                      }}
                      disabled={currentPage === 0 || loading}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      Página {currentPage + 1} de {Math.ceil(total / pageSize)}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                        handleSearch();
                      }}
                      disabled={(currentPage + 1) * pageSize >= total || loading}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* TAB: Documentos Recientes */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Recientes</CardTitle>
                <CardDescription>Últimos 5 documentos subidos al sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRecent ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : recentDocs.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">
                    No hay documentos recientes
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentDocs.map((doc: Document) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.originalname}</p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(doc.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc.id, doc.filename)}
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
          </TabsContent>

          {/* TAB: Estadísticas */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingStats ? (
                <div className="col-span-4 flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : stats ? (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Documentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">
                        {stats.totalDocuments.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Espacio Total
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">
                        {formatFileSize(stats.totalSize)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Documentos por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(stats.categories).map(([category, count]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">
                              {category.replace(/_/g, " ")}
                            </span>
                            <Badge variant="secondary">{String(count)}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Tipos de Archivo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(stats.mimeTypes).map(([type, count]) => (
                          <div
                            key={type}
                            className="p-4 border rounded-lg text-center hover:bg-gray-50"
                          >
                            <p className="text-2xl font-bold text-gray-900">{String(count)}</p>
                            <p className="text-sm text-gray-600">{type}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function DocumentSearchPage() {
  return (
    <ProtectedRoute requiredRole={["super_admin", "admin", "gestor"]}>
      <DocumentSearchContent />
    </ProtectedRoute>
  );
}
