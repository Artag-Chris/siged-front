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
      
      const response = await JwtApiService.post<ActoAdministrativoResponse>(
        this.BASE_PATH,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error creando acto administrativo');
      }      
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

  async subirArchivos(
    archivos: File[],
    actoAdministrativoId: number,
    institucionEducativaId: string
  ): Promise<Array<{ nombre: string; ruta: string }>> {
    try {

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
      // Validar que exista el array de archivos procesados
      if (!response.data.archivos_procesados || !Array.isArray(response.data.archivos_procesados)) {
        console.error('❌ [ACTOS-ADMIN-SERVICE] No se encontró archivos_procesados en response:', response.data);
        throw new Error('Response inválido: falta archivos_procesados');
      }

      if (response.data.archivos_procesados.length === 0) {

        throw new Error('No se procesaron archivos en el servidor');
      }

      const archivosParaPromesa3 = response.data.archivos_procesados.map((archivo, index) => {
       
        if (archivo.tamano) {

        }
        if (archivo.tipo_mime) {

        }
        if (archivo.elasticsearch_id) {
     
        }
        
        return {
          nombre: archivo.nombre_original,
          ruta: archivo.ruta_relativa
        };
      });

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

          return response.data;
        })
      );

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

      // ⚠️ Validación previa: archivos obligatorios
      if (!archivos || archivos.length === 0) {
        throw new Error('Debe incluir al menos un archivo para crear el acto administrativo');
      }

      // PASO 1: Crear acto administrativo

      const actoAdministrativo = await this.crearActoAdministrativo(dataActoAdministrativo);

      // PASO 2: Subir archivos a Document API (OBLIGATORIO)

      const rutasArchivos = await this.subirArchivos(
        archivos, 
        actoAdministrativo.id,
        dataActoAdministrativo.institucion_educativa_id
      );

      // PASO 3: Registrar documentos en BD

      const documentos = await this.registrarDocumentos(actoAdministrativo.id, rutasArchivos);


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
      const response = await JwtApiService.put<ActoAdministrativoResponse>(
        `${this.BASE_PATH}/${id}`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error actualizando acto administrativo');
      }

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
      
      const response = await JwtApiService.delete<{ success: boolean; message: string }>(
        `${this.BASE_PATH}/${id}`
      );

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
      const response = await JwtApiService.delete<{ success: boolean }>(
        `${this.DOCS_PATH}/${documentoId}`
      );
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
