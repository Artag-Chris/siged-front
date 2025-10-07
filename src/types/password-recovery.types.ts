// types/password-recovery.types.ts

/**
 * TIPOS PARA RECUPERACIÓN DE CONTRASEÑA
 * Sistema de recuperación por SMS con códigos de 6 dígitos
 */

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface SolicitarCodigoRequest {
  documento: string;
}

export interface VerificarCodigoRequest {
  documento: string;
  codigo: string;
  nuevaContrasena: string;
}

export interface ReenviarCodigoRequest {
  documento: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface SolicitarCodigoResponse {
  success: boolean;
  message: string;
  data?: {
    celularParcial: string;
    validoHasta: string;
    instrucciones: string;
  };
  error?: string;
}

export interface VerificarCodigoResponse {
  success: boolean;
  message: string;
  data?: {
    usuario: string;
    email: string;
  };
  error?: string;
}

export interface ReenviarCodigoResponse {
  success: boolean;
  message: string;
  data?: {
    celularParcial: string;
    validoHasta: string;
  };
  error?: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export type RecoveryStep = 'solicitar' | 'verificar' | 'exito';

export interface PasswordValidation {
  esValida: boolean;
  errores: string[];
}

export interface RecoveryState {
  step: RecoveryStep;
  documento: string;
  celularParcial: string;
  validoHasta: Date | null;
  usuarioNombre: string;
  isLoading: boolean;
  error: string | null;
}
