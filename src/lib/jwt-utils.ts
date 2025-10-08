// lib/jwt-utils.ts
// Utilidades para manejo y validación de tokens JWT

/**
 * Decodifica un token JWT sin verificar la firma
 * Solo para extraer información del payload
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('❌ [JWT-UTILS] Token JWT inválido - debe tener 3 partes');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    
    // Decodificar base64url
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ [JWT-UTILS] Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Verifica si un token JWT está expirado
 * @param token - Token JWT a verificar
 * @returns true si el token está expirado, false si aún es válido
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) {
    console.log('⚠️ [JWT-UTILS] No hay token para verificar');
    return true;
  }

  try {
    const decoded = decodeJWT(token);
    
    if (!decoded || !decoded.exp) {
      console.error('❌ [JWT-UTILS] Token sin fecha de expiración');
      return true;
    }

    // exp está en segundos, Date.now() en milisegundos
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;

    if (isExpired) {
      const expiredDate = new Date(decoded.exp * 1000);
      console.log(`⏰ [JWT-UTILS] Token expirado desde: ${expiredDate.toLocaleString()}`);
    } else {
      const expiresDate = new Date(decoded.exp * 1000);
      const minutesLeft = Math.floor((decoded.exp - currentTime) / 60);
      console.log(`✅ [JWT-UTILS] Token válido. Expira en ${minutesLeft} minutos (${expiresDate.toLocaleString()})`);
    }

    return isExpired;
  } catch (error) {
    console.error('❌ [JWT-UTILS] Error verificando expiración:', error);
    return true;
  }
}

/**
 * Obtiene el tiempo restante antes de que expire el token (en segundos)
 * @param token - Token JWT
 * @returns Segundos hasta expiración, o 0 si ya expiró
 */
export function getTokenExpirationTime(token: string | null): number {
  if (!token) return 0;

  try {
    const decoded = decodeJWT(token);
    
    if (!decoded || !decoded.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - currentTime;

    return Math.max(0, timeLeft);
  } catch (error) {
    console.error('❌ [JWT-UTILS] Error obteniendo tiempo de expiración:', error);
    return 0;
  }
}

/**
 * Verifica si el token está próximo a expirar
 * @param token - Token JWT
 * @param thresholdMinutes - Minutos de umbral (por defecto 5)
 * @returns true si el token expirará pronto
 */
export function isTokenExpiringSoon(token: string | null, thresholdMinutes: number = 5): boolean {
  const timeLeft = getTokenExpirationTime(token);
  const thresholdSeconds = thresholdMinutes * 60;
  
  return timeLeft > 0 && timeLeft <= thresholdSeconds;
}

/**
 * Extrae información del usuario del token JWT
 */
export function getUserFromToken(token: string | null): any {
  if (!token) return null;

  try {
    const decoded = decodeJWT(token);
    
    if (!decoded) return null;

    return {
      id: decoded.id || decoded.sub || decoded.userId,
      email: decoded.email,
      rol: decoded.rol || decoded.role,
      nombre: decoded.nombre || decoded.name,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error('❌ [JWT-UTILS] Error extrayendo usuario del token:', error);
    return null;
  }
}

/**
 * Formatea el tiempo restante en formato legible
 */
export function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return 'Expirado';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
