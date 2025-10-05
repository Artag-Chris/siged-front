// lib/jwt-auth-store.ts
// Store de Zustand para autenticación JWT

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import JwtAuthService from '@/services/jwt-auth.service';

interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'super_admin' | 'admin' | 'gestor';
}

interface AuthState {
  // Estado
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  clearError: () => void;
  clearAllStorage: () => void;
  setLoading: (loading: boolean) => void;
  
  // Utilidades
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  
  // Getters para JWT
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getCurrentUser: () => AuthUser | null;
  
  // Inicialización
  initializeAuth: () => void;
}

export const useJwtAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // =============== ESTADO INICIAL ===============
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // =============== LOGIN ===============
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔐 [JWT-STORE] Iniciando proceso de login...');
          
          const response = await JwtAuthService.login({
            email,
            contrasena: password
          });

          if (response.ok && response.data) {
            const { usuario, token, refreshToken } = response.data;
            
            // Guardar en el store
            set({
              user: usuario,
              accessToken: token,
              refreshToken: refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });

            // Guardar tokens en el servicio
            JwtAuthService.setTokens(token, refreshToken);
            JwtAuthService.setUser(usuario);

            console.log('✅ [JWT-STORE] Login exitoso, usuario logueado:', {
              nombre: usuario.nombre,
              email: usuario.email,
              rol: usuario.rol
            });

            return true;
          }

          throw new Error('Respuesta de login inválida');

        } catch (error: any) {
          console.error('❌ [JWT-STORE] Error en login:', error.message);
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message
          });

          return false;
        }
      },

      // =============== LOGOUT ===============
      logout: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {
          console.log('🔓 [JWT-STORE] Iniciando proceso de logout...');
          
          // Llamar al servicio que enviará el JWT al servidor
          await JwtAuthService.logout();

          // Limpiar estado del store
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          console.log('✅ [JWT-STORE] Logout completado exitosamente');

        } catch (error: any) {
          console.error('❌ [JWT-STORE] Error en logout:', error.message);
          
          // Limpiar estado local aunque falle el API
          // Es importante que el usuario pueda cerrar sesión aunque el servidor falle
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          
          console.log('🧹 [JWT-STORE] Logout local forzado completado');
        }
      },

      // =============== REFRESH TOKENS ===============
      refreshTokens: async (): Promise<boolean> => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          console.warn('⚠️ [JWT-STORE] No hay refresh token disponible');
          return false;
        }

        try {
          console.log('🔄 [JWT-STORE] Renovando tokens...');
          
          const newToken = await JwtAuthService.refreshToken();
          
          if (newToken) {
            set({ accessToken: newToken });
            console.log('✅ [JWT-STORE] Tokens renovados exitosamente');
            return true;
          }
          
          throw new Error('No se pudo renovar el token');

        } catch (error: any) {
          console.error('❌ [JWT-STORE] Error renovando tokens:', error.message);
          
          // Limpiar sesión si falló la renovación
          get().logout();
          return false;
        }
      },

      // =============== UTILIDADES ===============
      clearError: () => {
        set({ error: null });
      },

      clearAllStorage: () => {
        console.log('🧹 [JWT-STORE] Limpiando todo el storage...');
        
        JwtAuthService.clearAllStorage();
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      hasRole: (role: string): boolean => {
        const { user } = get();
        return user?.rol === role;
      },

      hasAnyRole: (roles: string[]): boolean => {
        const { user } = get();
        return user ? roles.includes(user.rol) : false;
      },

      // =============== GETTERS JWT ===============
      getAccessToken: (): string | null => {
        const { accessToken } = get();
        return accessToken;
      },

      getRefreshToken: (): string | null => {
        const { refreshToken } = get();
        return refreshToken;
      },

      getCurrentUser: (): AuthUser | null => {
        const { user } = get();
        return user;
      },

      // =============== INICIALIZACIÓN ===============
      initializeAuth: () => {
        console.log('🔧 [JWT-STORE] Inicializando autenticación...');
        
        const token = JwtAuthService.getAccessToken();
        const refreshToken = JwtAuthService.getRefreshToken();
        const user = JwtAuthService.getUser();

        if (token && user) {
          set({
            user,
            accessToken: token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          console.log('✅ [JWT-STORE] Sesión restaurada:', {
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
          });
        } else {
          console.log('ℹ️ [JWT-STORE] No hay sesión activa');
        }
      }
    }),
    {
      name: 'jwt-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useJwtAuthStore;