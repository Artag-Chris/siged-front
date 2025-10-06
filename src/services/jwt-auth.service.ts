import JwtApiService from './jwt-api.service';
import {
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
  ChangePasswordRequest,
  UpdateUserRequest,
  UserFilters,
  UsersListResponse
} from '@/types/auth.types';

export class JwtAuthService {

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const endpoint = '/api/auth/login';
      const response = await JwtApiService.post<LoginResponse>(
        endpoint,
        credentials
      );

      if (!response.ok || !response.data) {
        throw new Error(response.msg || 'Error de autenticación');
      }

      return response;

    } catch (error: any) {
      console.error('❌ [AUTH-SERVICE] Error en login:', error.message);
      throw this.handleApiError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      const endpoint = '/api/auth/logout';

      const accessToken = this.getAccessToken();
      if (accessToken) {

        await JwtApiService.post(endpoint, {});

      } else {
      }

    } catch (error: any) {

    } finally {
      this.clearAllStorage();
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const endpoint = '/api/auth/refresh';
      const response = await JwtApiService.post<LoginResponse>(
        endpoint,
        { refreshToken }
      );

      if (response.ok && response.data?.token) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data.token;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Error renovando token:', error);
      this.clearTokens();
      return null;
    }
  }

  static async getProfile(): Promise<User | null> {
    try {
      const endpoint = '/api/auth/me';
      const response = await JwtApiService.get<ApiResponse<User>>(endpoint);

      if (response.ok && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('❌ [AUTH-SERVICE] Error obteniendo perfil:', error);
      return null;
    }
  }

  static async changePassword(passwordData: ChangePasswordRequest): Promise<boolean> {
    try {
      const endpoint = '/api/auth/change-password';
      const response = await JwtApiService.post<ApiResponse<any>>(
        endpoint,
        passwordData
      );

      if (response.ok) {
        return true;
      }

      throw new Error(response.msg || 'Error cambiando contraseña');
    } catch (error: any) {
      console.error('❌ [AUTH-SERVICE] Error cambiando contraseña:', error);
      throw this.handleApiError(error);
    }
  }

  static async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const endpoint = `/api/usuario/${userId}`;
      const response = await JwtApiService.put<ApiResponse<User>>(
        endpoint,
        userData
      );

      if (response.ok && response.data) {       
        const currentUser = this.getUser();
        if (currentUser && currentUser.id === userId) {
          this.setUser({
            ...currentUser,
            ...response.data
          });
        }

        return response;
      }

      throw new Error(response.msg || 'Error actualizando usuario');
    } catch (error: any) {
      console.error('❌ [AUTH-SERVICE] Error actualizando usuario:', error);
      throw this.handleApiError(error);
    }
  }

  static async getAllUsers(filters?: UserFilters): Promise<UsersListResponse> {
    try {
      const endpoint = '/api/auth/usuarios';
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const fullEndpoint = queryParams.toString()
        ? `${endpoint}?${queryParams.toString()}`
        : endpoint;

      const response = await JwtApiService.get<UsersListResponse>(fullEndpoint);

      if (response.success) {
        return response;
      }

      throw new Error(response.message || 'Error obteniendo usuarios');
    } catch (error: any) {
      console.error('❌ [AUTH-SERVICE] Error obteniendo usuarios:', error);
      throw this.handleApiError(error);
    }
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('jwt_access_token', accessToken);
    localStorage.setItem('jwt_refresh_token', refreshToken);

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


    JwtApiService.removeToken();
  }

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
  }

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