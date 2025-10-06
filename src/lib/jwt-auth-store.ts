import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import JwtAuthService from '@/services/jwt-auth.service';
import { UpdateUserRequest } from '@/types/auth.types';

interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'super_admin' | 'admin' | 'gestor';
}

interface AuthState {
  
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
  updateUser: (userId: string, userData: UpdateUserRequest) => Promise<boolean>;
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

      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

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

            set({
              user: usuario,
              accessToken: token,
              refreshToken: refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });


            JwtAuthService.setTokens(token, refreshToken);
            JwtAuthService.setUser(usuario);

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

      logout: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {

          await JwtAuthService.logout();

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
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

        }
      },

      // =============== REFRESH TOKENS ===============
      refreshTokens: async (): Promise<boolean> => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          return false;
        }

        try {
          
          const newToken = await JwtAuthService.refreshToken();
          
          if (newToken) {
            set({ accessToken: newToken });
            console.log('✅ [JWT-STORE] Tokens renovados exitosamente');
            return true;
          }
          
          throw new Error('No se pudo renovar el token');

        } catch (error: any) {
          console.error('❌ [JWT-STORE] Error renovando tokens:', error.message);

          get().logout();
          return false;
        }
      },

      updateUser: async (userId: string, userData: UpdateUserRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          
          const response = await JwtAuthService.updateUser(userId, userData);

          if (response.ok && response.data) {
            const { user: currentUser } = get();
            
            // Si es el usuario actual, actualizar el estado
            if (currentUser && currentUser.id === userId) {
              set({
                user: {
                  id: response.data.id,
                  nombre: response.data.nombre,
                  email: response.data.email,
                  rol: response.data.rol as 'super_admin' | 'admin' | 'gestor'
                },
                isLoading: false,
                error: null
              });
            } else {
              set({ isLoading: false });
            }

            return true;
          }

          throw new Error('Error actualizando usuario');

        } catch (error: any) {
          console.error('❌ [JWT-STORE] Error actualizando usuario:', error.message);
          
          set({
            isLoading: false,
            error: error.message
          });

          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      clearAllStorage: () => {
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

      initializeAuth: () => {       
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

        } else {

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