// types/empleados.types.ts
// Tipos para el módulo de empleados/profesores con API real

export interface Empleado {
  id: string;
  tipo_documento: 'CC' | 'CE' | 'PA' | 'TI' | 'RC' | 'NIT';
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  cargo: 'Docente' | 'Rector';
  estado: 'activo' | 'inactivo' | 'suspendido';
  created_at: string;
  updated_at: string;
}

export interface CreateEmpleadoRequest {
  tipo_documento: 'CC' | 'CE' | 'PA' | 'TI' | 'RC' | 'NIT';
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  cargo: 'Docente' | 'Rector';
  estado: 'activo' | 'inactivo' | 'suspendido';
  comentario?: string;
}

export interface UpdateEmpleadoRequest extends Partial<CreateEmpleadoRequest> {}

// Tipos para crear profesor con sede (nueva arquitectura)
export interface CreateProfesorConSedeRequest {
  empleado: {
    tipo_documento: 'CC' | 'CE' | 'PA' | 'TI' | 'RC' | 'NIT';
    documento: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    cargo: 'Docente';
  };
  informacionAcademica: {
    nivel_academico: 'bachiller' | 'tecnico' | 'tecnologo' | 'licenciado' | 'profesional' | 'especialista' | 'magister' | 'doctorado';
    anos_experiencia: number;
    institucion: string;
    titulo: string;
  };
  sedeId: string;
  fechaAsignacion: string;
  observaciones?: string;
}

export interface CreateProfesorConSedeResponse {
  success: boolean;
  message: string;
  data: {
    empleado: Empleado;
    informacionAcademica: {
      id: string;
      nivel_academico: string;
      anos_experiencia: number;
      institucion: string;
      titulo: string;
    };
    asignacion: {
      id: string;
      sede_id: string;
      fecha_asignacion: string;
      observaciones?: string;
    };
  };
}

export interface ComentarioEmpleado {
  id: string;
  observacion: string;
  empleado_id: string;
  usuario_id: string;
  created_at: string;
}

export interface CreateComentarioEmpleado {
  observacion: string;
  empleado_id: string;
  usuario_id: string;
}

export interface EmpleadoFilters {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  tipo_documento?: string;
  documento?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  cargo?: 'Docente' | 'Rector';
  estado?: 'activo' | 'inactivo' | 'suspendido';
  sede_id?: string;
}

export interface EmpleadosListResponse {
  success: boolean;
  message: string;
  data: Empleado[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface EmpleadoResponse {
  success: boolean;
  message: string;
  data: Empleado;
  comentarioEmpleado?: ComentarioEmpleado;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos para el envío de documentos de empleados
export interface EmpleadoDocumentUpload {
  empleado_id: string; // UUID real del empleado
  file: File;
  document_type: string;
  description?: string;
}

// Estados para la store
export interface EmpleadosState {
  empleados: Empleado[];
  selectedEmpleado: Empleado | null;
  isLoading: boolean;
  error: string | null;
  filters: EmpleadoFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Acciones para la store
export interface EmpleadosActions {
  // CRUD básico
  getEmpleados: (filters?: EmpleadoFilters) => Promise<void>;
  getEmpleadoById: (id: string) => Promise<Empleado | null>;
  createEmpleado: (data: CreateEmpleadoRequest) => Promise<Empleado | null>;
  updateEmpleado: (id: string, data: UpdateEmpleadoRequest) => Promise<Empleado | null>;
  deleteEmpleado: (id: string) => Promise<boolean>;

  // Comentarios
  addComentario: (data: CreateComentarioEmpleado) => Promise<ComentarioEmpleado | null>;

  // Documentos
  uploadDocument: (data: EmpleadoDocumentUpload) => Promise<boolean>;

  // Estado local
  setSelectedEmpleado: (empleado: Empleado | null) => void;
  setFilters: (filters: Partial<EmpleadoFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export type EmpleadosStore = EmpleadosState & EmpleadosActions;