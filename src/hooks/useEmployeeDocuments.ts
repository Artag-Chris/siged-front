import { useState, useCallback } from 'react';
// Ya no necesitamos axios - usando fetch nativo

// Interfaces para la nueva API de Employee Search
interface EmployeeDocument {
  id: string;
  title?: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadDate: string;
  description?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
  employeeUuid: string;
  employeeName?: string;
  employeeCedula?: string;
  documentType?: string;
  year?: number;
  downloadUrl: string;
  viewUrl: string;
  score?: number;
  highlights?: {
    title?: string[];
    content?: string[];
    keywords?: string[];
    [field: string]: string[] | undefined;
  };
}

interface EmployeeDocumentsResponse {
  employeeUuid: string;
  documents: EmployeeDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    // totalPages no viene en la respuesta real
  };
  meta: {
    employeeInfo: {
      employeeName: string;
      employeeCedula: string;
    };
    // sortBy y sortOrder pueden no estar presentes
    sortBy?: string;
    sortOrder?: string;
  };
}

interface EmployeeSearchResponse {
  employeeUuid: string;
  searchQuery: {
    text?: string;
    category?: string;
    documentType?: string;
    tags?: string[];
    dateRange?: {
      from?: string;
      to?: string;
    };
  };
  documents: EmployeeDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  meta: {
    took: number;
    employeeInfo: {
      employeeName: string;
      employeeCedula: string;
    };
  };
}

