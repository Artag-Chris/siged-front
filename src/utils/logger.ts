// utils/logger.ts
/**
 * Sistema de logging condicional para producción
 * 
 * En desarrollo: muestra todos los logs
 * En producción: solo muestra errores y warnings
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';

export const logger = {
  /**
   * Logs informativos (solo en desarrollo)
   */
  log: (...args: any[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.log(...args);
    }
  },

  /**
   * Logs de información (solo en desarrollo)
   */
  info: (...args: any[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.info(...args);
    }
  },

  /**
   * Warnings (siempre se muestran)
   */
  warn: (...args: any[]) => {
    console.warn(...args);
  },

  /**
   * Errores (siempre se muestran)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Logs de debug con prefijo (solo en desarrollo)
   */
  debug: (component: string, ...args: any[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.log(`[DEBUG:${component}]`, ...args);
    }
  },

  /**
   * Grupos de logs (solo en desarrollo)
   */
  group: (label: string) => {
    if (isDevelopment || isDebugEnabled) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (isDevelopment || isDebugEnabled) {
      console.groupEnd();
    }
  },

  /**
   * Tabla (solo en desarrollo)
   */
  table: (data: any) => {
    if (isDevelopment || isDebugEnabled) {
      console.table(data);
    }
  },
};

export default logger;
