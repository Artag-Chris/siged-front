// types/horas-extra.types.ts
// Tipos para el módulo de Horas Extra

export type Jornada = 'ma_ana' | 'tarde' | 'sabatina' | 'nocturna';

export interface HoraExtra {
  id: string;
  empleado_id: string;
  sede_id: string;
  cantidad_horas: number;
  fecha_realizacion: string;
  jornada: Jornada;
  observacion?: string;
  created_at: string;
  empleado?: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    email?: string;
  };
  sede?: {
    id: string;
    nombre: string;
    direccion?: string;
  };
  documentos_horas_extra?: DocumentoHoraExtra[];
}

export interface ICreateHoraExtra {
  empleado_id: string;
  sede_id: string;
  cantidad_horas: number;
  fecha_realizacion: string;
  jornada: Jornada;
  observacion?: string;
}

export interface IUpdateHoraExtra {
  empleado_id?: string;
  sede_id?: string;
  cantidad_horas?: number;
  fecha_realizacion?: string;
  jornada?: Jornada;
  observacion?: string;
}

export interface DocumentoHoraExtra {
  id: string;
  horas_extra_id: string;
  nombre: string;
  ruta_relativa: string;
  created_at: string;
  horas_extra?: HoraExtra;
}

export interface ICreateDocumentoHoraExtra {
  horas_extra_id: string;
  nombre: string;
  ruta_relativa: string;
}

// Filtros para consultas
export interface HorasExtraFilters {
  page?: number;
  limit?: number;
  empleado_id?: string;
  sede_id?: string;
  jornada?: Jornada;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface DocumentosHorasExtraFilters {
  page?: number;
  limit?: number;
  search?: string;
  horas_extra_id?: string;
  empleado_id?: string;
}

// Respuestas de la API
export interface HoraExtraResponse {
  success: boolean;
  message: string;
  data: HoraExtra;
}

export interface HorasExtraListResponse {
  success: boolean;
  message: string;
  data: HoraExtra[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DocumentoHoraExtraResponse {
  success: boolean;
  message: string;
  data: DocumentoHoraExtra;
}

export interface DocumentosHorasExtraListResponse {
  success: boolean;
  message: string;
  data: DocumentoHoraExtra[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  horas_extra?: {
    id: string;
    empleado: string;
    sede: string;
    cantidad_horas: number;
    fecha_realizacion: string;
    jornada: Jornada;
  };
}

export interface JornadaInfo {
  valor: Jornada;
  descripcion: string;
  ejemplo: string;
}

export interface JornadasResponse {
  success: boolean;
  message: string;
  data: JornadaInfo[];
}

// Respuesta de subida de archivos (Promesa 2)
// Según documentación: PROMESA_2_HORAS_EXTRA_STORAGE_API.md
export interface UploadFilesResponse {
  success: boolean;
  message: string;
  data: {
    horas_extra_id: string;
    total_archivos: number;
    archivos_procesados: Array<{
      nombre_original: string;        // ✅ Nombre original del archivo
      nombre_guardado: string;        // ✅ Nombre con el que se guardó
      ruta_relativa: string;          // ✅ Ruta relativa (para BD en Promesa 3)
      tamaño: number;                 // ✅ Tamaño en bytes
      tipo_mime: string;              // ✅ Tipo MIME (application/pdf, image/jpeg, etc.)
      elasticsearch_id?: string;      // ✅ ID en Elasticsearch (si se indexó)
    }>;
    elasticsearch_indexados: number;  // ✅ Cantidad indexados en Elasticsearch
    timestamp: string;                // ✅ ISO timestamp del procesamiento
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    empleado: string;
    sede: string;
    cantidadHoras: number;
    documentosEliminados: number;
  };
}
