"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Calendar, 
  Tag,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEmployeeDocuments } from '@/hooks/useEmployeeDocuments';

interface EmployeeDocumentSearchProps {
  employeeUuid: string;
  employeeName?: string;
  onDocumentSelect?: (document: any) => void;
  autoLoad?: boolean;
}

const documentTypes = [
  { value: 'hojas', label: 'Hojas de Vida' },
  { value: 'contratos', label: 'Contratos' },
  { value: 'reportes', label: 'Reportes' },
  { value: 'facturas', label: 'Facturas' },
  { value: 'certificados', label: 'Certificados' },
  { value: 'documentos', label: 'Documentos' },
  { value: 'imagenes', label: 'Imágenes' },
  { value: 'formularios', label: 'Formularios' },
  { value: 'correspondencia', label: 'Correspondencia' }
];

const EmployeeDocumentSearch: React.FC<EmployeeDocumentSearchProps> = ({
  employeeUuid,
  employeeName,
  onDocumentSelect,
  autoLoad = true
}) => {
  const {
    documents,
    loading,
    error,
    pagination,
    employeeInfo,
    fetchEmployeeDocuments,
    searchEmployeeDocuments,
    clearResults,
    downloadDocument,
    viewDocument
  } = useEmployeeDocuments();

  const [lastEmployeeUuid, setLastEmployeeUuid] = useState<string>('');

  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    documentType: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'uploadDate',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Agregar estado para tracking de descargas
  const [downloadingId, setDownloadingId] = useState<string | null>(null);


  useEffect(() => {
    if (lastEmployeeUuid && lastEmployeeUuid !== employeeUuid) {
      clearResults();
    }
    setLastEmployeeUuid(employeeUuid);
  }, [employeeUuid, lastEmployeeUuid, documents.length, clearResults]);


  useEffect(() => {
    if (autoLoad && employeeUuid) {
      const timer = setTimeout(() => {
        handleLoadDocuments();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [employeeUuid, autoLoad]);

  useEffect(() => {
    if (documents.length > 0) {
    
      const inconsistentDocs = documents.filter(doc => doc.employeeUuid !== employeeUuid);
      if (inconsistentDocs.length > 0) {
       
      } else {
        
      }
    }
  }, [documents, employeeUuid]);

  const handleLoadDocuments = async () => {

    try {
      await fetchEmployeeDocuments(employeeUuid, {
        page: 1,
        limit: 20,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
 
      if (documents.length > 0) {
        const firstDoc = documents[0];
      }

      if (employeeInfo) {

      }
      
    } catch (error) {
      console.error('❌ [SEARCH] Error loading documents:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim() && !filters.documentType && !filters.category) {
      await handleLoadDocuments();
      return;
    }

    try {
      await searchEmployeeDocuments(employeeUuid, {
        text: searchText.trim() || undefined,
        documentType: filters.documentType || undefined,
        category: filters.category || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        page: 1,
        limit: 20,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
    } catch (error) {
      console.error('Error searching documents:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFilters({
      documentType: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'uploadDate',
      sortOrder: 'desc'
    });
    handleLoadDocuments();
  };

  const handleDownload = async (documentId: string, filename: string, doc?: any) => {
    // Validación inicial
    if (!documentId) {
      console.error('❌ [DOWNLOAD] DocumentId is required');
      return;
    }
    
    try {
      // Mostrar estado de carga
      setDownloadingId(documentId);
      
      console.log('🔽 [DOWNLOAD] Initiating download:', {
        documentId,
        filename,
        hasDownloadUrl: !!doc?.downloadUrl,
        docTitle: doc?.title || doc?.originalName,
        docSize: doc?.size ? formatFileSize(doc.size) : 'unknown'
      });
      
      // Llamar al hook de descarga
      await downloadDocument(documentId, doc?.downloadUrl);
      
      console.log('✅ [DOWNLOAD] Download completed for:', filename);
      
    } catch (error) {
      console.error('❌ [DOWNLOAD] Error in handleDownload:', error);
      
      // Si es error de red/CORS, ofrecer descarga directa
      if (error instanceof Error && error.message.includes('Error de red o CORS')) {
        const downloadUrl = doc?.downloadUrl || `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://demo-facilwhatsappapi.facilcreditos.co'}/api/retrieval/download/${documentId}`;
        
        const shouldTryDirect = confirm(
          `Error de descarga automática: ${error.message}\n\n¿Deseas abrir el documento en una nueva pestaña para descargarlo manualmente?`
        );
        
        if (shouldTryDirect) {
          window.open(downloadUrl, '_blank');
        }
      } else {
        // Otros errores
        alert(`Error al descargar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
      
    } finally {
      // Limpiar estado de carga
      setDownloadingId(null);
    }
  };

  const handleView = (documentId: string, doc?: any) => {
    try {
      const viewUrl = doc?.viewUrl;
      viewDocument(documentId, viewUrl);
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">

      {/* Barra de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Buscar Documentos</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadDocuments}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Recargar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda principal */}
          <div className="flex space-x-2">
            <Input
              placeholder="Buscar en títulos, contenido y palabras clave..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button variant="outline" onClick={handleClearSearch}>
              Limpiar
            </Button>
          </div>

          {/* Filtros avanzados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium">Tipo de Documento</label>
                <Select
                  value={filters.documentType}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, documentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Input
                  placeholder="Ej: curriculum-vitae"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Fecha Desde</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Fecha Hasta</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al buscar documentos: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando documentos del empleado...</p>
              <p className="text-sm text-gray-500">UUID: {employeeUuid.slice(0, 8)}...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {!loading && documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Documentos Encontrados</span>
              <Badge variant="default">
                {pagination?.total || documents.length} resultado(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {doc.title || doc.originalName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {doc.filename}
                          </p>
                          
                          {/* Metadatos */}
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(doc.uploadDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>{formatFileSize(doc.size)}</span>
                            </div>
                            {doc.documentType && (
                              <Badge variant="secondary" className="text-xs">
                                {doc.documentType}
                              </Badge>
                            )}
                            {doc.score && (
                              <Badge variant="outline" className="text-xs">
                                Relevancia: {Math.round(doc.score * 100)}%
                              </Badge>
                            )}
                          </div>

                          {/* Tags */}
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Highlights de búsqueda */}
                          {doc.highlights && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                              <p className="text-yellow-800">
                                <strong>Coincidencias:</strong>
                              </p>
                              {doc.highlights.content && (
                                <div 
                                  className="text-gray-700"
                                  dangerouslySetInnerHTML={{
                                    __html: doc.highlights.content[0]
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc.id, doc)}
                        title="Ver documento"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.id, doc.filename, doc)}
                        disabled={downloadingId === doc.id}
                        title="Descargar documento"
                      >
                        {downloadingId === doc.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                      {onDocumentSelect && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onDocumentSelect(doc)}
                        >
                          Seleccionar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages} 
                  ({pagination.total} documentos en total)
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => {
                      // Implementar paginación anterior
                    }}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => {
                      // Implementar paginación siguiente
                    }}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sin resultados - Mejorado para distinguir entre diferentes estados */}
      {!loading && documents.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            
            {/* Determinar el tipo de mensaje basado en el contexto */}
            {pagination && pagination.total === 0 ? (
              // API respondió exitosamente pero con 0 documentos
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay documentos para este profesor
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchText || Object.values(filters).some(f => f) 
                    ? 'No se encontraron documentos que coincidan con los filtros aplicados'
                    : `El profesor ${employeeName || 'seleccionado'} aún no tiene documentos cargados en el sistema`
                  }
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    UUID del profesor: <code className="bg-gray-100 px-1 rounded">{employeeUuid.slice(0, 8)}...</code>
                  </p>
                  <p className="text-sm text-gray-500">
                    ✅ Conexión con API exitosa - Sistema funcionando correctamente
                  </p>
                </div>
              </>
            ) : (
              // Estado inicial o error no detectado
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Inicializando búsqueda de documentos
                </h3>
                <p className="text-gray-600 mb-4">
                  Cargando información del empleado...
                </p>
              </>
            )}
            
            <Button variant="outline" onClick={handleLoadDocuments} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              {pagination?.total === 0 ? 'Recargar' : 'Cargar documentos'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeDocumentSearch;