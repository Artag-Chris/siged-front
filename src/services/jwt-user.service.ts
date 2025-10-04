// services/jwt-user.service.ts
// Servicio para gestión de usuarios usando la API JWT

import JwtApiService from './jwt-api.service';
import { 
  CreateUserRequest, 
  User, 
  ApiResponse, 
  UserFilters, 
  UsersListResponse 
} from '@/types/auth.types';

export class JwtUserService {
  
  // =============== CREAR USUARIO INICIAL ===============
  // Este endpoint es público y no requiere autenticación
  static async createInitialUser(userData: CreateUserRequest): Promise<User> {
    try {
      const endpoint = '/api/usuario/create-initial-user';
      const fullUrl = `${JwtApiService.getBaseUrl()}${endpoint}`;
      
 

      const response = await JwtApiService.post<ApiResponse<User>>(
        endpoint,
        userData
      );

      if (!response.ok || !response.data) {
        throw new Error(response.msg || response.message || 'Error creando usuario inicial');
      }

      console.log('✅ [USER-SERVICE] Usuario inicial creado exitosamente:', {
        id: response.data.id,
        email: response.data.email,
        rol: response.data.rol,
        estado: response.data.estado
      });
      
      return response.data;

    } catch (error: any) {
      console.error('❌ [USER-SERVICE] Error creando usuario inicial:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== CREAR USUARIO (REQUIERE AUTH) ===============
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const endpoint = '/usuarios';
      const fullUrl = `${JwtApiService.getBaseUrl()}${endpoint}`;
      
      console.log('🚀 [USER-SERVICE] Creando usuario (requiere auth)...');
      console.log('🌐 [USER-SERVICE] URL completa:', fullUrl);
      console.log('📤 [USER-SERVICE] Datos enviados:', {
        tipo_documento: userData.tipo_documento,
        documento: userData.documento,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        celular: userData.celular || 'No especificado',
        rol: userData.rol,
        contrasena: '[OCULTA POR SEGURIDAD]'
      });

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
      // Construir query params
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/usuarios?${queryString}` : '/usuarios';
      const fullUrl = `${JwtApiService.getBaseUrl()}${endpoint}`;

      console.log('🔍 [USER-SERVICE] Obteniendo usuarios...');
      console.log('🌐 [USER-SERVICE] URL completa:', fullUrl);
      console.log('🔧 [USER-SERVICE] Filtros aplicados:', filters);

      const response = await JwtApiService.get<UsersListResponse>(endpoint);

      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo usuarios');
      }

      console.log('✅ [USER-SERVICE] Usuarios obtenidos:', {
        count: response.data.length,
        pagination: response.pagination
      });

      return response;

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