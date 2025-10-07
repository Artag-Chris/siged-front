// types/sede.types.ts
// Tipos para Sedes

export interface Sede {
  id: string;
  nombre: string;
  estado: 'activa' | 'inactiva';
  zona: 'urbana' | 'rural';
  direccion: string;
  codigo_DANE: string;
  created_at: string;
  updated_at: string;
  asignacion_empleado?: AsignacionEmpleado[];
  sede_ie?: SedeInstitucion[];
}

export interface AsignacionEmpleado {
  id: string;
  empleado_id: string;
  sede_id: string;
  fecha_asignacion: string;
  fecha_fin: string | null;
  estado: 'activa' | 'inactiva';
  created_at: string;
  empleado?: {
    id: string;
    tipo_documento: string;
    documento: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    cargo: string;
    estado: string;
    created_at: string;
    updated_at: string;
  };
}

export interface SedeInstitucion {
  id: string;
  sede_id: string;
  institucion_educativa_id: string;
  created_at: string;
  institucion_educativa?: {
    id: string;
    nombre: string;
    rector_encargado_id: string;
    created_at: string;
    updated_at: string;
  };
}

export interface SedesResponse {
  success: boolean;
  message: string;
  data: Sede[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
