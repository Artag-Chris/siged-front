"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Download, Eye, FileText, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { AdvancedSearchParams, Document } from '@/types/documentSearch';

interface DocumentSearchProps {
  professorId: string;
  professorName?: string;
  onDocumentSelect?: (document: Document) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  professorId,
  professorName,
  onDocumentSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AdvancedSearchParams>({
    query: '',
    size: 10,
    from: 0,
    sortBy: 'relevance',
    sortOrder: 'desc',
    filters: {
      employeeUuid: professorId,
    }
  });

  const {
    results,
    loading,
    error,
    suggestions,
    search,
    getSuggestions,
    findSimilar,
    downloadDocument,
    viewDocument,
    clearResults
  } = useDocumentSearch();

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (searchParams?: AdvancedSearchParams) => {
    const params = searchParams || filters;
    try {
      await search({
        ...params,
        query: searchQuery || params.query,
      });
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  }, [search, filters, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.length >= 2) {
        getSuggestions(value);
      }
      if (value.length >= 3) {
        handleSearch();
      }
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedFilterChange = (parentKey: string, key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey as keyof AdvancedSearchParams] as object || {}),
        [key]: value
      }
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({
      query: '',
      size: 10,
      from: 0,
      sortBy: 'relevance',
      sortOrder: 'desc',
      filters: {
        employeeUuid: professorId,
      }
    });
    clearResults();
  };

  const loadMore = () => {
    if (results && results.documents.length < results.total) {
      const newFilters = {
        ...filters,
        from: results.documents.length
      };
      handleSearch(newFilters);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const highlightText = (text: string, highlights?: string[]) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  useEffect(() => {
    // Búsqueda inicial al cargar
    handleSearch();
  }, []);

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Búsqueda de Documentos</span>
            {professorName && (
              <Badge variant="outline">{professorName}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Busca documentos usando palabras clave, contenido o filtros avanzados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              
              {/* Sugerencias */}
              {suggestions.length > 0 && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearch();
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button onClick={() => handleSearch()} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            {(searchQuery || results) && (
              <Button variant="outline" onClick={clearSearch}>
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Filtros avanzados */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select
                    value={filters.filters?.category || ''}
                    onValueChange={(value) => handleNestedFilterChange('filters', 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      <SelectItem value="academic">Académico</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="administrative">Administrativo</SelectItem>
                      <SelectItem value="certification">Certificación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Documento</label>
                  <Select
                    value={filters.filters?.documentType || ''}
                    onValueChange={(value) => handleNestedFilterChange('filters', 'documentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los tipos</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="certificate">Certificado</SelectItem>
                      <SelectItem value="resume">Hoja de Vida</SelectItem>
                      <SelectItem value="identification">Identificación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                  <Select
                    value={filters.sortBy || 'relevance'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
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

              <div className="flex space-x-2">
                <Button onClick={() => handleSearch()} size="sm">
                  Aplicar Filtros
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Resultados */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">{error}</div>
          </CardContent>
        </Card>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultados ({results.total})</span>
              <span className="text-sm text-gray-500">
                {results.took}ms
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron documentos que coincidan con tu búsqueda
              </div>
            ) : (
              <div className="space-y-4">
                {results.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onDocumentSelect?.(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">
                            {highlightText(doc.title || doc.filename, doc.highlights?.title)}
                          </h3>
                          {doc.score && (
                            <Badge variant="secondary">
                              {Math.round(doc.score * 100)}% match
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(doc.uploadDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                          {doc.employeeName && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{doc.employeeName}</span>
                            </div>
                          )}
                        </div>

                        {doc.description && (
                          <p className="text-gray-700">
                            {highlightText(doc.description, doc.highlights?.content)}
                          </p>
                        )}

                        {doc.keywords && doc.keywords.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <div className="flex flex-wrap gap-1">
                              {doc.keywords.map((keyword) => (
                                <Badge key={keyword} variant="outline" className="text-xs">
                                  {highlightText(keyword, doc.highlights?.keywords)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {doc.highlights?.content && doc.highlights.content.length > 0 && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                            <p className="text-sm text-gray-700">
                              ...{highlightText(doc.highlights.content[0], doc.highlights.content)}...
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDocument(doc.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadDocument(doc.id);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const similar = await findSimilar(doc.id);
                            console.log('Documentos similares:', similar);
                          }}
                        >
                          Similares
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {results.documents.length < results.total && (
                  <div className="text-center pt-4">
                    <Button onClick={loadMore} disabled={loading}>
                      {loading ? 'Cargando...' : 'Cargar más documentos'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentSearch;