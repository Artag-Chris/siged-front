// types/rector.types.ts

/**
 * TIPOS PARA EL MÓDULO DE RECTORES
 * Sistema completo de gestión de rectores con instituciones y sedes
 */

// ============================================================================
// ENTIDADES PRINCIPALES
// ============================================================================

export interface Rector {
  id: string;
  tipo_documento: 'CC' | 'CE' | 'TI' | 'PEP' | 'PPT';
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  fecha_nacimiento?: string | null;
  genero?: 'Masculino' | 'Femenino' | 'Otro' | null;
  estado_civil?: 'Soltero' | 'Casado' | 'Divorciado' | 'Viudo' | 'Unión libre' | null;
  direccion?: string | null;
  ciudad?: string | null;
  departamento?: string | null;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at?: string;
}

export interface InformacionAcademica {
  id: string;
  empleado_id: string;
  nivel_educativo: 'Bachiller' | 'Técnico' | 'Tecnólogo' | 'Profesional' | 'Especialización' | 'Maestría' | 'Doctorado';
  titulo: string;
  institucion_educativa?: string | null;
  fecha_graduacion?: string | null;
  anos_experiencia?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface InstitucionEducativa {
  id: string;
  nombre: string;
  rector_encargado_id: string;
  created_at: string;
  updated_at: string;
}

export interface Sede {
  id: string;
  nombre: string;
  zona: 'urbana' | 'rural';
  direccion: string;
  codigo_DANE?: string | null;
  estado: 'activa' | 'inactiva';
  created_at: string;
  updated_at?: string;
}

export interface AsignacionSede {
  id: string;
  empleado_id: string;
  sede_id: string;
  fecha_asignacion: string;
  fecha_fin?: string | null;
  estado: 'activa' | 'inactiva';
  created_at: string;
}

// ============================================================================
// DTOs PARA CREAR RECTOR COMPLETO
// ============================================================================

export interface ICreateRectorCompletoRequest {
  empleado: {
    tipo_documento: 'CC' | 'CE' | 'TI' | 'PEP' | 'PPT';
    documento: string;
    nombre: string;
    apellido: string;
    email: string;
    cargo: 'Rector';
    direccion?: string;
  };
  informacionAcademica?: {
    nivel_academico: 'bachiller' | 'tecnico' | 'tecnologo' | 'profesional' | 'especializacion' | 'magister' | 'doctorado';
    titulo: string;
    institucion: string;
    anos_experiencia: number;
  };
  institucion: {
    nombre: string;
  };
  sedes: {
    crear?: Array<{
      nombre: string;
      zona: 'urbana' | 'rural';
      direccion: string;
      codigo_DANE?: string;
      jornadas?: string[];
    }>;
    asignar_existentes?: string[];
  };
  fechaAsignacion?: string;
  observaciones?: string;
}

export interface ICreateRectorCompletoResponse {
  success: boolean;
  message: string;
  data: {
    rector: Rector;
    informacionAcademica?: InformacionAcademica;
    institucion: InstitucionEducativa;
    sedes: Sede[];
    asignaciones: AsignacionSede[];
    jornadaAsignaciones?: Array<{
      sede_id: string;
      jornada_id: number;
      jornada_nombre: string;
    }>;
    resumen: {
      sedesCreadas: number;
      sedesAsignadas: number;
      asignacionesRealizadas: number;
      jornadasAsignadas?: number;
    };
  };
}

// ============================================================================
// VALIDACIÓN DE FLUJO
// ============================================================================

export interface IValidarFlujoRequest {
  documento: string;
  email?: string;
}

export interface IValidarFlujoResponse {
  success: boolean;
  message: string;
  data: {
    documentoDisponible: boolean;
    emailDisponible: boolean;
    puedeCrearFlujo: boolean;
    conflictos: Array<{
      tipo: 'documento' | 'email';
      mensaje: string;
      empleado?: {
        id: string;
        nombre: string;
        cargo: string;
      };
    }>;
  };
}

// ============================================================================
// RESUMEN DE RECTOR
// ============================================================================

export interface IRectorResumen {
  rector: Rector & {
    informacionAcademica?: InformacionAcademica;
  };
  institucion: InstitucionEducativa & {
    sedes?: Sede[];
  };
  sedes: Array<
    Sede & {
      jornadas?: Array<{
        id: number;
        nombre: string;
      }>;
    }
  >;
  estadisticas: {
    totalSedes: number;
    totalAsignaciones: number;
    jornadasCubiertas: number;
  };
}

// ============================================================================
// LISTADO Y FILTROS
// ============================================================================

export interface RectoresFilters {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'activo' | 'inactivo';
  institucion_id?: string;
}

export interface RectoresListResponse {
  success: boolean;
  message: string;
  data: Array<
    Rector & {
      institucion?: InstitucionEducativa;
      informacionAcademica?: InformacionAcademica;
      _count?: {
        asignaciones: number;
      };
    }
  >;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ============================================================================
// INSTITUCIONES DISPONIBLES
// ============================================================================

export interface InstitucionDisponible {
  id: string;
  nombre: string;
  rector_encargado_id: string | null;
  sedes: Sede[];
  _count: {
    sedes: number;
  };
}

export interface InstitucionesDisponiblesResponse {
  success: boolean;
  message: string;
  data: InstitucionDisponible[];
  metadata: {
    total: number;
    filters: {
      sinRector: boolean;
      conSedes: boolean;
    };
  };
}

// ============================================================================
// ASIGNACIÓN Y TRANSFERENCIA
// ============================================================================

export interface IAsignarRectorRequest {
  institucionId: string;
  asignarTodasLasSedes: boolean;
  sedesEspecificas?: string[];
}

export interface ITransferirRectorRequest {
  nuevaInstitucionId: string;
  mantenerSedesOriginales: boolean;
}

// ============================================================================
// JORNADAS
// ============================================================================

export interface Jornada {
  id: number;
  nombre: 'Mañana' | 'Tarde' | 'Sabatina' | 'Nocturna';
  descripcion: string;
}

export const JORNADAS_DISPONIBLES: Jornada[] = [
  { id: 1, nombre: 'Mañana', descripcion: '7:00 AM - 12:00 PM' },
  { id: 2, nombre: 'Tarde', descripcion: '12:00 PM - 6:00 PM' },
  { id: 3, nombre: 'Sabatina', descripcion: 'Sábados 7:00 AM - 12:00 PM' },
  { id: 4, nombre: 'Nocturna', descripcion: '6:00 PM - 10:00 PM' },
];
