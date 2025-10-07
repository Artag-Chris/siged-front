// services/password-recovery.service.ts
import JwtApiService from './jwt-api.service';
import {
  SolicitarCodigoResponse,
  VerificarCodigoResponse,
  ReenviarCodigoResponse,
  PasswordValidation,
} from '@/types/password-recovery.types';

/**
 * Servicio para recuperación de contraseña
 * Proceso de 3 pasos con códigos SMS de 6 dígitos
 */
class PasswordRecoveryService {
  private readonly BASE_PATH = '/api/usuario/recuperacion';

  /**
   * ============================================================================
   * PASO 1: Solicitar código de recuperación por SMS
   * ============================================================================
   */
  async solicitarCodigo(documento: string): Promise<SolicitarCodigoResponse> {
    try {
      console.log('📱 [PASSWORD-RECOVERY] Solicitando código para documento:', documento);

      const response = await fetch(
        `${JwtApiService.getBaseUrl()}${this.BASE_PATH}/solicitar-codigo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documento }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al solicitar código');
      }

      console.log('✅ [PASSWORD-RECOVERY] Código solicitado exitosamente');
      return data;
    } catch (error: any) {
      console.error('❌ [PASSWORD-RECOVERY] Error solicitando código:', error);
      throw new Error(
        error.message || 'Error al solicitar código de recuperación'
      );
    }
  }

  /**
   * ============================================================================
   * PASO 2: Verificar código y cambiar contraseña
   * ============================================================================
   */
  async verificarCodigoYCambiarContrasena(
    documento: string,
    codigo: string,
    nuevaContrasena: string
  ): Promise<VerificarCodigoResponse> {
    try {
      console.log('🔐 [PASSWORD-RECOVERY] Verificando código y cambiando contraseña');

      // Validar formato del código
      if (!/^\d{6}$/.test(codigo)) {
        throw new Error('El código debe ser de 6 dígitos');
      }

      // Validar contraseña en el frontend
      const validacion = this.validarContrasena(nuevaContrasena);
      if (!validacion.esValida) {
        throw new Error(validacion.errores.join('. '));
      }

      const response = await fetch(
        `${JwtApiService.getBaseUrl()}${this.BASE_PATH}/verificar-codigo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documento,
            codigo,
            nuevaContrasena,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar código');
      }

      console.log('✅ [PASSWORD-RECOVERY] Contraseña cambiada exitosamente');
      return data;
    } catch (error: any) {
      console.error('❌ [PASSWORD-RECOVERY] Error verificando código:', error);
      throw new Error(error.message || 'Error al verificar código');
    }
  }

  /**
   * ============================================================================
   * PASO 3: Reenviar código de recuperación
   * ============================================================================
   */
  async reenviarCodigo(documento: string): Promise<ReenviarCodigoResponse> {
    try {
      console.log('📱 [PASSWORD-RECOVERY] Reenviando código');

      const response = await fetch(
        `${JwtApiService.getBaseUrl()}${this.BASE_PATH}/reenviar-codigo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documento }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar código');
      }

      console.log('✅ [PASSWORD-RECOVERY] Código reenviado exitosamente');
      return data;
    } catch (error: any) {
      console.error('❌ [PASSWORD-RECOVERY] Error reenviando código:', error);
      throw new Error(error.message || 'Error al reenviar código');
    }
  }

  /**
   * ============================================================================
   * UTILIDADES DE VALIDACIÓN
   * ============================================================================
   */

  /**
   * Validar formato y seguridad de la contraseña
   */
  validarContrasena(contrasena: string): PasswordValidation {
    const errores: string[] = [];

    if (!contrasena || contrasena.length < 8) {
      errores.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[a-z]/.test(contrasena)) {
      errores.push('Debe contener al menos una letra minúscula');
    }

    if (!/[A-Z]/.test(contrasena)) {
      errores.push('Debe contener al menos una letra mayúscula');
    }

    if (!/\d/.test(contrasena)) {
      errores.push('Debe contener al menos un número');
    }

    return {
      esValida: errores.length === 0,
      errores,
    };
  }

  /**
   * Validar formato de documento
   */
  validarDocumento(documento: string): boolean {
    // Remover espacios y guiones
    const documentoLimpio = documento.replace(/[\s\-]/g, '');

    // Debe ser numérico y tener entre 6 y 15 dígitos
    return /^\d{6,15}$/.test(documentoLimpio);
  }

  /**
   * Calcular fortaleza de contraseña (1-5)
   */
  calcularFortaleza(contrasena: string): number {
    let fortaleza = 0;

    if (contrasena.length >= 8) fortaleza++;
    if (contrasena.length >= 12) fortaleza++;
    if (/[a-z]/.test(contrasena) && /[A-Z]/.test(contrasena)) fortaleza++;
    if (/\d/.test(contrasena)) fortaleza++;
    if (/[^A-Za-z0-9]/.test(contrasena)) fortaleza++;

    return Math.min(fortaleza, 5);
  }

  /**
   * Obtener color según fortaleza (para UI)
   */
  getColorFortaleza(fortaleza: number): string {
    const colores = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
    ];
    return colores[fortaleza - 1] || 'bg-gray-300';
  }

  /**
   * Obtener texto según fortaleza
   */
  getTextoFortaleza(fortaleza: number): string {
    const textos = [
      'Muy débil',
      'Débil',
      'Regular',
      'Fuerte',
      'Muy fuerte',
    ];
    return textos[fortaleza - 1] || 'Sin contraseña';
  }
}

export default new PasswordRecoveryService();
