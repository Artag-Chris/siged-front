// services/horas-extra.service.ts
import JwtApiService from './jwt-api.service';
import DocumentApiService from './document-api.service';
import {
  ICreateHoraExtra,
  IUpdateHoraExtra,
  HoraExtra,
  HorasExtraFilters,
  HorasExtraListResponse,
  HoraExtraResponse,
  JornadasResponse,
  JornadaInfo,
  ICreateDocumentoHoraExtra,
  DocumentoHoraExtra,
  DocumentoHoraExtraResponse,
  DocumentosHorasExtraListResponse,
  DocumentosHorasExtraFilters,
  UploadFilesResponse,
} from '@/types/horas-extra.types';

class HorasExtraService {
  // API de Horas Extra (Promesas 1 y 3)
  private readonly BASE_PATH = '/api/horas-extra';
  private readonly DOCS_PATH = '/api/documentos-horas-extra';
  
  // API de Documentos (Promesa 2) - DIFERENTE URL BASE
  private readonly UPLOAD_PATH = '/api/documents/upload/horas-extra';

  /**
   * PROMESA 1: Crear Registro de Horas Extra
   */
  async crearHoraExtra(data: ICreateHoraExtra): Promise<HoraExtra> {
    try {
      console.log('📝 [HORAS-EXTRA-SERVICE] Creando registro de horas extra:', data);
      
      const response = await JwtApiService.post<HoraExtraResponse>(
        this.BASE_PATH,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error creando registro de horas extra');
      }

      console.log('✅ [HORAS-EXTRA-SERVICE] Registro creado:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en crearHoraExtra:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al crear el registro de horas extra'
      );
    }
  }

  /**
   * PROMESA 2: Subir Archivos (OPCIONAL)
   * Usa la API de Documentos (Document Handler API)
   * 
   * Según documentación: PROMESA_2_HORAS_EXTRA_STORAGE_API.md
   * - Endpoint: POST /api/documents/upload/horas-extra
   * - FormData con: horas_extra_id, empleado_id, sede_id, tipo_documento, files[]
   * - Response: { success, message, data: { archivos_procesados[] } }
   */
  async subirArchivos(
    archivos: File[],
    horasExtraId: string,
    empleadoId: string,
    sedeId: string
  ): Promise<Array<{ nombre: string; ruta: string }>> {
    try {
      console.log(`📤 [HORAS-EXTRA-SERVICE] PROMESA 2: Subiendo ${archivos.length} archivos a Document API`);
      console.log(`   URL: ${DocumentApiService.getBaseUrl()}${this.UPLOAD_PATH}`);

      const formData = new FormData();
      
      // ✅ Campos requeridos según la API de Documentos (ver documentación)
      formData.append('horas_extra_id', horasExtraId);
      formData.append('empleado_id', empleadoId);
      formData.append('sede_id', sedeId);
      formData.append('tipo_documento', 'horas_extra');
      
      // ✅ Agregar archivos con el nombre 'files' (plural) - CRÍTICO
      archivos.forEach((archivo, index) => {
        formData.append('files', archivo);
        console.log(`   📎 Archivo ${index + 1}: ${archivo.name} (${archivo.size} bytes, ${archivo.type})`);
      });

      console.log('📋 [HORAS-EXTRA-SERVICE] FormData configurado:', {
        horas_extra_id: horasExtraId,
        empleado_id: empleadoId,
        sede_id: sedeId,
        tipo_documento: 'horas_extra',
        total_archivos: archivos.length
      });

      // Llamar a la API de Documentos
      const response = await DocumentApiService.postFormData<UploadFilesResponse>(
        this.UPLOAD_PATH,
        formData
      );

      // Validar respuesta según documentación
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error subiendo archivos: respuesta inválida');
      }

      console.log('✅ [HORAS-EXTRA-SERVICE] PROMESA 2 completada exitosamente');
      console.log(`   Total procesados: ${response.data.total_archivos}`);
      console.log(`   Indexados en Elasticsearch: ${response.data.elasticsearch_indexados}`);
      
      // ✅ Transformar respuesta según formato de la API de Documentos
      // Response.data.archivos_procesados[] tiene: nombre_original, ruta_relativa
      const archivosParaPromesa3 = response.data.archivos_procesados.map((archivo) => {
        console.log(`   ✓ ${archivo.nombre_original} → ${archivo.ruta_relativa}`);
        return {
          nombre: archivo.nombre_original,
          ruta: archivo.ruta_relativa
        };
      });

      console.log('📦 [HORAS-EXTRA-SERVICE] Datos preparados para Promesa 3:', archivosParaPromesa3.length);
      return archivosParaPromesa3;
      
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en PROMESA 2 (subirArchivos):', error);
      
      // Mensajes específicos según el error
      let errorMessage = 'Error al subir archivos a la API de Documentos';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 
                      'Error 400: Verifica que los campos requeridos estén presentes (horas_extra_id, empleado_id, sede_id, files)';
      } else if (error.response?.status === 401) {
        errorMessage = 'Error de autenticación. Token JWT inválido o expirado';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor de documentos';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * PROMESA 3: Registrar Documentos en BD (OPCIONAL)
   */
  async registrarDocumentos(
    horasExtraId: string,
    archivos: Array<{ nombre: string; ruta: string }>
  ): Promise<DocumentoHoraExtra[]> {
    try {
      console.log(`📋 [HORAS-EXTRA-SERVICE] Registrando ${archivos.length} documentos`);

      const documentosCreados = await Promise.all(
        archivos.map(async (archivo) => {
          const docData: ICreateDocumentoHoraExtra = {
            horas_extra_id: horasExtraId,
            nombre: archivo.nombre,
            ruta_relativa: archivo.ruta,
          };

          const response = await JwtApiService.post<DocumentoHoraExtraResponse>(
            this.DOCS_PATH,
            docData
          );

          if (!response.success) {
            throw new Error(`Error registrando documento: ${archivo.nombre}`);
          }

          return response.data;
        })
      );

      console.log('✅ [HORAS-EXTRA-SERVICE] Documentos registrados:', documentosCreados.length);
      return documentosCreados;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en registrarDocumentos:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al registrar documentos'
      );
    }
  }

