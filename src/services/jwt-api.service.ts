
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const JWT_API_BASE_URL = process.env.NEXT_PUBLIC_JWT_API_BASE_URL || 'https://demo-api-user.facilcreditos.co';

export class JwtApiService {
  private static instance: AxiosInstance;

  // Crear instancia de axios si no existe
  private static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: JWT_API_BASE_URL,
        timeout: 30000, // 30 segundos timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });


      this.instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('siged_access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          
          if (config.data) {
            console.log(`📤 [JWT-API] Request Data:`, config.data);
          }

          return config;
        },
        (error) => {
          console.error('❌ [JWT-API] Request Error:', error);
          return Promise.reject(error);
        }
      );

      // Response interceptor para logging y manejo de errores
      this.instance.interceptors.response.use(
        (response: AxiosResponse) => {
         
          return response;
        },
        (error) => {
          if (error.response) {
            console.error(`❌ [JWT-API] Response Error ${error.response.status}:`, {
              url: error.config?.url,
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data
            });
          } else if (error.request) {
            console.error('❌ [JWT-API] Network Error:', error.message);
          } else {
            console.error('❌ [JWT-API] Request Setup Error:', error.message);
          }
          return Promise.reject(error);
        }
      );
    }

    return this.instance;
  }

  // Métodos HTTP usando axios
  static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.getInstance().get<T>(endpoint, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.getInstance().post<T>(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.getInstance().put<T>(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.getInstance().patch<T>(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async postFormData<T>(endpoint: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
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

  static async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.getInstance().delete<T>(endpoint, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getBlob(endpoint: string, config?: AxiosRequestConfig): Promise<Blob> {
    try {
      const response = await this.getInstance().get<Blob>(endpoint, {
        ...config,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Manejo centralizado de errores
  private static handleError(error: any): Error {
    if (error.response) {
      // Error con respuesta del servidor
      const status = error.response.status;
      const data = error.response.data;
      
      let message = `Error ${status}: ${error.response.statusText}`;
      
      if (data?.msg) {
        message = data.msg;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
      
      return new Error(message);
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifique su conectividad a internet.');
    } else {
      // Error de configuración
      return new Error(error.message || 'Error desconocido');
    }
  }

  // Utilidades para tokens
  static setToken(token: string): void {
    localStorage.setItem('siged_access_token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('siged_access_token');
  }

  static removeToken(): void {
    localStorage.removeItem('siged_access_token');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Utilidad para obtener la URL base
  static getBaseUrl(): string {
    return JWT_API_BASE_URL;
  }
}

export default JwtApiService;