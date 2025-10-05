import { useState, useCallback, useRef } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  AdvancedSearchParams, 
  AdvancedSearchResponse,
  KeywordSearchParams,
  KeywordSearchResponse,
  ContentSearchParams,
  ContentSearchResponse,
  SuggestionsResponse,
  SimilarDocumentsResponse,
  SimilarDocumentsParams,
  DocumentUploadParams,
  DocumentUploadResponse,
  Document,
  SearchOptions,
  APIError
} from '@/types/documentSearch';
import { searchConfig, CV_UPLOAD_API_URL } from '@/config/env';

export interface UseDocumentSearchReturn {
  // Estado
  results: AdvancedSearchResponse | null;
  loading: boolean;
  error: string | null;
  suggestions: string[];
  uploading: boolean;
  uploadProgress: number;
  
  // Métodos de búsqueda
  search: (params: AdvancedSearchParams, options?: SearchOptions) => Promise<AdvancedSearchResponse>;
  searchByKeywords: (keywords: string[], options?: Omit<KeywordSearchParams, 'keywords'>) => Promise<KeywordSearchResponse>;
  searchByContent: (content: string, options?: Omit<ContentSearchParams, 'content'>) => Promise<ContentSearchResponse>;
  getSuggestions: (text: string, field?: 'title' | 'keywords' | 'content') => Promise<string[]>;
  findSimilar: (documentId: string, options?: SimilarDocumentsParams) => Promise<Document[]>;
  
  // Métodos de carga
  uploadDocument: (params: DocumentUploadParams) => Promise<DocumentUploadResponse>;
  
  // Utilidades
  clearResults: () => void;
  cancelSearch: () => void;
  downloadDocument: (documentId: string) => Promise<void>;
  viewDocument: (documentId: string) => void;
}

