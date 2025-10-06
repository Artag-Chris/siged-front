import JwtApiService from './jwt-api.service';
import {
  ICreateSuplencia,
  IUpdateSuplencia,
  Suplencia,
  SuplenciaFilters,
  SuplenciasListResponse,
  SuplenciaResponse,
  JornadasResponse,
  ICreateDocumentoSuplencia,
  DocumentoSuplencia,
  DocumentoSuplenciaResponse,
  DocumentosSuplenciaResponse,
  EstadisticasResponse,
  UploadFilesResponse,
} from '@/types/suplencia.types';

class SuplenciaService {
  private readonly BASE_PATH = '/api/suplencias';
  private readonly DOCS_PATH = '/documentos-suplencia';

  /**
   * PROMESA 1: Crear Suplencia
   */
  async crearSuplencia(data: ICreateSuplencia): Promise<Suplencia> {
    try {
      console.log('📝 [SUPLENCIA-SERVICE] Creando suplencia:', data);
      
      const response = await JwtApiService.post<SuplenciaResponse>(
        this.BASE_PATH,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error creando suplencia');
      }

      console.log('✅ [SUPLENCIA-SERVICE] Suplencia creada:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en crearSuplencia:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al crear la suplencia'
      );
    }
  }

  /**
   * PROMESA 2: Subir Archivos
   */
  async subirArchivos(
    archivos: File[],
    suplenciaId: string
  ): Promise<Array<{ nombre: string; ruta: string }>> {
    try {
      console.log(`📤 [SUPLENCIA-SERVICE] Subiendo ${archivos.length} archivos`);

      const formData = new FormData();
      archivos.forEach((archivo) => {
        formData.append('files', archivo);
      });
      formData.append('suplencia_id', suplenciaId);

      // Usar el endpoint de upload específico
      const response = await JwtApiService.postFormData<UploadFilesResponse>(
        '/upload/suplencias',
        formData
      );

      if (!response.success) {
        throw new Error(response.message || 'Error subiendo archivos');
      }

      console.log('✅ [SUPLENCIA-SERVICE] Archivos subidos:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en subirArchivos:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al subir archivos'
      );
    }
  }