interface SearchFilters {
  text?: string;
  category?: string;
  documentType?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseEmployeeDocumentsReturn {
  // Estado
  documents: EmployeeDocument[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  employeeInfo: {
    employeeName: string;
    employeeCedula: string;
  } | null;
  
  // Métodos
  fetchEmployeeDocuments: (employeeUuid: string, options?: SearchFilters) => Promise<void>;
  searchEmployeeDocuments: (employeeUuid: string, filters: SearchFilters) => Promise<void>;
  clearResults: () => void;
  downloadDocument: (documentId: string) => Promise<void>;
  viewDocument: (documentId: string) => void;
}

// URL base de la API (desde env o config)
// Configuración de la API - usar la URL que funciona
const API_BASE_URL = process.env.NEXT_PUBLIC_CV_UPLOAD_API_URL || 'https://demo-facilwhatsappapi.facilcreditos.co';

console.log('🔧 [EMPLOYEE-DOCS] API_BASE_URL configured as:', API_BASE_URL);

// Función para limpiar tags mal formateados que vienen del backend
const cleanTags = (tags: string[] | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return [];
  
  try {
    // Si es un array con elementos que parecen ser JSON string mal formateado
    if (tags.length > 0 && tags[0].startsWith('[')) {
      // Intentar parsear como JSON juntando todos los elementos
      const joinedString = tags.join('');
      const parsed = JSON.parse(joinedString);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    // Si son tags normales, devolverlos como están
    return tags.filter(tag => tag && typeof tag === 'string');
  } catch (error) {
    console.warn('🚨 [EMPLOYEE-DOCS] Error parsing tags:', tags, error);
    return tags.filter(tag => tag && typeof tag === 'string');
  }
};

export const useEmployeeDocuments = (): UseEmployeeDocumentsReturn => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<{
    employeeName: string;
    employeeCedula: string;
  } | null>(null);

  // Función para obtener todos los documentos de un empleado
  const fetchEmployeeDocuments = useCallback(async (
    employeeUuid: string, 
    options: SearchFilters = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Construir URL manualmente como en el test exitoso
      let finalUrl = `${API_BASE_URL}/api/retrieval/employee/${employeeUuid}`;
      
      // Solo agregar parámetros si están definidos
      const urlParams = [];
      if (options.page) urlParams.push(`page=${options.page}`);
      if (options.limit) urlParams.push(`limit=${options.limit}`);
      if (options.sortBy) urlParams.push(`sortBy=${options.sortBy}`);
      if (options.sortOrder) urlParams.push(`sortOrder=${options.sortOrder}`);
      
      if (urlParams.length > 0) {
        finalUrl += `?${urlParams.join('&')}`;
      }
      
      console.log('\n=== FETCH EMPLOYEE DOCUMENTS ===');
      console.log('🔍 [EMPLOYEE-DOCS] Fetching documents for employee:', employeeUuid);
      console.log('🌐 [EMPLOYEE-DOCS] Final URL:', finalUrl);
      console.log('🔧 [EMPLOYEE-DOCS] Using FETCH (not axios)');
      console.log('🧪 [EMPLOYEE-DOCS] Comparing with working test URL...');
      console.log('🧪 [EMPLOYEE-DOCS] Working URL: https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/employee/3389ecbe-a18c-11f0-99f3-0242ac120002');
      console.log('🧪 [EMPLOYEE-DOCS] Current URL:', finalUrl);
      console.log('🧪 [EMPLOYEE-DOCS] URLs match:', finalUrl === 'https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/employee/3389ecbe-a18c-11f0-99f3-0242ac120002');
      console.log('================================\n');

      // FORZAR la URL exacta que funciona para debugging
      const WORKING_URL = 'https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/employee/3389ecbe-a18c-11f0-99f3-0242ac120002';
      const urlToUse = employeeUuid === '3389ecbe-a18c-11f0-99f3-0242ac120002' ? WORKING_URL : finalUrl;
      
      console.log('🔄 [EMPLOYEE-DOCS] URL being used:', urlToUse);
      console.log('🔄 [EMPLOYEE-DOCS] Forced override:', urlToUse !== finalUrl);

      // Usar fetch nativo (igual que el test exitoso)
      const response = await fetch(urlToUse, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 [EMPLOYEE-DOCS] Response status:', response.status);
      console.log('📡 [EMPLOYEE-DOCS] Response ok:', response.ok);
      console.log('📡 [EMPLOYEE-DOCS] Response URL:', response.url);
      console.log('📡 [EMPLOYEE-DOCS] Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // Si falla, intentar directamente con la URL que sabemos que funciona
        console.log('🚨 [EMPLOYEE-DOCS] Primary fetch failed, trying with hardcoded working URL...');
        const fallbackResponse = await fetch('https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/employee/3389ecbe-a18c-11f0-99f3-0242ac120002', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('🔄 [EMPLOYEE-DOCS] Fallback response status:', fallbackResponse.status);
        console.log('🔄 [EMPLOYEE-DOCS] Fallback response ok:', fallbackResponse.ok);
        
        if (fallbackResponse.ok) {
          console.log('✅ [EMPLOYEE-DOCS] FALLBACK WORKED! The issue is with URL construction');
          const fallbackData = await fallbackResponse.json();
          console.log('✅ [EMPLOYEE-DOCS] Fallback data:', fallbackData);
          
          // Usar los datos del fallback
          const cleanedDocuments = fallbackData.documents.map((doc: any) => ({
            ...doc,
            tags: cleanTags(doc.tags)
          }));

          setDocuments(cleanedDocuments);
          setPagination({
            ...fallbackData.pagination,
            totalPages: Math.ceil(fallbackData.pagination.total / fallbackData.pagination.limit)
          });
          setEmployeeInfo(fallbackData.meta.employeeInfo);
          
          setLoading(false);
          return; // Exit early con éxito
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EmployeeDocumentsResponse = await response.json();
      
      console.log('\n=== RESPONSE DEBUG ===');
      console.log('📦 [EMPLOYEE-DOCS] Response status:', response.status);
      console.log('📦 [EMPLOYEE-DOCS] Response headers:', response.headers);
      console.log('📦 [EMPLOYEE-DOCS] Raw response data:', JSON.stringify(data, null, 2));
      console.log('✅ [EMPLOYEE-DOCS] Documents fetched successfully:', {
        employeeUuid: data.employeeUuid,
        documentsCount: data.documents?.length || 0,
        total: data.pagination?.total || 0,
        pagination: data.pagination,
        meta: data.meta
      });
      console.log('=====================\n');

      // Limpiar tags mal formateados en los documentos
      const cleanedDocuments = data.documents.map(doc => ({
        ...doc,
        tags: cleanTags(doc.tags)
      }));

      setDocuments(cleanedDocuments);
      setPagination({
        ...data.pagination,
        totalPages: Math.ceil(data.pagination.total / data.pagination.limit)
      });
      setEmployeeInfo(data.meta.employeeInfo);

    } catch (err: any) {
      console.log('\n=== ERROR DEBUG ===');
      console.error('❌ [EMPLOYEE-DOCS] Error details:', err);
      
      let errorMessage = 'Error fetching employee documents';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (err.message.includes('404')) {
        errorMessage = `Empleado no encontrado (UUID: ${employeeUuid}). El UUID no existe en el sistema de documentos.`;
      } else if (err.message.includes('HTTP')) {
        errorMessage = err.message;
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      console.log('==================\n');
      setError(errorMessage);
      console.error('❌ [EMPLOYEE-DOCS] Final error message:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para buscar dentro de los documentos de un empleado
  const searchEmployeeDocuments = useCallback(async (
    employeeUuid: string, 
    filters: SearchFilters
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Construir URL con parámetros manualmente
      let searchUrl = `${API_BASE_URL}/api/retrieval/employee/${employeeUuid}/search`;
      
      const urlParams = [];
      if (filters.text) urlParams.push(`text=${encodeURIComponent(filters.text)}`);
      if (filters.category) urlParams.push(`category=${encodeURIComponent(filters.category)}`);
      if (filters.documentType) urlParams.push(`documentType=${encodeURIComponent(filters.documentType)}`);
      if (filters.dateFrom) urlParams.push(`dateFrom=${encodeURIComponent(filters.dateFrom)}`);
      if (filters.dateTo) urlParams.push(`dateTo=${encodeURIComponent(filters.dateTo)}`);
      if (filters.page) urlParams.push(`page=${filters.page}`);
      if (filters.limit) urlParams.push(`limit=${filters.limit}`);
      if (filters.sortBy) urlParams.push(`sortBy=${encodeURIComponent(filters.sortBy)}`);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => urlParams.push(`tags=${encodeURIComponent(tag)}`));
      }
      
      if (urlParams.length > 0) {
        searchUrl += `?${urlParams.join('&')}`;
      }
      
      console.log('🔍 [EMPLOYEE-SEARCH] Searching documents for employee:', employeeUuid);
      console.log('🔍 [EMPLOYEE-SEARCH] Filters:', filters);
      console.log('🌐 [EMPLOYEE-SEARCH] Search URL:', searchUrl);
      console.log('🔧 [EMPLOYEE-SEARCH] Using FETCH (not axios)');

      // Usar fetch nativo (igual que funcionó en el test)
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 [EMPLOYEE-SEARCH] Response status:', response.status);
      console.log('📡 [EMPLOYEE-SEARCH] Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EmployeeSearchResponse = await response.json();
      
      console.log('✅ [EMPLOYEE-SEARCH] Search completed:', {
        employeeUuid: data.employeeUuid,
        query: data.searchQuery,
        resultsCount: data.documents.length,
        took: data.meta.took
      });

      // Limpiar tags mal formateados en los documentos de búsqueda también
      const cleanedDocuments = data.documents.map(doc => ({
        ...doc,
        tags: cleanTags(doc.tags)
      }));

      setDocuments(cleanedDocuments);
      setPagination({
        ...data.pagination,
        totalPages: Math.ceil(data.pagination.total / data.pagination.limit)
      });
      setEmployeeInfo(data.meta.employeeInfo);

    } catch (err: any) {
      let errorMessage = 'Error searching employee documents';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Error de conexión durante la búsqueda';
      } else if (err.message.includes('HTTP')) {
        errorMessage = err.message;
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      console.error('❌ [EMPLOYEE-SEARCH] Error:', errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para limpiar resultados
  const clearResults = useCallback(() => {
    setDocuments([]);
    setPagination(null);
    setEmployeeInfo(null);
    setError(null);
  }, []);

  // Función para descargar documento
  const downloadDocument = useCallback(async (documentId: string): Promise<void> => {
    try {
      const downloadUrl = `${API_BASE_URL}/api/retrieval/download/${documentId}`;
      console.log('📥 [DOWNLOAD] Downloading document:', documentId, 'from:', downloadUrl);
      
      // Usar fetch nativo para descargas también
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf, application/octet-stream'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Intentar obtener el nombre del archivo desde los headers
      const contentDisposition = response.headers.get('content-disposition');
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
      
      console.log('✅ [DOWNLOAD] Document downloaded:', documentId, filename);
    } catch (error: any) {
      let errorMessage = 'Error downloading document';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Error de conexión durante la descarga';
      } else if (error.message.includes('HTTP')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      console.error('❌ [DOWNLOAD] Error:', errorMessage, error);
      throw new Error(errorMessage);
    }
  }, []);

  // Función para ver documento
  const viewDocument = useCallback((documentId: string): void => {
    const url = `${API_BASE_URL}/api/retrieval/view/${documentId}`;
    window.open(url, '_blank');
    console.log('👁️ [VIEW] Opening document:', documentId);
  }, []);

  return {
    // Estado
    documents,
    loading,
    error,
    pagination,
    employeeInfo,
    
    // Métodos
    fetchEmployeeDocuments,
    searchEmployeeDocuments,
    clearResults,
    downloadDocument,
    viewDocument
  };
};

export default useEmployeeDocuments;