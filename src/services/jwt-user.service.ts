// services/jwt-user.service.ts
// Servicio para gestión de usuarios usando la API JWT

import axios, { AxiosResponse, AxiosError } from 'axios';
import JwtApiService from './jwt-api.service';
import { 
  CreateUserRequest, 
  User, 
  ApiResponse, 
  UserFilters, 
  UsersListResponse 
} from '@/types/auth.types';

export class JwtUserService {
  
  
  // =============== CREAR USUARIO (REQUIERE AUTH) ===============
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const endpoint = '/api/usuario';
      console.log('👤 [USER-SERVICE] Creando usuario con JWT...');
      console.log('📤 [USER-SERVICE] Datos del usuario:', {
        tipo_documento: userData.tipo_documento,
        documento: userData.documento,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        rol: userData.rol,
        estado: userData.estado
      });

      // El JwtApiService automáticamente añade el token JWT en los headers
      const response = await JwtApiService.post<ApiResponse<User>>(
        endpoint,
        userData
      );

      if (!response.ok || !response.data) {
        throw new Error(response.msg || response.message || 'Error creando usuario');
      }

      console.log('✅ [USER-SERVICE] Usuario creado exitosamente:', {
        id: response.data.id,
        email: response.data.email,
        rol: response.data.rol,
        estado: response.data.estado
      });
      
      return response.data;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error creando usuario:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== OBTENER USUARIOS ===============
  static async getUsers(filters: UserFilters = {}): Promise<UsersListResponse> {
    try {
      // FETCH BÁSICO SIN QUERY PARAMS POR AHORA
      const endpoint = '/api/usuario';
      const apiBaseUrl = process.env.NEXT_PUBLIC_JWT_API_BASE_URL || 'https://demo-api-user.facilcreditos.co';
      const fullUrl = `${apiBaseUrl}${endpoint}`;

      console.log('🔍 [USER-SERVICE] Obteniendo usuarios...');
      console.log('🌐 [USER-SERVICE] URL completa:', fullUrl);
      console.log('🔧 [USER-SERVICE] Sin filtros por ahora - fetch básico');

      // Obtener token del localStorage
      const token = localStorage.getItem('siged_access_token');
      
      const response: AxiosResponse<any> = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        timeout: 30000
      });

      console.log('📡 [USER-SERVICE] Response status:', response.status);
      
      const data = response.data;
      console.log('📦 [USER-SERVICE] Response data:', data);

      // Adaptamos la respuesta al formato esperado
      const adaptedResponse: UsersListResponse = {
        success: true,
        data: Array.isArray(data) ? data : data.data || [],
        message: 'Usuarios obtenidos exitosamente',
        pagination: data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: Array.isArray(data) ? data.length : (data.data?.length || 0),
          itemsPerPage: 10
        }
      };

      console.log('✅ [USER-SERVICE] Usuarios obtenidos:', {
        count: adaptedResponse.data.length,
        pagination: adaptedResponse.pagination
      });

      return adaptedResponse;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error obteniendo usuarios:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== OBTENER USUARIOS INACTIVOS ===============
  static async getInactiveUsers(filters: UserFilters = {}): Promise<UsersListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/usuarios/inactivos?${queryString}` : '/usuarios/inactivos';

      console.log('🔍 [USER-SERVICE] Obteniendo usuarios inactivos:', filters);

      const response = await JwtApiService.get<UsersListResponse>(endpoint);

      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo usuarios inactivos');
      }

      console.log('✅ [USER-SERVICE] Usuarios inactivos obtenidos:', response.data.length);
      return response;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error obteniendo usuarios inactivos:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== OBTENER USUARIO POR ID ===============
  static async getUserById(id: string): Promise<User> {
    try {
      console.log('🔍 [USER-SERVICE] Obteniendo usuario por ID:', id);

      const response = await JwtApiService.get<ApiResponse<User>>(`/usuarios/${id}`);

      if (!response.ok || !response.data) {
        throw new Error(response.msg || response.message || 'Usuario no encontrado');
      }

      console.log('✅ [USER-SERVICE] Usuario obtenido:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error obteniendo usuario:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== ACTUALIZAR USUARIO ===============
  static async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<User> {
    try {
      console.log('🔄 [USER-SERVICE] Actualizando usuario:', id, userData);

      const response = await JwtApiService.put<ApiResponse<User>>(
        `/usuarios/${id}`,
        userData
      );

      if (!response.ok || !response.data) {
        throw new Error(response.msg || response.message || 'Error actualizando usuario');
      }

      console.log('✅ [USER-SERVICE] Usuario actualizado:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error actualizando usuario:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== DESACTIVAR USUARIO ===============
  static async deactivateUser(id: string): Promise<boolean> {
    try {
      console.log('🔄 [USER-SERVICE] Desactivando usuario:', id);

      const response = await JwtApiService.delete<ApiResponse<any>>(`/usuarios/${id}`);

      if (!response.ok) {
        throw new Error(response.msg || response.message || 'Error desactivando usuario');
      }

      console.log('✅ [USER-SERVICE] Usuario desactivado exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error desactivando usuario:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== REACTIVAR USUARIO ===============
  static async reactivateUser(id: string): Promise<boolean> {
    try {
      console.log('🔄 [USER-SERVICE] Reactivando usuario:', id);

      const response = await JwtApiService.patch<ApiResponse<any>>(
        `/usuarios/${id}/reactivar`
      );

      if (!response.ok) {
        throw new Error(response.msg || response.message || 'Error reactivando usuario');
      }

      console.log('✅ [USER-SERVICE] Usuario reactivado exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error reactivando usuario:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== CAMBIAR CONTRASEÑA DE USUARIO ===============
  static async changeUserPassword(
    id: string, 
    passwordData: { contrasenaActual: string; contrasenaNueva: string }
  ): Promise<boolean> {
    try {
      console.log('🔄 [USER-SERVICE] Cambiando contraseña de usuario:', id);

      const response = await JwtApiService.patch<ApiResponse<any>>(
        `/usuarios/${id}/cambiar-contrasena`,
        passwordData
      );

      if (!response.ok) {
        throw new Error(response.msg || response.message || 'Error cambiando contraseña');
      }

      console.log('✅ [USER-SERVICE] Contraseña cambiada exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error cambiando contraseña:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== UTILIDADES ===============
  private static handleApiError(error: any): Error {
    if (error.message) {
      return new Error(error.message);
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    return new Error('Error desconocido en el servicio de usuarios');
  }
}

export default JwtUserService;