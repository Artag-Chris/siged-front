// hooks/useJwtAuth.ts
// Custom hook para autenticación JWT

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJwtAuthStore } from '@/lib/jwt-auth-store';
import { UpdateUserRequest } from '@/types/auth.types';

interface UseJwtAuthReturn {
  // Estado
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Métodos
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userId: string, userData: UpdateUserRequest) => Promise<boolean>;
  clearError: () => void;
  
  // Utilidades
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

interface UseJwtAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: string;
  autoInitialize?: boolean;
}

export const useJwtAuth = (options: UseJwtAuthOptions = {}): UseJwtAuthReturn => {
  const {
    redirectTo,
    redirectIfAuthenticated,
    autoInitialize = true
  } = options;

  const router = useRouter();

  // Store state y actions
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    updateUser: storeUpdateUser,
    clearError,
    hasRole,
    hasAnyRole,
    initializeAuth
  } = useJwtAuthStore();

  // =============== INICIALIZACIÓN ===============
  useEffect(() => {
    if (autoInitialize) {
      console.log('🔧 [USE-JWT-AUTH] Inicializando hook de autenticación...');
      initializeAuth();
    }
  }, [autoInitialize, initializeAuth]);

  // =============== REDIRECCIONES ===============
  useEffect(() => {
    if (!isLoading) {
      // Solo redirigir si se especificó explícitamente
      
      // Redireccionar si está autenticado y hay redirectIfAuthenticated
      if (isAuthenticated && redirectIfAuthenticated) {
        console.log('↪️ [USE-JWT-AUTH] Usuario autenticado, redirigiendo a:', redirectIfAuthenticated);
        // Evitar redirección si ya estamos en esa página
        if (typeof window !== 'undefined' && window.location.pathname !== redirectIfAuthenticated) {
          router.push(redirectIfAuthenticated);
        }
        return;
      }

      // Redireccionar si NO está autenticado y hay redirectTo
      if (!isAuthenticated && redirectTo) {
        console.log('↪️ [USE-JWT-AUTH] Usuario no autenticado, redirigiendo a:', redirectTo);
        // Evitar redirección si ya estamos en esa página
        if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
          router.push(redirectTo);
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, redirectTo, redirectIfAuthenticated, router]);

  // =============== LOGIN WRAPPER ===============
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 [USE-JWT-AUTH] Intentando login para:', email);
    
    const success = await storeLogin(email, password);
    
    if (success) {
      console.log('✅ [USE-JWT-AUTH] Login exitoso');
      
      // Redireccionar después del login exitoso
      if (redirectIfAuthenticated) {
        router.push(redirectIfAuthenticated);
      }
    } else {
      console.error('❌ [USE-JWT-AUTH] Login fallido');
    }
    
    return success;
  };

  // =============== LOGOUT WRAPPER ===============
  const logout = async (): Promise<void> => {
    console.log('🔓 [USE-JWT-AUTH] Iniciando logout desde hook...');
    
    try {
      // Llamar al logout del store (que a su vez llama al servicio)
      await storeLogout();
      
      console.log('✅ [USE-JWT-AUTH] Logout exitoso, redirigiendo...');
      
      // Redireccionar después del logout exitoso
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        // Redirección por defecto al login si no se especifica redirectTo
        router.push('/login');
      }
      
    } catch (error: any) {
      console.error('❌ [USE-JWT-AUTH] Error en logout:', error.message);
      
      // Aunque haya error, redirigir al login
      router.push(redirectTo || '/login');
    }
    
    console.log('📍 [USE-JWT-AUTH] Logout completado con redirección');
  };

  // =============== UPDATE USER WRAPPER ===============
  const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<boolean> => {
    console.log('✏️ [USE-JWT-AUTH] Actualizando usuario:', userId);
    
    const success = await storeUpdateUser(userId, userData);
    
    if (success) {
      console.log('✅ [USE-JWT-AUTH] Usuario actualizado exitosamente');
    } else {
      console.error('❌ [USE-JWT-AUTH] Error actualizando usuario');
    }
    
    return success;
  };

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Métodos
    login,
    logout,
    updateUser,
    clearError,
    
    // Utilidades
    hasRole,
    hasAnyRole
  };
};

export default useJwtAuth;