// services/document-search.service.ts
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_DOCUMENT_API_URL || 'https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://demo-facilwhatsappapi.facilcreditos.co';

// Crear instancia de axios específica para documentos
const createDocumentApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Interceptor para agregar token JWT
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('siged_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('❌ [DOCUMENT-API] Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de respuesta
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error(`❌ [DOCUMENT-API] Response Error ${error.response.status}:`, {
          url: error.config?.url,
          status: error.response.status,
          data: error.response.data
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const documentApiClient = createDocumentApiInstance();
const BASE_PATH = '/api/retrieval';

export interface Document {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  uploadDate: Date | string;
  metadata: {
    category?: string;
    documentType?: string;
    employeeUuid?: string;
    employeeName?: string;
    description?: string;
    tags?: string[];
    keywords?: string[];
    [key: string]: any;
  };
  extractedText?: string;
  highlights?: string[];
}

export interface SearchParams {
  text?: string;
  category?: string;
  tags?: string[];
  dateFrom?: Date | string;
  dateTo?: string;
  includeContent?: boolean;
}

export interface AdvancedSearchParams extends SearchParams {
  query?: string;
  keywords?: string[];
  content?: string;
  fuzzy?: boolean;
  boost?: boolean;
  size?: number;
  from?: number;
  documentType?: string;
  employeeUuid?: string;
  fileType?: string;
  sortBy?: 'relevance' | 'date' | 'size' | 'filename';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  documents: Document[];
  count?: number;
  total?: number;
  took?: number;
  facets?: any;
  query: SearchParams | AdvancedSearchParams;
}

export interface EmployeeDocumentsResponse {
  employeeUuid: string;
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  meta?: any;
  searchQuery?: any;
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  categories: Record<string, number>;
  documentTypes: Record<string, number>;
  mimeTypes: Record<string, number>;
}

export const CATEGORIES = [
  'contratos',
  'documentos',
  'reportes',
  'actos_administrativos',
  'suplencias',
  'horas_extra',
] as const;

export const DOCUMENT_TYPES = [
  'contrato_laboral',
  'acto_administrativo',
  'suplencia',
  'horas_extra',
  'reporte',
  'certificado',
] as const;

export type Category = typeof CATEGORIES[number];
export type DocumentType = typeof DOCUMENT_TYPES[number];

class DocumentSearchService {
  /**
   * Búsqueda simple de documentos
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.text) queryParams.append('text', params.text);
      if (params.category) queryParams.append('category', params.category);
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => queryParams.append('tags', tag));
      }
      if (params.dateFrom) {
        const dateStr = typeof params.dateFrom === 'string' 
          ? params.dateFrom 
          : params.dateFrom.toISOString();
        queryParams.append('dateFrom', dateStr);
      }
      if (params.dateTo) {
        queryParams.append('dateTo', params.dateTo);
      }
      if (params.includeContent) {
        queryParams.append('includeContent', 'true');
      }

      const url = `${BASE_PATH}/search${queryParams.toString() ? `?${queryParams}` : ''}`;
      console.log('🔍 [DOCUMENT-SEARCH] Buscando documentos:', url);

      const response = await documentApiClient.get<SearchResponse>(url);
      console.log('✅ [DOCUMENT-SEARCH] Documentos encontrados:', response.data.count || response.data.documents?.length);

      return response.data;
    } catch (error: any) {
      console.error('❌ [DOCUMENT-SEARCH] Error buscando documentos:', error);
      throw new Error(error.message || 'Error al buscar documentos');
    }
  }

  /**
   * Búsqueda avanzada con filtros complejos
   */
  async advancedSearch(params: AdvancedSearchParams): Promise<SearchResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.query) queryParams.append('query', params.query);
      if (params.keywords && params.keywords.length > 0) {
        params.keywords.forEach(kw => queryParams.append('keywords', kw));
      }
      if (params.content) queryParams.append('content', params.content);
      if (params.fuzzy !== undefined) queryParams.append('fuzzy', String(params.fuzzy));
      if (params.boost !== undefined) queryParams.append('boost', String(params.boost));
      if (params.size) queryParams.append('size', String(params.size));
      if (params.from !== undefined) queryParams.append('from', String(params.from));
      if (params.category) queryParams.append('category', params.category);
      if (params.documentType) queryParams.append('documentType', params.documentType);
      if (params.employeeUuid) queryParams.append('employeeUuid', params.employeeUuid);
      if (params.dateFrom) {
        const dateStr = typeof params.dateFrom === 'string' 
          ? params.dateFrom 
          : params.dateFrom.toISOString();
        queryParams.append('dateFrom', dateStr);
      }
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.fileType) queryParams.append('fileType', params.fileType);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${BASE_PATH}/advanced-search${queryParams.toString() ? `?${queryParams}` : ''}`;
      console.log('🔍 [ADVANCED-SEARCH] Búsqueda avanzada:', url);

      const response = await documentApiClient.get<SearchResponse>(url);
      console.log('✅ [ADVANCED-SEARCH] Resultados:', response.data.total || response.data.documents?.length);

      return response.data;
    } catch (error: any) {
      console.error('❌ [ADVANCED-SEARCH] Error:', error);
      throw new Error(error.message || 'Error en búsqueda avanzada');
    }
  }

  /**
   * Obtener documentos de un empleado específico
   */
  async getEmployeeDocuments(
    employeeUuid: string,
    page = 1,
    limit = 20,
    sortBy = 'date',
    sortOrder = 'desc'
  ): Promise<EmployeeDocumentsResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder,
      });

      const url = `${BASE_PATH}/employee/${employeeUuid}?${queryParams}`;
      console.log('👤 [EMPLOYEE-DOCS] Obteniendo documentos:', url);

      const response = await documentApiClient.get<EmployeeDocumentsResponse>(url);
      console.log('✅ [EMPLOYEE-DOCS] Documentos:', response.data.documents?.length);

      return response.data;
    } catch (error: any) {
      console.error('❌ [EMPLOYEE-DOCS] Error:', error);
      throw new Error(error.message || 'Error al obtener documentos del empleado');
    }
  }

  /**
   * Buscar en documentos de un empleado específico
   */
  async searchEmployeeDocuments(
    employeeUuid: string,
    params: SearchParams & { page?: number; limit?: number }
  ): Promise<EmployeeDocumentsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.text) queryParams.append('text', params.text);
      if (params.category) queryParams.append('category', params.category);
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => queryParams.append('tags', tag));
      }
      if (params.dateFrom) {
        const dateStr = typeof params.dateFrom === 'string' 
          ? params.dateFrom 
          : params.dateFrom.toISOString();
        queryParams.append('dateFrom', dateStr);
      }
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));

      const url = `${BASE_PATH}/employee/${employeeUuid}/search?${queryParams}`;
      console.log('👤🔍 [EMPLOYEE-SEARCH] Buscando:', url);

      const response = await documentApiClient.get<EmployeeDocumentsResponse>(url);
      console.log('✅ [EMPLOYEE-SEARCH] Resultados:', response.data.documents?.length);

      return response.data;
    } catch (error: any) {
      console.error('❌ [EMPLOYEE-SEARCH] Error:', error);
      throw new Error(error.message || 'Error al buscar documentos del empleado');
    }
  }

  /**
   * Descargar un documento
   */
  getDownloadUrl(documentId: string): string {
    return `${BASE_URL}${BASE_PATH}/download/${documentId}`;
  }

  /**
   * Obtener URL de visualización
   */
  getViewUrl(documentId: string): string {
    return `${BASE_URL}${BASE_PATH}/view/${documentId}`;
  }

  /**
   * Descargar documento (con autenticación)
   */
  async downloadDocument(documentId: string, fileName: string): Promise<void> {
    try {
      const response = await documentApiClient.get<Blob>(`${BASE_PATH}/download/${documentId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ [DOWNLOAD] Documento descargado:', fileName);
    } catch (error: any) {
      console.error('❌ [DOWNLOAD] Error:', error);
      throw new Error(error.message || 'Error al descargar documento');
    }
  }

  /**
   * Obtener documentos recientes
   */
  async getRecent(limit = 10): Promise<SearchResponse> {
    try {
      const url = `${BASE_PATH}/recent?limit=${limit}`;
      console.log('📅 [RECENT] Obteniendo documentos recientes');

      const response = await documentApiClient.get<SearchResponse>(url);
      console.log('✅ [RECENT] Documentos:', response.data.documents?.length);

      return response.data;
    } catch (error: any) {
      console.error('❌ [RECENT] Error:', error);
      throw new Error(error.message || 'Error al obtener documentos recientes');
    }
  }

  /**
   * Obtener estadísticas del sistema
   */
  async getStats(): Promise<{ stats: DocumentStats }> {
    try {
      console.log('📊 [STATS] Obteniendo estadísticas');

      const response = await documentApiClient.get<{ stats: DocumentStats }>(`${BASE_PATH}/stats`);
      console.log('✅ [STATS] Estadísticas obtenidas');

      return response.data;
    } catch (error: any) {
      console.error('❌ [STATS] Error:', error);
      throw new Error(error.message || 'Error al obtener estadísticas');
    }
  }

  /**
   * Obtener documentos por categoría
   */
  async getByCategory(category: string, page = 1, limit = 20): Promise<SearchResponse> {
    try {
      const url = `${BASE_PATH}/category/${category}?page=${page}&limit=${limit}`;
      console.log('📁 [CATEGORY] Obteniendo documentos:', category);

      const response = await documentApiClient.get<SearchResponse>(url);
      console.log('✅ [CATEGORY] Documentos:', response.data.documents?.length);

      return response.data;
    } catch (error: any) {
      console.error('❌ [CATEGORY] Error:', error);
      throw new Error(error.message || 'Error al obtener documentos por categoría');
    }
  }
}

export const documentSearchService = new DocumentSearchService();
export default documentSearchService;
