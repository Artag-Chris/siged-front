// types/actos-administrativos.types.ts

/**
 * TIPOS PARA EL MÓDULO DE ACTOS ADMINISTRATIVOS
 * 
 * Este módulo maneja la creación y gestión de actos administrativos
 * con generación automática de nombres usando el formato:
 * "Resolución I.E [Nombre Institución]-[Consecutivo]"
 * 
 * Flujo de 3 Promesas:
 * - PROMESA 1: Crear acto administrativo (POST /api/actos-administrativos)
 * - PROMESA 2: Subir archivos (POST /api/documents/upload/actos-administrativos) - OBLIGATORIO
 * - PROMESA 3: Registrar documentos en BD (POST /api/documentos-actos-administrativos)
 */

// ============================================================================
// ENTIDAD PRINCIPAL: Acto Administrativo
// ============================================================================

export interface ActoAdministrativo {
  id: number;
  fecha_creacion: string; // ISO 8601 date string
  nombre: string; // Generado automáticamente: "Resolución I.E [Institución]-[Consecutivo]"
  descripcion: string | null;
  institucion_educativa_id: string;
  created_at: string;
  updated_at?: string;
  
  // Relaciones
  documentos_actos_administrativos?: DocumentoActoAdministrativo[];
  institucion_educativa?: {
    id: string;
    nombre: string;
  };
  
  // Campos adicionales del sistema de generación de nombres
  consecutivo?: string; // Ej: "0001", "0002"
  patron_generado?: boolean; // Indica si el nombre fue generado automáticamente
}

// ============================================================================
// DTOs PARA CREACIÓN Y ACTUALIZACIÓN
// ============================================================================

export interface ICreateActoAdministrativo {
  institucion_educativa_id: string; // UUID de la institución
  descripcion?: string; // Opcional
  // ⚠️ NO incluir 'nombre' - se genera automáticamente en el backend
}

export interface IUpdateActoAdministrativo {
  descripcion?: string;
  // ⚠️ El nombre NO se puede actualizar (es generado automáticamente)
}

// ============================================================================
// ENTIDAD: Documento de Acto Administrativo
// ============================================================================

export interface DocumentoActoAdministrativo {
  id: string; // UUID
  acto_administrativo_id: number;
  nombre: string;
  ruta_relativa: string;
  created_at: string;
  updated_at?: string;
  
  // Relación inversa
  actos_administrativos?: {
    id: number;
    nombre: string;
    fecha_creacion: string;
  };
}

export interface ICreateDocumentoActoAdministrativo {
  acto_administrativo_id: number;
  nombre: string;
  ruta_relativa: string;
}

export interface IUpdateDocumentoActoAdministrativo {
  nombre?: string;
  ruta_relativa?: string;
}

// ============================================================================
// RESPONSES DE LA API
// ============================================================================

export interface ActoAdministrativoResponse {
  success: boolean;
  message: string;
  data: ActoAdministrativo;
}

export interface ActosAdministrativosListResponse {
  success: boolean;
  message: string;
  data: ActoAdministrativo[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DocumentoActoAdministrativoResponse {
  success: boolean;
  message: string;
  data: DocumentoActoAdministrativo;
}

export interface DocumentosActosAdministrativosListResponse {
  success: boolean;
  message: string;
  data: DocumentoActoAdministrativo[];
  acto?: ActoAdministrativo; // Incluido cuando se filtran por acto_id
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ============================================================================
// RESPUESTA DE UPLOAD DE ARCHIVOS (PROMESA 2)
// ============================================================================

/**
 * Response de la API de Documentos (Storage API - Promesa 2)
 * Endpoint: POST /api/documents/upload/actos-administrativos
 * 
 * Estructura según documentación: PROMESA_2_ACTOS_ADMINISTRATIVOS_STORAGE_API.md
 */
export interface UploadFilesResponse {
  success: boolean;
  message: string;
  data: {
    archivos_procesados: Array<{
      nombre_original: string;           // ✅ CRÍTICO para Promesa 3
      nombre_guardado?: string;           // Nombre con timestamp
      ruta_relativa: string;              // ✅ CRÍTICO para Promesa 3
      tamano?: number;                    // Tamaño en bytes
      tipo_mime?: string;                 // MIME type del archivo
      elasticsearch_id?: string | null;  // ID en Elasticsearch (solo PDFs)
    }>;
    total_archivos: number;
    elasticsearch_indexados?: number;
    acto_administrativo_id: string | number;
    institucion_educativa_id: string;
    timestamp?: string;                   // ISO 8601 timestamp
  };
}

// ============================================================================
// FILTROS Y PARÁMETROS DE BÚSQUEDA
// ============================================================================

export interface ActosAdministrativosFilters {
  page?: number;
  limit?: number;
  search?: string; // Búsqueda por nombre o descripción
  institucion_educativa_id?: string;
  fecha_desde?: string; // ISO 8601
  fecha_hasta?: string; // ISO 8601
}

export interface DocumentosActosAdministrativosFilters {
  page?: number;
  limit?: number;
  search?: string;
  acto_id?: number; // Filtrar por acto administrativo
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

/**
 * Resultado del flujo completo de creación (3 promesas)
 */
export interface CrearActoAdministrativoCompletoResult {
  success: boolean;
  actoAdministrativo: ActoAdministrativo;
  documentos: DocumentoActoAdministrativo[];
}

/**
 * Información de institución para dropdowns
 */
export interface InstitucionInfo {
  id: string;
  nombre: string;
}

/**
 * Estadísticas de actos administrativos
 */
export interface ActosAdministrativosStats {
  total: number;
  por_institucion: Array<{
    institucion_id: string;
    institucion_nombre: string;
    total_actos: number;
    ultimo_consecutivo: number;
  }>;
}

// ============================================================================
// TIPOS PARA FORMULARIOS
// ============================================================================

export interface ActoAdministrativoFormData {
  institucion_educativa_id: string;
  descripcion: string;
  archivos: File[]; // ⚠️ OBLIGATORIOS en este módulo
}

/**
 * Estados del flujo de creación
 */
export type CreacionFlowState = 
  | 'form'           // Usuario llenando formulario
  | 'uploading'      // Subiendo archivos (Promesas 1, 2, 3)
  | 'success'        // Creación exitosa
  | 'error';         // Error en alguna promesa

export interface CreacionFlowStatus {
  state: CreacionFlowState;
  currentStep?: 1 | 2 | 3; // Paso actual del flujo
  message?: string;
  error?: string;
}
