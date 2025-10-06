// types/auth.types.ts
// Tipos para la API JWT SIGED

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  ok: boolean;
  data: {
    usuario: {
      id: string;
      nombre: string;
      email: string;
      rol: 'super_admin' | 'admin' | 'gestor';
    };
    token: string;
    refreshToken: string;
  };
  msg?: string;
}

export interface User {
  id: string;
  tipo_documento: string;
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  rol: 'super_admin' | 'admin' | 'gestor';
  estado: 'activo' | 'inactivo';
  fecha_creacion: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  msg?: string;
  error?: string;
  message?: string;
}

export interface CreateUserRequest {
  tipo_documento: 'CC' | 'CE' | 'TI' | 'PP';
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  contrasena: string;
  rol?: 'super_admin' | 'admin' | 'gestor';
  estado?: 'activo' | 'inactivo';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  contrasenaActual: string;
  contrasenaNueva: string;
}

export interface UpdateUserRequest {
  tipo_documento?: 'CC' | 'CE' | 'TI' | 'PP';
  documento?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  celular?: string;
  rol?: 'super_admin' | 'admin' | 'gestor';
  estado?: 'activo' | 'inactivo';
  contrasena?: string; // Opcional para cambiar contraseña
}

// Para listas de usuarios con filtros
export interface UserFilters {
  tipo_documento?: string;
  documento?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: 'super_admin' | 'admin' | 'gestor';
  estado?: 'activo' | 'inactivo';
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Tipos para validaciones
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Constantes de roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  GESTOR: 'gestor'
} as const;

export const USER_STATES = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo'
} as const;

export const DOCUMENT_TYPES = {
  CC: 'CC',
  CE: 'CE', 
  TI: 'TI',
  PP: 'PP'
} as const;