  /**
   * PROMESA 3: Registrar Documentos en BD
   */
  async registrarDocumentos(
    suplenciaId: string,
    archivos: Array<{ nombre: string; ruta: string }>
  ): Promise<DocumentoSuplencia[]> {
    try {
      console.log(`📋 [SUPLENCIA-SERVICE] Registrando ${archivos.length} documentos`);

      const documentosCreados = await Promise.all(
        archivos.map(async (archivo) => {
          const docData: ICreateDocumentoSuplencia = {
            suplencia_id: suplenciaId,
            nombre: archivo.nombre,
            ruta_relativa: archivo.ruta,
          };

          const response = await JwtApiService.post<DocumentoSuplenciaResponse>(
            this.DOCS_PATH,
            docData
          );

          if (!response.success) {
            throw new Error(`Error registrando documento: ${archivo.nombre}`);
          }

          return response.data;
        })
      );

      console.log('✅ [SUPLENCIA-SERVICE] Documentos registrados:', documentosCreados.length);
      return documentosCreados;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en registrarDocumentos:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al registrar documentos'
      );
    }
  }

  /**
   * FLUJO COMPLETO: 3 Promesas Encadenadas
   */
  async crearSuplenciaCompleta(
    dataSuplencia: ICreateSuplencia,
    archivos: File[]
  ): Promise<{
    success: boolean;
    suplencia: Suplencia;
    documentos: DocumentoSuplencia[];
  }> {
    try {
      console.log('\n🚀 [SUPLENCIA-SERVICE] Iniciando flujo completo de creación...');

      // PASO 1: Crear suplencia
      console.log('📝 Paso 1/3: Creando suplencia...');
      const suplencia = await this.crearSuplencia(dataSuplencia);

      let documentos: DocumentoSuplencia[] = [];

      // PASO 2 y 3: Solo si hay archivos
      if (archivos && archivos.length > 0) {
        console.log('📤 Paso 2/3: Subiendo archivos...');
        const rutasArchivos = await this.subirArchivos(archivos, suplencia.id);

        console.log('📋 Paso 3/3: Registrando documentos...');
        documentos = await this.registrarDocumentos(suplencia.id, rutasArchivos);
      } else {
        console.log('ℹ️ No hay archivos para subir');
      }

      console.log('✅ [SUPLENCIA-SERVICE] Flujo completo exitoso');
      console.log(`   - Suplencia ID: ${suplencia.id}`);
      console.log(`   - Documentos: ${documentos.length}`);

      return {
        success: true,
        suplencia,
        documentos,
      };
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en flujo completo:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de suplencias con filtros y paginación
   */
  async getSuplencias(filters: SuplenciaFilters = {}): Promise<SuplenciasListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const query = queryParams.toString();
      const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

      console.log('🔍 [SUPLENCIA-SERVICE] Obteniendo suplencias:', url);
      const response = await JwtApiService.get<SuplenciasListResponse>(url);

      return response;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en getSuplencias:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener suplencias'
      );
    }
  }

  /**
   * Obtener suplencia por ID
   */
  async getSuplenciaById(id: string): Promise<Suplencia> {
    try {
      console.log('🔍 [SUPLENCIA-SERVICE] Obteniendo suplencia:', id);
      
      const response = await JwtApiService.get<SuplenciaResponse>(
        `${this.BASE_PATH}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Suplencia no encontrada');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en getSuplenciaById:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener la suplencia'
      );
    }
  }

  /**
   * Actualizar suplencia
   */
  async updateSuplencia(
    id: string,
    data: IUpdateSuplencia
  ): Promise<Suplencia> {
    try {
      console.log('✏️ [SUPLENCIA-SERVICE] Actualizando suplencia:', id);
      
      const response = await JwtApiService.put<SuplenciaResponse>(
        `${this.BASE_PATH}/${id}`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error actualizando suplencia');
      }

      console.log('✅ [SUPLENCIA-SERVICE] Suplencia actualizada');
      return response.data;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en updateSuplencia:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al actualizar la suplencia'
      );
    }
  }

  /**
   * Eliminar suplencia (solo super_admin)
   */
  async deleteSuplencia(id: string): Promise<boolean> {
    try {
      console.log('🗑️ [SUPLENCIA-SERVICE] Eliminando suplencia:', id);
      
      const response = await JwtApiService.delete<{ success: boolean }>(
        `${this.BASE_PATH}/${id}`
      );

      console.log('✅ [SUPLENCIA-SERVICE] Suplencia eliminada');
      return response.success;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en deleteSuplencia:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al eliminar la suplencia'
      );
    }
  }

  /**
   * Obtener jornadas disponibles
   */
  async getJornadas(): Promise<JornadasResponse> {
    try {
      console.log('📅 [SUPLENCIA-SERVICE] Obteniendo jornadas disponibles');
      
      const response = await JwtApiService.get<JornadasResponse>(
        `${this.BASE_PATH}/jornadas`
      );

      return response;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en getJornadas:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener jornadas'
      );
    }
  }

  /**
   * Obtener documentos de una suplencia
   */
  async getDocumentosBySuplencia(suplenciaId: string): Promise<DocumentosSuplenciaResponse> {
    try {
      console.log('📄 [SUPLENCIA-SERVICE] Obteniendo documentos de suplencia:', suplenciaId);
      
      const response = await JwtApiService.get<DocumentosSuplenciaResponse>(
        `${this.DOCS_PATH}/suplencia/${suplenciaId}`
      );

      return response;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en getDocumentosBySuplencia:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener documentos'
      );
    }
  }

  /**
   * Obtener estadísticas
   */
  async getEstadisticas(params: {
    empleado_id?: string;
    sede_id?: string;
    año?: number;
  } = {}): Promise<EstadisticasResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.empleado_id) queryParams.append('empleado_id', params.empleado_id);
      if (params.sede_id) queryParams.append('sede_id', params.sede_id);
      if (params.año) queryParams.append('año', String(params.año));

      const query = queryParams.toString();
      const url = query 
        ? `${this.BASE_PATH}/estadisticas?${query}` 
        : `${this.BASE_PATH}/estadisticas`;

      console.log('📊 [SUPLENCIA-SERVICE] Obteniendo estadísticas:', url);
      const response = await JwtApiService.get<EstadisticasResponse>(url);

      return response;
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en getEstadisticas:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener estadísticas'
      );
    }
  }
}

// Exportar instancia única
const suplenciaService = new SuplenciaService();
export default suplenciaService;
