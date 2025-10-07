
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// ✅ API de Documentos (Document Handler) - DIFERENTE a la API de JWT/Suplencias
// Esta API se encarga de almacenar archivos y indexarlos en Elasticsearch
const DOCUMENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://demo-facilwhatsappapi.facilcreditos.co';

export class DocumentApiService {
  private static instance: AxiosInstance;

  // Crear instancia de axios para la API de Documentos
  private static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: DOCUMENT_API_BASE_URL,
        timeout: 600000, // 10 minutos para uploads grandes
        headers: {
          'Accept': 'application/json',
        },
      });

      // Request interceptor para agregar token automáticamente
      this.instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('siged_access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          console.log(`🌐 [DOCUMENT-API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
          
          return config;
        },
        (error) => {
          console.error('❌ [DOCUMENT-API] Request Error:', error);
          return Promise.reject(error);
        }
      );

      // Response interceptor para logging
      this.instance.interceptors.response.use(
        (response) => {
          console.log(`✅ [DOCUMENT-API] Response ${response.status}:`, response.data);
          return response;
        },
        (error) => {
          if (error.response) {
            console.error(`❌ [DOCUMENT-API] Response Error ${error.response.status}:`, {
              url: error.config?.url,
              status: error.response.status,
              data: error.response.data
            });
          } else {
            console.error('❌ [DOCUMENT-API] Network Error:', error.message);
          }
          return Promise.reject(error);
        }
      );
    }

    return this.instance;
  }

  /**
   * POST con FormData para upload de archivos
   * Usado en la PROMESA 2
   * 
   * IMPORTANTE: 
   * - El FormData debe incluir el campo 'files' (plural) para los archivos
   * - No incluir manualmente 'Content-Type', axios lo agrega con boundary
   * - Timeout extendido a 10 minutos para archivos grandes
   */
  static async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      console.log('📤 [DOCUMENT-API] Enviando FormData...');
      
      // Log de campos en FormData (solo para debugging)
      if (typeof window !== 'undefined') {
        const entries: string[] = [];
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            entries.push(`${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            entries.push(`${key}: ${value}`);
          }
        }
        console.log('📋 [DOCUMENT-API] FormData entries:', entries);
      }
      
      const response = await this.getInstance().post<T>(endpoint, formData, {
        ...config,
        headers: {
          ...config?.headers,
          // ⚠️ NO especificar Content-Type manualmente
          // Axios lo agregará automáticamente con el boundary correcto
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * GET para obtener datos
   */
  static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.getInstance().get<T>(endpoint, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Manejo centralizado de errores
  private static handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      let message = `Error ${status}: ${error.response.statusText}`;
      
      // Mensajes específicos según el código de error
      if (status === 400) {
        // Error de validación - campos faltantes o incorrectos
        if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        } else {
          message = 'Error 400: Faltan campos requeridos (horas_extra_id, empleado_id, sede_id, files)';
        }
        
        // Agregar hint si está disponible
        if (data?.hint) {
          message += `\n💡 ${data.hint}`;
        }
      } else if (status === 401) {
        message = 'Error de autenticación: Token JWT inválido o expirado';
      } else if (status === 500) {
        message = data?.message || 'Error interno del servidor de documentos';
      } else {
        // Intentar extraer mensaje del response
        if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        } else if (data?.msg) {
          message = data.msg;
        }
      }
      
      return new Error(message);
    } else if (error.request) {
      return new Error('Error de conexión con la API de Documentos. Verifica que el servidor esté disponible.');
    } else {
      return new Error(error.message || 'Error desconocido en API de Documentos');
    }
  }

  static getBaseUrl(): string {
    return DOCUMENT_API_BASE_URL;
  }
}

export default DocumentApiService;
