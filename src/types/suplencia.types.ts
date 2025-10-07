// types/suplencia.types.ts
// Tipos para el módulo de Suplencias

export type Jornada = 'ma_ana' | 'tarde' | 'sabatina';

export interface ICreateSuplencia {
  docente_ausente_id: string;
  causa_ausencia: string;
  fecha_inicio_ausencia: Date | string;
  fecha_fin_ausencia: Date | string;
  sede_id: string;
  docente_reemplazo_id: string;
  fecha_inicio_reemplazo: Date | string;
  fecha_fin_reemplazo: Date | string;
  horas_cubiertas: number;
  jornada: Jornada;
  observacion?: string;
}

export interface IUpdateSuplencia {
  docente_ausente_id?: string;
  causa_ausencia?: string;
  fecha_inicio_ausencia?: Date | string;
  fecha_fin_ausencia?: Date | string;
  sede_id?: string;
  docente_reemplazo_id?: string;
  fecha_inicio_reemplazo?: Date | string;
  fecha_fin_reemplazo?: Date | string;
  horas_cubiertas?: number;
  jornada?: Jornada;
  observacion?: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  cargo: string;
}

export interface Sede {
  id: string;
  nombre: string;
  zona: 'urbana' | 'rural';
  direccion: string;
}

export interface DocumentoSuplencia {
  id: string;
  suplencia_id: string;
  nombre: string;
  ruta_relativa: string;
  created_at: Date;
}

export interface Suplencia {
  id: string;
  docente_ausente_id: string;
  causa_ausencia: string;
  fecha_inicio_ausencia: Date;
  fecha_fin_ausencia: Date;
  sede_id: string;
  docente_reemplazo_id: string;
  fecha_inicio_reemplazo: Date;
  fecha_fin_reemplazo: Date;
  horas_cubiertas: number;
  jornada: Jornada;
  observacion?: string | null;
  created_at: Date;
  
  // Relaciones
  empleado_suplencias_docente_ausente_idToempleado: Empleado;
  empleado_suplencias_docente_reemplazo_idToempleado: Empleado;
  sede: Sede;
  documentos_suplencia?: DocumentoSuplencia[];
  _count?: {
    documentos_suplencia: number;
  };
}

export interface SuplenciaFilters {
  page?: number;
  limit?: number;
  search?: string;
  docente_ausente_id?: string;
  docente_reemplazo_id?: string;
  sede_id?: string;
  jornada?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  causa_ausencia?: string;
}

export interface SuplenciasListResponse {
  success: boolean;
  message: string;
  data: Suplencia[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SuplenciaResponse {
  success: boolean;
  message: string;
  data: Suplencia;
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

export interface ICreateDocumentoSuplencia {
  suplencia_id: string;
  nombre: string;
  ruta_relativa: string;
}

export interface DocumentoSuplenciaResponse {
  success: boolean;
  message: string;
  data: DocumentoSuplencia;
}

export interface DocumentosSuplenciaResponse {
  success: boolean;
  message: string;
  data: DocumentoSuplencia[];
  suplencia: {
    id: string;
    causa_ausencia: string;
    empleado_suplencias_docente_ausente_idToempleado: {
      nombre: string;
      apellido: string;
    };
  };
  total_documentos: number;
}

export interface EstadisticasSuplencia {
  total_suplencias: number;
  horas_totales_cubiertas: number;
  suplencias_por_jornada: Array<{
    jornada: string;
    total: number;
    horas: number;
  }>;
  suplencias_recientes: Suplencia[];
  empleado_filtrado?: boolean;
  sede_filtrada?: boolean;
  año_filtrado?: string;
}

export interface EstadisticasResponse {
  success: boolean;
  message: string;
  data: EstadisticasSuplencia;
}

// Respuesta de la API de Documentos (Document Handler API)
// Según PROMESA_2_SUPLENCIAS_STORAGE_API.md
export interface UploadFilesResponse {
  success: boolean;
  message: string;
  data: {
    suplencia_id: string;
    total_archivos: number;
    archivos_procesados: Array<{
      nombre_original: string;
      nombre_guardado: string;
      ruta_relativa: string;
      size: number;
      mimetype: string;
      docente_ausente: {
        empleado_id: string;
        ruta_relativa: string;
      };
      docente_reemplazo: {
        empleado_id: string;
        ruta_relativa: string;
      };
      elasticsearch_id?: string;
    }>;
    elasticsearch_indexados: number;
    timestamp: string;
  };
}
