// services/actos-administrativos.service.ts
import JwtApiService from './jwt-api.service';
import DocumentApiService from './document-api.service';
import {
  ICreateActoAdministrativo,
  IUpdateActoAdministrativo,
  ActoAdministrativo,
  ActosAdministrativosFilters,
  ActosAdministrativosListResponse,
  ActoAdministrativoResponse,
  ICreateDocumentoActoAdministrativo,
  DocumentoActoAdministrativo,
  DocumentoActoAdministrativoResponse,
  DocumentosActosAdministrativosListResponse,
  DocumentosActosAdministrativosFilters,
  UploadFilesResponse,
  CrearActoAdministrativoCompletoResult,
} from '@/types/actos-administrativos.types';

class ActosAdministrativosService {
  // API de Actos Administrativos (Promesas 1 y 3)
  private readonly BASE_PATH = '/api/actos-administrativos';
  private readonly DOCS_PATH = '/api/documentos-actos-administrativos';
  
  // API de Documentos (Promesa 2) - DIFERENTE URL BASE
  private readonly UPLOAD_PATH = '/api/documents/upload/actos-administrativos';

  /**
   * ============================================================================
   * PROMESA 1: Crear Acto Administrativo
   * ============================================================================
   * 
   * El nombre se genera automáticamente en el backend con el formato:
   * "Resolución I.E [Nombre Institución]-[Consecutivo]"
   * 
   * Ejemplo: "Resolución I.E Jaime Salazar-0001"
   */
  async crearActoAdministrativo(data: ICreateActoAdministrativo): Promise<ActoAdministrativo> {
    try {
      console.log('📝 [ACTOS-ADMIN-SERVICE] PROMESA 1: Creando acto administrativo:', data);
      
      const response = await JwtApiService.post<ActoAdministrativoResponse>(
        this.BASE_PATH,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error creando acto administrativo');
      }

      console.log('✅ [ACTOS-ADMIN-SERVICE] PROMESA 1 completada');
      console.log(`   Acto creado: ID ${response.data.id}`);
      console.log(`   Nombre generado: "${response.data.nombre}"`);
      console.log(`   Consecutivo: ${response.data.consecutivo || 'N/A'}`);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en PROMESA 1 (crearActoAdministrativo):', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al crear el acto administrativo'
      );
    }
  }

  /**
   * ============================================================================
   * PROMESA 2: Subir Archivos (OBLIGATORIO)
   * ============================================================================
   * 
   * Usa la API de Documentos (Document Handler API)
   * 
   * Endpoint: POST /api/documents/upload/actos-administrativos
   * 
   * FormData requerido:
   * - acto_administrativo_id: ID del acto creado en Promesa 1
   * - institucion_educativa_id: UUID de la institución
   * - tipo_documento: 'acto_administrativo'
   * - files: Array de archivos (OBLIGATORIO - mínimo 1)
   * 
   * Response esperado:
   * {
   *   success: true,
   *   message: "Archivos subidos exitosamente",
   *   data: {
   *     archivos_procesados: [
   *       {
   *         nombre_original: "resolucion.pdf",
   *         ruta_relativa: "actos_administrativos/2025/institucion_uuid/resolucion.pdf",
   *         tamano: 12345,
   *         tipo_mime: "application/pdf",
   *         elasticsearch_id: "es_doc_id"
   *       }
   *     ],
   *     total_archivos: 1,
   *     elasticsearch_indexados: 1,
   *     acto_administrativo_id: 1,
   *     institucion_educativa_id: "uuid-institucion"
   *   }
   * }
   */
  async subirArchivos(
    archivos: File[],
    actoAdministrativoId: number,
    institucionEducativaId: string
  ): Promise<Array<{ nombre: string; ruta: string }>> {
    try {
      console.log(`📤 [ACTOS-ADMIN-SERVICE] PROMESA 2: Subiendo ${archivos.length} archivos a Document API`);
      console.log(`   URL: ${DocumentApiService.getBaseUrl()}${this.UPLOAD_PATH}`);

      // ⚠️ Validación: Al menos 1 archivo es OBLIGATORIO
      if (!archivos || archivos.length === 0) {
        throw new Error('Debe subir al menos un archivo para el acto administrativo');
      }

      const formData = new FormData();
      
      // ✅ Campos requeridos según la API de Documentos
      formData.append('acto_administrativo_id', actoAdministrativoId.toString());
      formData.append('institucion_educativa_id', institucionEducativaId);
      formData.append('tipo_documento', 'acto_administrativo');
      
      // ✅ Agregar archivos con el nombre 'files' (plural) - CRÍTICO
      archivos.forEach((archivo, index) => {
        formData.append('files', archivo);
        console.log(`   📎 Archivo ${index + 1}: ${archivo.name} (${archivo.size} bytes, ${archivo.type})`);
      });

      console.log('📋 [ACTOS-ADMIN-SERVICE] FormData configurado:', {
        acto_administrativo_id: actoAdministrativoId,
        institucion_educativa_id: institucionEducativaId,
        tipo_documento: 'acto_administrativo',
        total_archivos: archivos.length
      });

      // Llamar a la API de Documentos
      const response = await DocumentApiService.postFormData<UploadFilesResponse>(
        this.UPLOAD_PATH,
        formData
      );

      // Validar respuesta según documentación
      if (!response.success || !response.data) {
        console.error('❌ [ACTOS-ADMIN-SERVICE] Respuesta inválida:', response);
        throw new Error(response.message || 'Error subiendo archivos: respuesta inválida');
      }

      console.log('✅ [ACTOS-ADMIN-SERVICE] PROMESA 2 completada exitosamente');
      console.log(`   Total procesados: ${response.data.total_archivos}`);
      console.log(`   Indexados en Elasticsearch: ${response.data.elasticsearch_indexados || 0}`);
      console.log(`   Acto ID: ${response.data.acto_administrativo_id}`);
      console.log(`   Institución: ${response.data.institucion_educativa_id}`);
      
      // Validar que exista el array de archivos procesados
      if (!response.data.archivos_procesados || !Array.isArray(response.data.archivos_procesados)) {
        console.error('❌ [ACTOS-ADMIN-SERVICE] No se encontró archivos_procesados en response:', response.data);
        throw new Error('Response inválido: falta archivos_procesados');
      }

      if (response.data.archivos_procesados.length === 0) {
        console.warn('⚠️ [ACTOS-ADMIN-SERVICE] No se procesaron archivos');
        throw new Error('No se procesaron archivos en el servidor');
      }
      
      // ✅ Transformar respuesta según formato de la API de Documentos
      // Según documentación: usar nombre_original y ruta_relativa
      const archivosParaPromesa3 = response.data.archivos_procesados.map((archivo, index) => {
        console.log(`   ✓ [${index + 1}] ${archivo.nombre_original}`);
        console.log(`      → Ruta: ${archivo.ruta_relativa}`);
        if (archivo.tamano) {
          console.log(`      → Tamaño: ${(archivo.tamano / 1024).toFixed(2)} KB`);
        }
        if (archivo.tipo_mime) {
          console.log(`      → MIME: ${archivo.tipo_mime}`);
        }
        if (archivo.elasticsearch_id) {
          console.log(`      → Elasticsearch ID: ${archivo.elasticsearch_id}`);
        }
        
        return {
          nombre: archivo.nombre_original,
          ruta: archivo.ruta_relativa
        };
      });

      console.log('📦 [ACTOS-ADMIN-SERVICE] Datos preparados para Promesa 3:', archivosParaPromesa3.length, 'archivo(s)');
      return archivosParaPromesa3;
      
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en PROMESA 2 (subirArchivos):', error);
      
      // Mensajes específicos según el error
      let errorMessage = 'Error al subir archivos a la API de Documentos';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 
                      'Error 400: Verifica que los campos requeridos estén presentes y que hayas subido al menos un archivo';
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
   * ============================================================================
   * PROMESA 3: Registrar Documentos en BD
   * ============================================================================
   */
  async registrarDocumentos(
    actoAdministrativoId: number,
    archivos: Array<{ nombre: string; ruta: string }>
  ): Promise<DocumentoActoAdministrativo[]> {
    try {
      console.log(`📋 [ACTOS-ADMIN-SERVICE] PROMESA 3: Registrando ${archivos.length} documentos en BD`);

      const documentosCreados = await Promise.all(
        archivos.map(async (archivo) => {
          const docData: ICreateDocumentoActoAdministrativo = {
            acto_administrativo_id: actoAdministrativoId,
            nombre: archivo.nombre,
            ruta_relativa: archivo.ruta,
          };

          const response = await JwtApiService.post<DocumentoActoAdministrativoResponse>(
            this.DOCS_PATH,
            docData
          );

          if (!response.success) {
            throw new Error(`Error registrando documento: ${archivo.nombre}`);
          }

          console.log(`   ✓ Documento registrado: ${archivo.nombre} (ID: ${response.data.id})`);
          return response.data;
        })
      );

      console.log('✅ [ACTOS-ADMIN-SERVICE] PROMESA 3 completada');
      console.log(`   Total documentos registrados: ${documentosCreados.length}`);
      return documentosCreados;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en PROMESA 3 (registrarDocumentos):', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al registrar documentos en la base de datos'
      );
    }
  }

  /**
   * ============================================================================
   * FLUJO COMPLETO: 3 Promesas Encadenadas
   * ============================================================================
   * 
   * Proceso:
   * 1. Crear acto administrativo (genera nombre automáticamente)
   * 2. Subir archivos a Document API (OBLIGATORIO)
   * 3. Registrar documentos en BD
   */
  async crearActoAdministrativoCompleto(
    dataActoAdministrativo: ICreateActoAdministrativo,
    archivos: File[]
  ): Promise<CrearActoAdministrativoCompletoResult> {
    try {
      console.log('\n🚀 [ACTOS-ADMIN-SERVICE] Iniciando flujo completo de creación...');
      console.log(`   Institución: ${dataActoAdministrativo.institucion_educativa_id}`);
      console.log(`   Archivos: ${archivos.length}`);

      // ⚠️ Validación previa: archivos obligatorios
      if (!archivos || archivos.length === 0) {
        throw new Error('Debe incluir al menos un archivo para crear el acto administrativo');
      }

      // PASO 1: Crear acto administrativo
      console.log('\n📝 Paso 1/3: Creando acto administrativo...');
      const actoAdministrativo = await this.crearActoAdministrativo(dataActoAdministrativo);

      // PASO 2: Subir archivos a Document API (OBLIGATORIO)
      console.log('\n📤 Paso 2/3: Subiendo archivos a Document API...');
      const rutasArchivos = await this.subirArchivos(
        archivos, 
        actoAdministrativo.id,
        dataActoAdministrativo.institucion_educativa_id
      );

      // PASO 3: Registrar documentos en BD
      console.log('\n📋 Paso 3/3: Registrando documentos en BD...');
      const documentos = await this.registrarDocumentos(actoAdministrativo.id, rutasArchivos);

      console.log('\n✅ [ACTOS-ADMIN-SERVICE] Flujo completo exitoso');
      console.log(`   - Acto Administrativo ID: ${actoAdministrativo.id}`);
      console.log(`   - Nombre generado: "${actoAdministrativo.nombre}"`);
      console.log(`   - Documentos: ${documentos.length}`);

      return {
        success: true,
        actoAdministrativo,
        documentos,
      };
    } catch (error: any) {
      console.error('\n❌ [ACTOS-ADMIN-SERVICE] Error en flujo completo:', error);
      throw error;
    }
  }

  /**
   * ============================================================================
   * OPERACIONES CRUD
   * ============================================================================
   */

  /**
   * Obtener lista de actos administrativos con filtros
   */
  async getActosAdministrativos(filters: ActosAdministrativosFilters = {}): Promise<ActosAdministrativosListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const query = queryParams.toString();
      const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

      console.log('🔍 [ACTOS-ADMIN-SERVICE] Obteniendo actos administrativos:', url);
      const response = await JwtApiService.get<ActosAdministrativosListResponse>(url);

      return response;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en getActosAdministrativos:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener actos administrativos'
      );
    }
  }

  /**
   * Obtener acto administrativo por ID
   */
  async getActoAdministrativoById(id: number): Promise<ActoAdministrativo> {
    try {
      console.log('🔍 [ACTOS-ADMIN-SERVICE] Obteniendo acto administrativo:', id);
      
      const response = await JwtApiService.get<ActoAdministrativoResponse>(
        `${this.BASE_PATH}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Acto administrativo no encontrado');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en getActoAdministrativoById:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al obtener el acto administrativo'
      );
    }
  }

  /**
   * Actualizar acto administrativo
   * ⚠️ NO se puede actualizar el nombre (es generado automáticamente)
   */
  async updateActoAdministrativo(
    id: number,
    data: IUpdateActoAdministrativo
  ): Promise<ActoAdministrativo> {
    try {
      console.log('✏️ [ACTOS-ADMIN-SERVICE] Actualizando acto administrativo:', id);
      
      const response = await JwtApiService.put<ActoAdministrativoResponse>(
        `${this.BASE_PATH}/${id}`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error actualizando acto administrativo');
      }

      console.log('✅ [ACTOS-ADMIN-SERVICE] Acto administrativo actualizado');
      return response.data;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en updateActoAdministrativo:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al actualizar el acto administrativo'
      );
    }
  }

  /**
   * Eliminar acto administrativo (solo super_admin)
   */
  async deleteActoAdministrativo(id: number): Promise<boolean> {
    try {
      console.log('🗑️ [ACTOS-ADMIN-SERVICE] Eliminando acto administrativo:', id);
      
      const response = await JwtApiService.delete<{ success: boolean; message: string }>(
        `${this.BASE_PATH}/${id}`
      );

      console.log('✅ [ACTOS-ADMIN-SERVICE] Acto administrativo eliminado');
      return response.success;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en deleteActoAdministrativo:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al eliminar el acto administrativo'
      );
    }
  }

  /**
   * ============================================================================
   * OPERACIONES DE DOCUMENTOS
   * ============================================================================
   */

  /**
   * Obtener documentos por acto administrativo
   */
  async getDocumentosByActoAdministrativo(actoId: number): Promise<DocumentosActosAdministrativosListResponse> {
    try {
      console.log('📄 [ACTOS-ADMIN-SERVICE] Obteniendo documentos del acto:', actoId);
      
      const response = await JwtApiService.get<DocumentosActosAdministrativosListResponse>(
        `${this.DOCS_PATH}/acto/${actoId}`
      );

      return response;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en getDocumentosByActoAdministrativo:', error);
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
      console.log('📥 [ACTOS-ADMIN-SERVICE] Descargando documento:', documentoId);
      
      const response = await JwtApiService.get<Blob>(
        `${this.DOCS_PATH}/${documentoId}/download`,
        { responseType: 'blob' as any }
      );

      return response as any;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en descargarDocumento:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al descargar documento'
      );
    }
  }

  /**
   * Eliminar documento (solo super_admin)
   */
  async deleteDocumento(documentoId: string): Promise<boolean> {
    try {
      console.log('🗑️ [ACTOS-ADMIN-SERVICE] Eliminando documento:', documentoId);
      
      const response = await JwtApiService.delete<{ success: boolean }>(
        `${this.DOCS_PATH}/${documentoId}`
      );

      console.log('✅ [ACTOS-ADMIN-SERVICE] Documento eliminado');
      return response.success;
    } catch (error: any) {
      console.error('❌ [ACTOS-ADMIN-SERVICE] Error en deleteDocumento:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al eliminar documento'
      );
    }
  }
}

// Exportar instancia única
const actosAdministrativosService = new ActosAdministrativosService();
export default actosAdministrativosService;
