// types/institucion.types.ts
// Tipos para Instituciones Educativas

export interface InstitucionEducativa {
  id: string;
  nombre: string;
  rector_encargado_id: string;
  created_at: string;
  updated_at: string;
  empleado?: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    cargo: string;
  };
  sede_ie?: Array<{
    id: string;
    sede_id: string;
    institucion_educativa_id: string;
    created_at: string;
    sede: {
      id: string;
      nombre: string;
      direccion: string;
      zona: string;
    };
  }>;
}

export interface InstitucionesResponse {
  success: boolean;
  message: string;
  data: InstitucionEducativa[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface InstitucionesFilters {
  page?: number;
  limit?: number;
  search?: string;
}
