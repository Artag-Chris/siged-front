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
  downloadDocument: (documentId: string, providedUrl?: string) => Promise<void>;
  viewDocument: (documentId: string, providedUrl?: string) => void;
}

// URL base de la API (desde env o config)
// Configuración de la API - usar la URL que funciona
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://demo-facilwhatsappapi.facilcreditos.co';

console.log('🔧 [EMPLOYEE-DOCS] API_BASE_URL configured as:', API_BASE_URL);

// Función para limpiar tags mal formateados que vienen del backend
const cleanTags = (tags: string[] | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return [];
  
  try {
    // Si es un array con elementos que parecen ser JSON string mal formateado
    if (tags.length > 0 && typeof tags[0] === 'string' && tags[0].includes('[')) {
      // Intentar parsear como JSON juntando todos los elementos y limpiando
      const joinedString = tags.join('').trim();
      console.log('🔧 [TAGS] Attempting to parse joined string:', joinedString);
      const parsed = JSON.parse(joinedString);
      console.log('✅ [TAGS] Successfully parsed:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    // Si son tags normales, devolverlos como están
    return tags.filter(tag => tag && typeof tag === 'string');
  } catch (error) {
    console.warn('🚨 [EMPLOYEE-DOCS] Error parsing tags:', tags, 'Error:', error);
    // En caso de error, intentar devolver los tags como están
    return tags.filter(tag => tag && typeof tag === 'string' && !tag.includes('['));
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
      console.log('🧪 [EMPLOYEE-DOCS] Expected employee UUID:', employeeUuid);
      console.log('================================\n');

      // Usar fetch nativo (igual que el test exitoso)
      const response = await fetch(finalUrl, {
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

  // Función para descargar documento (implementación mejorada con fallbacks)
  const downloadDocument = useCallback(async (documentId: string, providedUrl?: string): Promise<void> => {
    try {
      console.log('🔽 [DOWNLOAD] Starting download process:', { documentId, providedUrl });
      
      // Determinar la URL de descarga
      let downloadUrl: string;
      
      if (providedUrl) {
        downloadUrl = providedUrl;
        console.log('🔗 [DOWNLOAD] Using provided URL:', downloadUrl);
      } else {
        downloadUrl = `${API_BASE_URL}/api/retrieval/download/${documentId}`;
        console.log('🔗 [DOWNLOAD] Using constructed URL:', downloadUrl);
      }
      
      // MÉTODO 1: Intentar descarga directa con window.open (mejor para CORS)
      console.log('🚀 [DOWNLOAD] Attempting direct download with window.open...');
      
      try {
        // Crear enlace temporal y hacer click
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = ''; // Permitir que el servidor determine el nombre
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ [DOWNLOAD] Direct download initiated successfully');
        return;
        
      } catch (directError) {
        console.log('⚠️ [DOWNLOAD] Direct download failed, trying fetch method...', directError);
      }
      
      // MÉTODO 2: Fetch con nombre de archivo mejorado
      console.log('📡 [DOWNLOAD] Making fetch request with CORS handling...');
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream, application/pdf, */*',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('📡 [DOWNLOAD] Response status:', response.status);
      console.log('📡 [DOWNLOAD] Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Obtener el blob
      const blob = await response.blob();
      console.log('📦 [DOWNLOAD] Blob created:', { 
        size: blob.size, 
        type: blob.type 
      });
      
      if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }
      
      // 🔧 MEJORAR: Obtener el nombre del archivo de forma más robusta
      let filename = `documento-${documentId}.pdf`; // Fallback por defecto
      
      // 1. Intentar obtener desde Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        console.log('📋 [DOWNLOAD] Content-Disposition header:', contentDisposition);
        
        // Buscar filename= o filename*= 
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
        
        if (filenameStarMatch && filenameStarMatch[1]) {
          filename = decodeURIComponent(filenameStarMatch[1]);
          console.log('📁 [DOWNLOAD] Using filename* from header:', filename);
        } else if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          console.log('📁 [DOWNLOAD] Using filename from header:', filename);
        }
      }
      
      // 2. Si no hay Content-Disposition, intentar extraer de la URL
      if (filename.startsWith('documento-') && downloadUrl.includes('/')) {
        try {
          const urlParts = downloadUrl.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          if (lastPart && lastPart.includes('.')) {
            filename = decodeURIComponent(lastPart);
            console.log('📁 [DOWNLOAD] Using filename from URL:', filename);
          }
        } catch (e) {
          console.log('⚠️ [DOWNLOAD] Could not extract filename from URL');
        }
      }
      
      // 3. Asegurar que tenga extensión
      if (!filename.includes('.')) {
        // Determinar extensión por tipo MIME
        const mimeExtensions: { [key: string]: string } = {
          'application/pdf': '.pdf',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
          'application/vnd.ms-excel': '.xls',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'text/plain': '.txt'
        };
        
        const extension = mimeExtensions[blob.type] || '.pdf';
        filename += extension;
        console.log('📁 [DOWNLOAD] Added extension based on MIME type:', filename);
      }
      
      // 4. Limpiar caracteres problemáticos del nombre
      filename = filename.replace(/[<>:"/\\|?*]/g, '_');
      
      console.log('📁 [DOWNLOAD] Final filename:', filename);
      
      // Crear URL temporal y disparar descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename; // Usar el nombre mejorado
      
      // Agregar al DOM, hacer click y remover
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpiar URL temporal después de un momento
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('✅ [DOWNLOAD] Download initiated successfully with filename:', filename);
      
    } catch (error: any) {
      console.error('❌ [DOWNLOAD] Download failed:', error);
      
      // Re-lanzar el error con más información específica
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        throw new Error('Error de red o CORS. Intenta descargar directamente desde el navegador.');
      } else if (error.message.includes('HTTP 404')) {
        throw new Error(`Documento no encontrado (ID: ${documentId})`);
      } else if (error.message.includes('HTTP 403')) {
        throw new Error('No tienes permisos para descargar este documento');
      } else if (error.message.includes('HTTP 500')) {
        throw new Error('Error del servidor al procesar la descarga');
      } else {
        throw new Error(`Error al descargar: ${error.message}`);
      }
    }
  }, []);

  // Función para ver documento (optimizada para usar URL del API cuando esté disponible)
  const viewDocument = useCallback((documentId: string, providedUrl?: string): void => {
    // Usar la URL proporcionada del API si está disponible, sino construir la URL
    const viewUrl = providedUrl || `${API_BASE_URL}/api/retrieval/view/${documentId}`;
    console.log('👁️ [VIEW] Opening document:', documentId, 'at:', viewUrl);
    console.log('👁️ [VIEW] Using provided URL:', !!providedUrl);
    window.open(viewUrl, '_blank');
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