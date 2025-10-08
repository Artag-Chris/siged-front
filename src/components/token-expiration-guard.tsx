// components/token-expiration-guard.tsx
// Componente de guardia para monitorear la expiración del token en toda la app

"use client"

import { useEffect } from 'react';
import { useTokenExpirationMonitor } from '@/hooks/useTokenExpirationMonitor';
import { useJwtAuth } from '@/hooks/useJwtAuth';

interface TokenExpirationGuardProps {
  /**
   * Intervalo de verificación en milisegundos
   * Por defecto: 60000 (1 minuto)
   */
  checkInterval?: number;
  
  /**
   * Ruta de redirección al expirar
   * Por defecto: '/login'
   */
  redirectTo?: string;
  
  /**
   * Habilitar logs en consola
   * Por defecto: true
   */
  enableLogs?: boolean;
}

export function TokenExpirationGuard({
  checkInterval = 60000,
  redirectTo = '/login',
  enableLogs = true
}: TokenExpirationGuardProps) {
  const { isAuthenticated } = useJwtAuth();

  // Activar monitor solo si está autenticado
  useTokenExpirationMonitor({
    checkInterval,
    redirectTo,
    enabled: isAuthenticated,
    showWarning: false, // La advertencia se maneja en el Navbar
    onTokenExpired: () => {
      if (enableLogs) {
        console.log('🔒 [TOKEN-GUARD] Sesión expirada - Redirigiendo al login');
      }
    }
  });

  useEffect(() => {
    if (enableLogs && isAuthenticated) {
      console.log(`🛡️ [TOKEN-GUARD] Guardian de token activado (verificando cada ${checkInterval / 1000}s)`);
    }
  }, [isAuthenticated, checkInterval, enableLogs]);

  // Este componente no renderiza nada
  return null;
}
