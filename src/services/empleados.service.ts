// services/empleados.service.ts
// Servicio para gestión de empleados usando la API JWT

import JwtApiService from './jwt-api.service';
import { 
  CreateEmpleadoRequest,
  UpdateEmpleadoRequest,
  Empleado,
  EmpleadoFilters,
  EmpleadosListResponse,
  EmpleadoResponse,
  CreateComentarioEmpleado,
  ComentarioEmpleado,
  ApiResponse,
  EmpleadoDocumentUpload
} from '@/types/empleados.types';

export class EmpleadosService {

  // =============== CREAR EMPLEADO ===============
  static async createEmpleado(data: CreateEmpleadoRequest): Promise<Empleado> {
    try {
      const endpoint = '/api/empleado/';
      console.log('👤 [EMPLEADOS-SERVICE] Creando empleado...');
      console.log('📤 [EMPLEADOS-SERVICE] Datos:', {
        ...data,
        comentario: data.comentario ? '[INCLUIDO]' : '[NO INCLUIDO]'
      });

      const response = await JwtApiService.post<EmpleadoResponse>(endpoint, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error creando empleado');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Empleado creado:', {
        id: response.data.id,
        nombre: `${response.data.nombre} ${response.data.apellido}`,
        cargo: response.data.cargo,
        estado: response.data.estado
      });

      return response.data;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error creando empleado:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== OBTENER EMPLEADOS ===============
  static async getEmpleados(filters: EmpleadoFilters = {}): Promise<EmpleadosListResponse> {
    try {
      // Construir query params
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const endpoint = queryString ? `api/empleado/?${queryString}` : '/api/empleado/';

      console.log('🔍 [EMPLEADOS-SERVICE] Obteniendo empleados...');
      console.log('🔧 [EMPLEADOS-SERVICE] Filtros:', filters);

      const response = await JwtApiService.get<EmpleadosListResponse>(endpoint);

      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo empleados');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Empleados obtenidos:', {
        count: response.data.length,
        pagination: response.pagination
      });

      return response;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error obteniendo empleados:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== OBTENER EMPLEADO POR ID ===============
  static async getEmpleadoById(id: string): Promise<Empleado> {
    try {
      console.log('🔍 [EMPLEADOS-SERVICE] Obteniendo empleado por ID:', id);

      const response = await JwtApiService.get<EmpleadoResponse>(`/api/empleado/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Empleado no encontrado');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Empleado obtenido:', {
        id: response.data.id,
        nombre: `${response.data.nombre} ${response.data.apellido}`,
        cargo: response.data.cargo
      });

      return response.data;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error obteniendo empleado:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== ACTUALIZAR EMPLEADO ===============
  static async updateEmpleado(id: string, data: UpdateEmpleadoRequest): Promise<Empleado> {
    try {
      console.log('🔄 [EMPLEADOS-SERVICE] Actualizando empleado:', id);

      const response = await JwtApiService.put<EmpleadoResponse>(`/api/empleado/${id}`, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error actualizando empleado');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Empleado actualizado:', response.data.id);
      return response.data;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error actualizando empleado:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== ELIMINAR EMPLEADO ===============
  static async deleteEmpleado(id: string): Promise<boolean> {
    try {
      console.log('🗑️ [EMPLEADOS-SERVICE] Eliminando empleado:', id);

      const response = await JwtApiService.delete<ApiResponse<any>>(`/api/empleado/${id}`);

      if (!response.success) {
        throw new Error(response.message || 'Error eliminando empleado');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Empleado eliminado exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error eliminando empleado:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== AGREGAR COMENTARIO ===============
  static async addComentario(data: CreateComentarioEmpleado): Promise<ComentarioEmpleado> {
    try {
      console.log('💬 [EMPLEADOS-SERVICE] Agregando comentario a empleado:', data.empleado_id);

      const response = await JwtApiService.post<ApiResponse<ComentarioEmpleado>>(
        '/api/empleado/comentarios/', 
        data
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error agregando comentario');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Comentario agregado exitosamente');
      return response.data;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error agregando comentario:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== SUBIR DOCUMENTO DE EMPLEADO ===============
  static async uploadDocument(data: EmpleadoDocumentUpload): Promise<boolean> {
    try {
      console.log('📎 [EMPLEADOS-SERVICE] Subiendo documento para empleado:', data.empleado_id);

      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('empleado_id', data.empleado_id); // UUID real del empleado
      formData.append('document_type', data.document_type);
      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await JwtApiService.post<ApiResponse<any>>(
        'api/empleado/documents/', 
        formData
      );

      if (!response.success) {
        throw new Error(response.message || 'Error subiendo documento');
      }

      console.log('✅ [EMPLEADOS-SERVICE] Documento subido exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ [EMPLEADOS-SERVICE] Error subiendo documento:', error.message);
      throw this.handleApiError(error);
    }
  }

  // =============== UTILIDADES ===============
  private static handleApiError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    return new Error('Error desconocido en el servicio de empleados');
  }
}

export default EmpleadosService;