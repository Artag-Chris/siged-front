// services/jwt-auth.service.ts
// Servicio para autenticación JWT

import JwtApiService from './jwt-api.service';
import { 
  LoginRequest, 
  LoginResponse, 
  User, 
  ApiResponse,
  RefreshTokenRequest,
  ChangePasswordRequest 
} from '@/types/auth.types';

export class JwtAuthService {
  
  // =============== LOGIN ===============
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const endpoint = '/api/auth/login';
      const fullUrl = `${JwtApiService.getBaseUrl()}${endpoint}`;
      
      console.log('🔐 [AUTH-SERVICE] Iniciando login...');
      console.log('🌐 [AUTH-SERVICE] URL completa:', fullUrl);
      console.log('📤 [AUTH-SERVICE] Datos enviados:', {
        email: credentials.email,
        contrasena: '[OCULTA POR SEGURIDAD]'
      });

      const response = await JwtApiService.post<LoginResponse>(
        endpoint,
        credentials
      );

      if (!response.ok || !response.data) {
        throw new Error(response.msg || 'Error de autenticación');
      }

      console.log('✅ [AUTH-SERVICE] Login exitoso:', {
        usuario: response.data.usuario.nombre,
        email: response.data.usuario.email,
        rol: response.data.usuario.rol,
        tokenLength: response.data.token.length,
        refreshTokenLength: response.data.refreshToken.length
      });
      
      return response;

    } catch (error: any) {
      console.error('❌ [AUTH-SERVICE] Error en login:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== LOGOUT ===============
  static async logout(): Promise<void> {
    try {
      const endpoint = '/api/auth/logout';
      console.log('🔓 [AUTH-SERVICE] Cerrando sesión en el servidor...');

      // Verificar que tenemos token antes de hacer la petición
      const accessToken = this.getAccessToken();
      if (accessToken) {
        console.log('📤 [AUTH-SERVICE] Enviando logout al servidor con token JWT');
        
        // El JwtApiService ya maneja automáticamente el header Authorization
        // a través de los interceptores, solo necesitamos hacer la petición
        await JwtApiService.post(endpoint, {});
        
        console.log('✅ [AUTH-SERVICE] Logout del servidor exitoso');
      } else {
        console.log('ℹ️ [AUTH-SERVICE] No hay token activo, solo limpieza local');
      }

    } catch (error: any) {
      console.warn('⚠️ [AUTH-SERVICE] Error en logout del servidor:', error.message);
      // Continuar con logout local aunque falle el API
      // Esto es importante para que el usuario pueda cerrar sesión aunque el servidor falle
    } finally {
      // SIEMPRE limpiar tokens locales, sin importar si el API falló
      this.clearAllStorage();
      console.log('🧹 [AUTH-SERVICE] Logout local completado, tokens eliminados');
    }
  }

  // =============== REFRESH TOKEN ===============
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const endpoint = '/api/auth/refresh';
      console.log('🔄 [AUTH-SERVICE] Renovando token...');

      const response = await JwtApiService.post<LoginResponse>(
        endpoint,
        { refreshToken }
      );

      if (response.ok && response.data?.token) {
        this.setTokens(response.data.token, response.data.refreshToken);
        console.log('✅ [AUTH-SERVICE] Token renovado exitosamente');
        return response.data.token;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Error renovando token:', error);
      this.clearTokens();
      return null;
    }
  }

  // =============== GET USER PROFILE ===============
  static async getProfile(): Promise<User | null> {
    try {
      const endpoint = '/api/auth/me';
      console.log('👤 [AUTH-SERVICE] Obteniendo perfil de usuario...');

      const response = await JwtApiService.get<ApiResponse<User>>(endpoint);

      if (response.ok && response.data) {
        console.log('✅ [AUTH-SERVICE] Perfil obtenido:', {
          id: response.data.id,
          email: response.data.email,
          rol: response.data.rol
        });
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Error obteniendo perfil:', error);
      return null;
    }
  }

  // =============== CHANGE PASSWORD ===============
  static async changePassword(passwordData: ChangePasswordRequest): Promise<boolean> {
    try {
      const endpoint = '/api/auth/change-password';
      console.log('🔑 [AUTH-SERVICE] Cambiando contraseña...');

      const response = await JwtApiService.post<ApiResponse<any>>(
        endpoint,
        passwordData
      );

      if (response.ok) {
        console.log('✅ [AUTH-SERVICE] Contraseña cambiada exitosamente');
        return true;
      }

      throw new Error(response.msg || 'Error cambiando contraseña');
    } catch (error: any) {
      console.error('❌ [AUTH-SERVICE] Error cambiando contraseña:', error);
      throw this.handleApiError(error);
    }
  }

  // =============== TOKEN MANAGEMENT ===============
  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('jwt_access_token', accessToken);
    localStorage.setItem('jwt_refresh_token', refreshToken);
    
    // También actualizar el token en el servicio API
    JwtApiService.setToken(accessToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('jwt_access_token');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('jwt_refresh_token');
  }

  static clearTokens(): void {
    localStorage.removeItem('jwt_access_token');
    localStorage.removeItem('jwt_refresh_token');
    
    // También limpiar del servicio API
    JwtApiService.removeToken();
  }

  // =============== USER MANAGEMENT ===============
  static setUser(user: any): void {
    localStorage.setItem('jwt_user', JSON.stringify(user));
  }

  static getUser(): any | null {
    const userStr = localStorage.getItem('jwt_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static clearUser(): void {
    localStorage.removeItem('jwt_user');
  }

  // =============== UTILITIES ===============
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }

  static hasRole(role: string): boolean {
    const user = this.getUser();
    return user && user.rol === role;
  }

  static hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user && roles.includes(user.rol);
  }

  static clearAllStorage(): void {
    this.clearTokens();
    this.clearUser();
    console.log('🧹 [AUTH-SERVICE] Todo el storage JWT limpiado');
  }

  // =============== ERROR HANDLING ===============
  private static handleApiError(error: any): Error {
    if (error.response?.data?.msg) {
      return new Error(error.response.data.msg);
    }
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('Error de autenticación desconocido');
  }
}

export default JwtAuthService;