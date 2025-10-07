// services/sede.service.ts
import JwtApiService from './jwt-api.service';
import { SedesResponse } from '@/types/sede.types';

class SedeService {
  private readonly BASE_PATH = '/api/sede';

  /**
   * Obtener todas las sedes
   */
  async getSedes(params?: { 
    page?: number; 
    limit?: number;
    estado?: 'activa' | 'inactiva';
    zona?: 'urbana' | 'rural';
  }): Promise<SedesResponse> {
    try {
      console.log('🏫 [SEDE-SERVICE] Obteniendo sedes');
      
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.zona) queryParams.append('zona', params.zona);

      const query = queryParams.toString();
      const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

      const response = await JwtApiService.get<SedesResponse>(url);

      if (!response.success) {
        throw new Error(response.message || 'Error al obtener sedes');
      }

      console.log('✅ [SEDE-SERVICE] Sedes obtenidas:', response.data.length);
      return response;
    } catch (error: any) {
      console.error('❌ [SEDE-SERVICE] Error en getSedes:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener las sedes'
      );
    }
  }

  /**
   * Obtener sede por ID
   */
  async getSedeById(id: string): Promise<SedesResponse['data'][0]> {
    try {
      console.log('🏫 [SEDE-SERVICE] Obteniendo sede:', id);
      
      const response = await JwtApiService.get<{
        success: boolean;
        message: string;
        data: SedesResponse['data'][0];
      }>(`${this.BASE_PATH}/${id}`);

      if (!response.success) {
        throw new Error(response.message || 'Sede no encontrada');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ [SEDE-SERVICE] Error en getSedeById:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener la sede'
      );
    }
  }
}

// Exportar instancia única
const sedeService = new SedeService();
export default sedeService;
