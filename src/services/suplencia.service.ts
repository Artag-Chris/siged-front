import JwtApiService from './jwt-api.service';
import DocumentApiService from './document-api.service'; // API de Documentos (Promesa 2)
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
} from '@/types/suplencia.types';

class SuplenciaService {
  // API de Suplencias (Promesa 1 y 3)
  private readonly BASE_PATH = '/api/suplencias';
  private readonly DOCS_PATH = '/api/documentos-suplencia';
  
  // API de Documentos (Promesa 2) - DIFERENTE URL BASE
  private readonly UPLOAD_PATH = '/api/documents/upload/suplencias';

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
   * Usa la API de Documentos (Document Handler API)
   */
  async subirArchivos(
    archivos: File[],
    suplenciaId: string,
    docenteAusenteId: string,
    docenteReemplazoId: string
  ): Promise<Array<{ nombre: string; ruta: string }>> {
    try {
   
      const formData = new FormData();
      
      // Campos requeridos según PROMESA_2_SUPLENCIAS_STORAGE_API.md
      formData.append('suplencia_id', suplenciaId);
      formData.append('docente_ausente_id', docenteAusenteId);
      formData.append('docente_reemplazo_id', docenteReemplazoId);
      formData.append('tipo_documento', 'suplencias');
      
      // Agregar archivos (importante: usar 'files' en plural)
      archivos.forEach((archivo) => {
        formData.append('files', archivo);
      });


      // Llamar a la API de Documentos (Document Handler API)
      const response = await DocumentApiService.postFormData<any>(
        this.UPLOAD_PATH,
        formData
      );

      if (!response.success) {
        throw new Error(response.message || 'Error subiendo archivos');
      }
    
      // Transformar respuesta de la API de Documentos al formato esperado
      const archivosParaPromesa3 = response.data.archivos_procesados.map((archivo: any) => ({
        nombre: archivo.nombre_original,
        ruta: archivo.ruta_relativa
      }));

      return archivosParaPromesa3;
      
    } catch (error: any) {
      console.error('❌ [SUPLENCIA-SERVICE] Error en PROMESA 2 (subirArchivos):', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al subir archivos a la API de Documentos'
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
      
      // PASO 1: Crear suplencia
      const suplencia = await this.crearSuplencia(dataSuplencia);

      let documentos: DocumentoSuplencia[] = [];

      // PASO 2 y 3: Solo si hay archivos
      if (archivos && archivos.length > 0) {
        
        // Extraer IDs de los docentes de dataSuplencia
        const rutasArchivos = await this.subirArchivos(
          archivos, 
          suplencia.id,
          dataSuplencia.docente_ausente_id,
          dataSuplencia.docente_reemplazo_id
        );

        documentos = await this.registrarDocumentos(suplencia.id, rutasArchivos);
      } else {
 
      }
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
      
      const response = await JwtApiService.put<SuplenciaResponse>(
        `${this.BASE_PATH}/${id}`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error actualizando suplencia');
      }
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
      
      const response = await JwtApiService.delete<{ success: boolean }>(
        `${this.BASE_PATH}/${id}`
      );

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
