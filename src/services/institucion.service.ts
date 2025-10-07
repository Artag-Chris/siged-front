// services/institucion.service.ts
import JwtApiService from './jwt-api.service';
import { InstitucionEducativa, InstitucionesResponse, InstitucionesFilters } from '@/types/institucion.types';

class InstitucionService {
  private readonly BASE_PATH = '/api/instituciones';

  /**
   * Obtener todas las instituciones educativas
   */
  async getInstituciones(filters: InstitucionesFilters = {}): Promise<InstitucionesResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

      const response = await JwtApiService.get<InstitucionesResponse>(url);

      if (!response.success) {
        throw new Error(response.message || 'Error al obtener instituciones');
      }

      console.log('✅ [INSTITUCION-SERVICE] Instituciones obtenidas:', response.data.length);
      return response;
    } catch (error: any) {
      console.error('❌ [INSTITUCION-SERVICE] Error al obtener instituciones:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener instituciones educativas'
      );
    }
  }

  /**
   * Obtener una institución por ID
   */
  async getInstitucionById(id: string): Promise<InstitucionEducativa> {
    try {
      const response = await JwtApiService.get<{ success: boolean; data: InstitucionEducativa }>(
        `${this.BASE_PATH}/${id}`
      );

      if (!response.success) {
        throw new Error('Error al obtener institución');
      }

      console.log('✅ [INSTITUCION-SERVICE] Institución obtenida:', response.data.nombre);
      return response.data;
    } catch (error: any) {
      console.error('❌ [INSTITUCION-SERVICE] Error al obtener institución:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener institución educativa'
      );
    }
  }
}

export default new InstitucionService();
