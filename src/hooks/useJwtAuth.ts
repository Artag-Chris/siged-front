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

  useEffect(() => {
    if (autoInitialize) {
      initializeAuth();
    }
  }, [autoInitialize, initializeAuth]);

  useEffect(() => {
    if (!isLoading) {

      if (isAuthenticated && redirectIfAuthenticated) {
       
        if (typeof window !== 'undefined' && window.location.pathname !== redirectIfAuthenticated) {
          router.push(redirectIfAuthenticated);
        }
        return;
      }

      if (!isAuthenticated && redirectTo) {

        if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
          router.push(redirectTo);
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, redirectTo, redirectIfAuthenticated, router]);

  const login = async (email: string, password: string): Promise<boolean> => {   
    const success = await storeLogin(email, password);
    
    if (success) {

      if (redirectIfAuthenticated) {
        router.push(redirectIfAuthenticated);
      }
    } else {
      console.error('❌ [USE-JWT-AUTH] Login fallido');
    }
    
    return success;
  };

  const logout = async (): Promise<void> => {
    
    try {
      await storeLogout();

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

  };

  const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<boolean> => {
    
    const success = await storeUpdateUser(userId, userData);
    
    if (success) {
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