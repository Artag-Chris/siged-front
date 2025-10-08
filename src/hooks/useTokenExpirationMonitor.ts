// hooks/useTokenExpirationMonitor.ts
// Hook para monitorear la expiración del token JWT automáticamente

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useJwtAuthStore } from '@/lib/jwt-auth-store';
import { isTokenExpired, getTokenExpirationTime, isTokenExpiringSoon } from '@/lib/jwt-utils';

interface UseTokenExpirationMonitorOptions {
  /**
   * Intervalo de verificación en milisegundos
   * Por defecto: 60000 (1 minuto)
   */
  checkInterval?: number;
  
  /**
   * Ruta a la que redirigir cuando expire el token
   * Por defecto: '/login'
   */
  redirectTo?: string;
  
  /**
   * Si debe mostrar advertencia antes de expirar
   * Por defecto: true
   */
  showWarning?: boolean;
  
  /**
   * Minutos antes de expiración para mostrar advertencia
   * Por defecto: 5 minutos
   */
  warningThresholdMinutes?: number;
  
  /**
   * Callback cuando el token está por expirar
   */
  onTokenExpiring?: () => void;
  
  /**
   * Callback cuando el token expiró
   */
  onTokenExpired?: () => void;
  
  /**
   * Si está habilitado el monitor
   * Por defecto: true
   */
  enabled?: boolean;
}

export const useTokenExpirationMonitor = (
  options: UseTokenExpirationMonitorOptions = {}
) => {
  const {
    checkInterval = 60000, // 1 minuto
    redirectTo = '/login',
    showWarning = true,
    warningThresholdMinutes = 5,
    onTokenExpiring,
    onTokenExpired,
    enabled = true
  } = options;

  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarning = useRef(false);
  const hasExpiredAlready = useRef(false);

  const { 
    isAuthenticated, 
    accessToken, 
    logout,
    getAccessToken 
  } = useJwtAuthStore();

  /**
   * Función que verifica el estado del token
   */
  const checkTokenExpiration = useCallback(async () => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    const token = getAccessToken();
    
    if (!token) {
      console.log('⚠️ [TOKEN-MONITOR] No hay token disponible');
      
      if (!hasExpiredAlready.current) {
        hasExpiredAlready.current = true;
        console.log('🔄 [TOKEN-MONITOR] Cerrando sesión por falta de token...');
        
        await logout();
        
        if (onTokenExpired) {
          onTokenExpired();
        }
        
        router.push(redirectTo);
      }
      return;
    }

    // Verificar si está expirado
    if (isTokenExpired(token)) {
      console.log('⏰ [TOKEN-MONITOR] Token expirado detectado');
      
      if (!hasExpiredAlready.current) {
        hasExpiredAlready.current = true;
        console.log('🔄 [TOKEN-MONITOR] Cerrando sesión por token expirado...');
        
        await logout();
        
        if (onTokenExpired) {
          onTokenExpired();
        }
        
        router.push(redirectTo);
      }
      return;
    }

    // Verificar si está por expirar
    if (showWarning && isTokenExpiringSoon(token, warningThresholdMinutes)) {
      const timeLeft = getTokenExpirationTime(token);
      const minutesLeft = Math.floor(timeLeft / 60);
      
      if (!hasShownWarning.current) {
        hasShownWarning.current = true;
        console.log(`⚠️ [TOKEN-MONITOR] Token expirará en ${minutesLeft} minutos`);
        
        if (onTokenExpiring) {
          onTokenExpiring();
        }
      }
    } else {
      // Resetear la advertencia si el token ya no está próximo a expirar
      hasShownWarning.current = false;
    }
  }, [
    enabled,
    isAuthenticated,
    getAccessToken,
    logout,
    router,
    redirectTo,
    showWarning,
    warningThresholdMinutes,
    onTokenExpired,
    onTokenExpiring
  ]);

  /**
   * Iniciar el monitoreo
   */
  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      // Limpiar intervalo si se desactiva o cierra sesión
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Verificar inmediatamente al montar
    checkTokenExpiration();

    // Configurar intervalo de verificación
    intervalRef.current = setInterval(() => {
      checkTokenExpiration();
    }, checkInterval);

    console.log(`🔍 [TOKEN-MONITOR] Monitor iniciado (verificando cada ${checkInterval / 1000}s)`);

    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('🛑 [TOKEN-MONITOR] Monitor detenido');
      }
    };
  }, [enabled, isAuthenticated, checkInterval, checkTokenExpiration]);

  /**
   * Resetear flags cuando cambie la autenticación
   */
  useEffect(() => {
    if (!isAuthenticated) {
      hasShownWarning.current = false;
      hasExpiredAlready.current = false;
    }
  }, [isAuthenticated]);

  return {
    checkNow: checkTokenExpiration
  };
};