  /**
   * FLUJO COMPLETO: 3 Promesas Encadenadas (Documentos opcionales)
   */
  async crearHoraExtraCompleta(
    dataHoraExtra: ICreateHoraExtra,
    archivos: File[]
  ): Promise<{
    success: boolean;
    horaExtra: HoraExtra;
    documentos: DocumentoHoraExtra[];
  }> {
    try {
      console.log('\n🚀 [HORAS-EXTRA-SERVICE] Iniciando flujo completo de creación...');

      // PASO 1: Crear registro de horas extra
      console.log('📝 Paso 1/3: Creando registro de horas extra...');
      const horaExtra = await this.crearHoraExtra(dataHoraExtra);

      let documentos: DocumentoHoraExtra[] = [];

      // PASO 2 y 3: Solo si hay archivos (OPCIONAL)
      if (archivos && archivos.length > 0) {
        console.log('📤 Paso 2/3: Subiendo archivos a Document API...');
        
        const rutasArchivos = await this.subirArchivos(
          archivos, 
          horaExtra.id,
          dataHoraExtra.empleado_id,
          dataHoraExtra.sede_id
        );

        console.log('📋 Paso 3/3: Registrando documentos en BD...');
        documentos = await this.registrarDocumentos(horaExtra.id, rutasArchivos);
      } else {
        console.log('ℹ️ No hay archivos para subir (OPCIONAL)');
      }

      console.log('✅ [HORAS-EXTRA-SERVICE] Flujo completo exitoso');
      console.log(`   - Hora Extra ID: ${horaExtra.id}`);
      console.log(`   - Documentos: ${documentos.length}`);

      return {
        success: true,
        horaExtra,
        documentos,
      };
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en flujo completo:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de registros de horas extra con filtros
   */
  async getHorasExtra(filters: HorasExtraFilters = {}): Promise<HorasExtraListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const query = queryParams.toString();
      const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

      console.log('🔍 [HORAS-EXTRA-SERVICE] Obteniendo registros:', url);
      const response = await JwtApiService.get<HorasExtraListResponse>(url);

      return response;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en getHorasExtra:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener registros de horas extra'
      );
    }
  }

  /**
   * Obtener registro por ID
   */
  async getHoraExtraById(id: string): Promise<HoraExtra> {
    try {
      console.log('🔍 [HORAS-EXTRA-SERVICE] Obteniendo registro:', id);
      
      const response = await JwtApiService.get<HoraExtraResponse>(
        `${this.BASE_PATH}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Registro no encontrado');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en getHoraExtraById:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener el registro'
      );
    }
  }

  /**
   * Actualizar registro de horas extra
   */
  async updateHoraExtra(
    id: string,
    data: IUpdateHoraExtra
  ): Promise<HoraExtra> {
    try {
      console.log('✏️ [HORAS-EXTRA-SERVICE] Actualizando registro:', id);
      
      const response = await JwtApiService.put<HoraExtraResponse>(
        `${this.BASE_PATH}/${id}`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error actualizando registro');
      }

      console.log('✅ [HORAS-EXTRA-SERVICE] Registro actualizado');
      return response.data;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en updateHoraExtra:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al actualizar el registro'
      );
    }
  }

  /**
   * Eliminar registro de horas extra (solo super_admin)
   */
  async deleteHoraExtra(id: string): Promise<boolean> {
    try {
      console.log('🗑️ [HORAS-EXTRA-SERVICE] Eliminando registro:', id);
      
      const response = await JwtApiService.delete<{ success: boolean }>(
        `${this.BASE_PATH}/${id}`
      );

      console.log('✅ [HORAS-EXTRA-SERVICE] Registro eliminado');
      return response.success;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en deleteHoraExtra:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al eliminar el registro'
      );
    }
  }

  /**
   * Obtener jornadas disponibles
   */
  async getJornadas(): Promise<JornadaInfo[]> {
    // Retornar jornadas hardcodeadas según la documentación
    return [
      { valor: 'ma_ana', descripcion: 'Mañana', ejemplo: '6:00 AM - 12:00 PM' },
      { valor: 'tarde', descripcion: 'Tarde', ejemplo: '12:00 PM - 6:00 PM' },
      { valor: 'sabatina', descripcion: 'Sabatina', ejemplo: 'Sábado' },
      { valor: 'nocturna', descripcion: 'Nocturna', ejemplo: '6:00 PM - 12:00 AM' },
    ];
  }

  /**
   * Obtener documentos por registro de horas extra
   */
  async getDocumentosByHoraExtra(horasExtraId: string): Promise<DocumentosHorasExtraListResponse> {
    try {
      console.log('📄 [HORAS-EXTRA-SERVICE] Obteniendo documentos de registro:', horasExtraId);
      
      const response = await JwtApiService.get<DocumentosHorasExtraListResponse>(
        `${this.DOCS_PATH}/horas-extra/${horasExtraId}`
      );

      return response;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en getDocumentosByHoraExtra:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener documentos'
      );
    }
  }

  /**
   * Descargar documento
   */
  async descargarDocumento(documentoId: string): Promise<Blob> {
    try {
      console.log('📥 [HORAS-EXTRA-SERVICE] Descargando documento:', documentoId);
      
      const response = await JwtApiService.get<Blob>(
        `${this.DOCS_PATH}/${documentoId}/download`,
        { responseType: 'blob' as any }
      );

      return response as any;
    } catch (error: any) {
      console.error('❌ [HORAS-EXTRA-SERVICE] Error en descargarDocumento:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al descargar documento'
      );
    }
  }
}

// Exportar instancia única
const horasExtraService = new HorasExtraService();
export default horasExtraService;