export const useDocumentSearch = (config?: {
  baseUrl?: string;
  defaultPageSize?: number;
}): UseDocumentSearchReturn => {
  const baseUrl = config?.baseUrl || searchConfig.baseUrl;
  const defaultPageSize = config?.defaultPageSize || searchConfig.defaultPageSize;

  const [results, setResults] = useState<AdvancedSearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const buildQueryString = useCallback((params: Record<string, any>): string => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    return queryParams.toString();
  }, []);

  const makeRequest = async <T>(
    endpoint: string, 
    params: Record<string, any> = {},
    options: SearchOptions & { method?: string; body?: any } = {}
  ): Promise<T> => {
    const { method = 'GET', body, signal, ...searchOptions } = options;
    
    let url = `${baseUrl}/${endpoint}`;
    
    const controller = signal ? undefined : new AbortController();
    const requestSignal = signal || controller?.signal;

    if (!signal && controller) {
      abortControllerRef.current = controller;
    }

    try {
      let response: AxiosResponse<T>;
      
      if (method === 'GET') {
        response = await axios.get<T>(url, {
          params,
          signal: requestSignal,
          timeout: 30000
        });
      } else if (method === 'POST') {
        const headers = body instanceof FormData 
          ? {} 
          : { 'Content-Type': 'application/json' };
          
        response = await axios.post<T>(url, body, {
          headers,
          signal: requestSignal,
          timeout: 30000
        });
      } else {
        throw new Error(`Método HTTP ${method} no soportado`);
      }

      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        throw new Error('Búsqueda cancelada');
      }
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || 'Error desconocido';
        throw new Error(message);
      }
      
      throw error;
    }
  };

  const search = useCallback(async (
    params: AdvancedSearchParams, 
    options: SearchOptions = {}
  ): Promise<AdvancedSearchResponse> => {
    if (abortControllerRef.current && !options.signal) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        size: defaultPageSize,
        ...params,
      };

      const response = await makeRequest<AdvancedSearchResponse>(
        searchConfig.endpoints.advancedSearch,
        searchParams,
        options
      );

      if (options.append && results) {
        const updatedResults = {
          ...response,
          documents: [...results.documents, ...response.documents],
        };
        setResults(updatedResults);
        return updatedResults;
      } else {
        setResults(response);
        return response;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error en la búsqueda';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, defaultPageSize, results]);

  const searchByKeywords = useCallback(async (
    keywords: string[], 
    options: Omit<KeywordSearchParams, 'keywords'> = {}
  ): Promise<KeywordSearchResponse> => {
    const params = { keywords, ...options };
    return makeRequest<KeywordSearchResponse>(searchConfig.endpoints.searchKeywords, params);
  }, [baseUrl]);

  const searchByContent = useCallback(async (
    content: string, 
    options: Omit<ContentSearchParams, 'content'> = {}
  ): Promise<ContentSearchResponse> => {
    const params = { content, highlight: true, ...options };
    return makeRequest<ContentSearchResponse>(searchConfig.endpoints.searchContent, params);
  }, [baseUrl]);

  const getSuggestions = useCallback(async (
    text: string, 
    field: 'title' | 'keywords' | 'content' = 'keywords'
  ): Promise<string[]> => {
    try {
      const response = await makeRequest<SuggestionsResponse>(
        searchConfig.endpoints.suggestions,
        { text, field, size: 10 }
      );
      setSuggestions(response.suggestions);
      return response.suggestions;
    } catch (error: any) {
      console.warn('Error obteniendo sugerencias:', error.message);
      return [];
    }
  }, [baseUrl]);

  const findSimilar = useCallback(async (
    documentId: string, 
    options: SimilarDocumentsParams = {}
  ): Promise<Document[]> => {
    try {
      const response = await makeRequest<SimilarDocumentsResponse>(
        `${searchConfig.endpoints.similar}/${documentId}`,
        options
      );
      return response.similarDocuments;
    } catch (error: any) {
      console.error('Error encontrando documentos similares:', error.message);
      return [];
    }
  }, [baseUrl]);

  const uploadDocument = useCallback(async (
    params: DocumentUploadParams
  ): Promise<DocumentUploadResponse> => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Preparar FormData según la nueva API de CV
      const formData = new FormData();
      formData.append('document', params.file);
      formData.append('employeeUuid', params.employeeUuid);
      formData.append('employeeName', params.employeeName);
      formData.append('employeeCedula', params.employeeCedula);
      
      // Campos opcionales con valores por defecto para hojas de vida
      const documentType = params.documentType || 'hojas-de-vida';
      const category = params.category || 'curriculum-vitae';
      const title = params.title || `Hoja de Vida - ${params.employeeName}`;
      const tags = params.tags && params.tags.length > 0 
        ? params.tags 
        : ['curriculum', 'docente', 'profesor'];

      formData.append('documentType', documentType);
      formData.append('category', category);
      formData.append('title', title);
      
      if (params.description) {
        formData.append('description', params.description);
      }
      
      // Enviar tags como array JSON string
      formData.append('tags', JSON.stringify(tags));

      // 🐛 DEBUG: Mostrar FormData que se enviará al backend
      console.log('🚀 [DEBUG] FormData que se enviará al backend:');
      console.log('📁 Archivo (clave: "document"):', {
        name: params.file.name,
        size: `${(params.file.size / 1024 / 1024).toFixed(2)} MB`,
        type: params.file.type
      });
      console.log('👤 Datos del empleado:', {
        employeeUuid: params.employeeUuid + ' (UUID REAL GENERADO)',
        employeeName: params.employeeName,
        employeeCedula: params.employeeCedula
      });
      console.log('📋 Metadatos del documento:', {
        documentType,
        category,
        title,
        description: params.description || 'No especificada',
        tags
      });
      console.log('🌐 URL destino:', `${CV_UPLOAD_API_URL}/upload`);
      console.log('🔧 IMPORTANTE: Archivo enviado con clave "document" (no "file")');

      // Progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 15;
        });
      }, 300);

      let response: AxiosResponse<DocumentUploadResponse>;
      let uploadUrl: string;

      try {
        // Intentar primero con la API directa del backend
        uploadUrl = `${CV_UPLOAD_API_URL}/upload`;
        console.log('🌐 [UPLOAD] Intentando upload directo al backend:', uploadUrl);
        
        response = await axios.post<DocumentUploadResponse>(uploadUrl, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000 // 2 minutos para uploads
        });

        console.log(`📡 [UPLOAD] Respuesta directa: ${response.status} ${response.statusText}`);

      } catch (directError: any) {
        console.warn('⚠️ [UPLOAD] Error directo (probablemente CORS):', directError.message);
        console.log('🔄 [UPLOAD] Intentando con proxy interno...');
        
        // Fallback: usar nuestra API interna como proxy
        uploadUrl = '/api/documents/upload';
        response = await axios.post<DocumentUploadResponse>(uploadUrl, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000 // 2 minutos para uploads
        });

        console.log(`🔄 [UPLOAD] Respuesta del proxy: ${response.status} ${response.statusText}`);
      }

      clearInterval(progressInterval);

      // Con axios, los errores HTTP se manejan automáticamente
      // Solo llegamos aquí si fue exitoso (status 2xx)
      
      const result: DocumentUploadResponse = response.data;
      setUploadProgress(100);

      if (!result.success) {
        throw new Error(result.message || 'Error uploading document');
      }

      console.log('✅ [API SUCCESS] Documento subido exitosamente:', {
        id: result.document.id,
        filename: result.document.filename,
        keywords: result.extractedData.keywordCount,
        elasticsearch: result.elasticsearch.indexed,
        textLength: result.extractedData.textLength
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Error subiendo el documento';
      setError(errorMessage);
      console.error('❌ [API ERROR] Error subiendo documento:', errorMessage);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  const downloadDocument = useCallback(async (documentId: string): Promise<void> => {
    try {
      const response = await axios.get(`${baseUrl}/download/${documentId}`, {
        responseType: 'blob',
        timeout: 60000 // 60 segundos para descargas
      });
      
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Intentar obtener el nombre del archivo desde los headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = `document-${documentId}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      let errorMessage = 'Error descargando el documento';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText || error.message}`;
        } else if (error.request) {
          errorMessage = 'No se pudo conectar con el servidor para la descarga';
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [baseUrl]);

  const viewDocument = useCallback((documentId: string): void => {
    window.open(`${baseUrl}/view/${documentId}`, '_blank');
  }, [baseUrl]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setSuggestions([]);
  }, []);

  const cancelSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    // Estado
    results,
    loading,
    error,
    suggestions,
    uploading,
    uploadProgress,
    
    // Métodos de búsqueda
    search,
    searchByKeywords,
    searchByContent,
    getSuggestions,
    findSimilar,
    
    // Métodos de carga
    uploadDocument,
    
    // Utilidades
    clearResults,
    cancelSearch,
    downloadDocument,
    viewDocument,
  };
};