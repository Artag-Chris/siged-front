// services/document-api.service.ts
// Servicio para la API de Documentos (Document Handler API)
// Esta API es diferente a la API de Suplencias
// URL Base: https://demo-facilwhatsappapi.facilcreditos.co

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API de Documentos (Document Handler) - DIFERENTE a la API de Suplencias
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
   */
  static async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.getInstance().post<T>(endpoint, formData, {
        ...config,
        headers: {
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
      
      if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      } else if (data?.msg) {
        message = data.msg;
      }
      
      return new Error(message);
    } else if (error.request) {
      return new Error('Error de conexión con la API de Documentos');
    } else {
      return new Error(error.message || 'Error desconocido en API de Documentos');
    }
  }

  static getBaseUrl(): string {
    return DOCUMENT_API_BASE_URL;
  }
}

export default DocumentApiService;
