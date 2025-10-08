// hooks/useAdvancedDocumentSearch.ts
import { useState, useCallback } from 'react';
import documentSearchService from '@/services/document-search.service';
import type {
  SearchParams,
  AdvancedSearchParams,
  Document,
  DocumentStats,
} from '@/services/document-search.service';

/**
 * Hook para búsqueda avanzada de documentos
 */
export const useAdvancedSearch = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [took, setTook] = useState(0);
  const [facets, setFacets] = useState<any>(null);

  const search = useCallback(async (params: AdvancedSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await documentSearchService.advancedSearch(params);
      setDocuments(response.documents || []);
      setTotal(response.total || response.documents?.length || 0);
      setTook(response.took || 0);
      setFacets(response.facets || null);
      console.log('✅ [USE-ADVANCED-SEARCH] Búsqueda exitosa:', response.total);
    } catch (err: any) {
      setError(err.message || 'Error en búsqueda avanzada');
      console.error('❌ [USE-ADVANCED-SEARCH] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDocuments([]);
    setTotal(0);
    setTook(0);
    setFacets(null);
    setError(null);
  }, []);

  return {
    documents,
    loading,
    error,
    total,
    took,
    facets,
    search,
    reset,
  };
};

/**
 * Hook para obtener documentos recientes
 */
export const useRecentDocuments = (limit = 10) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await documentSearchService.getRecent(limit);
      setDocuments(response.documents || []);
      console.log('✅ [USE-RECENT] Documentos recientes obtenidos');
    } catch (err: any) {
      setError(err.message || 'Error al obtener documentos recientes');
      console.error('❌ [USE-RECENT] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return {
    documents,
    loading,
    error,
    fetchRecent,
  };
};

/**
 * Hook para estadísticas de documentos
 */
export const useDocumentStats = () => {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await documentSearchService.getStats();
      setStats(response.stats);
      console.log('✅ [USE-STATS] Estadísticas obtenidas');
    } catch (err: any) {
      setError(err.message || 'Error al obtener estadísticas');
      console.error('❌ [USE-STATS] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};

/**
 * Hook para descargar documentos
 */
export const useDocumentDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (documentId: string, fileName: string) => {
    setDownloading(true);
    setError(null);

    try {
      await documentSearchService.downloadDocument(documentId, fileName);
      console.log('✅ [USE-DOWNLOAD] Documento descargado');
    } catch (err: any) {
      setError(err.message || 'Error al descargar documento');
      console.error('❌ [USE-DOWNLOAD] Error:', err);
    } finally {
      setDownloading(false);
    }
  }, []);

  return {
    downloading,
    error,
    download,
  };
};
