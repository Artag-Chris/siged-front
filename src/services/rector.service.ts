// services/rector.service.ts
import JwtApiService from './jwt-api.service';
import {
  ICreateRectorCompletoRequest,
  ICreateRectorCompletoResponse,
  IValidarFlujoResponse,
  RectoresFilters,
  RectoresListResponse,
  IRectorResumen,
  InstitucionesDisponiblesResponse,
  IAsignarRectorRequest,
  ITransferirRectorRequest,
} from '@/types/rector.types';

/**
 * Servicio para gestión de rectores
 * Incluye creación completa, validaciones, asignaciones y transferencias
 */
class RectorService {
  private readonly BASE_PATH = '/api/empleado/rector';


  async validarFlujo(
    documento: string,
    email?: string
  ): Promise<IValidarFlujoResponse> {
    try {
      console.log('🔍 [RECTOR-SERVICE] Validando flujo para documento:', documento);

      const params = new URLSearchParams({ documento });
      if (email) params.append('email', email);

      const response = await JwtApiService.get<IValidarFlujoResponse>(
        `${this.BASE_PATH}/validar-flujo?${params.toString()}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Error validando flujo');
      }

      console.log('✅ [RECTOR-SERVICE] Validación completada:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error validando flujo:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al validar flujo de rector'
      );
    }
  }

  /**
   * ============================================================================
   * CREAR RECTOR COMPLETO (Flujo Principal)
   * ============================================================================
   */
  async crearRectorCompleto(
    data: ICreateRectorCompletoRequest
  ): Promise<ICreateRectorCompletoResponse> {
    try {
      console.log('🚀 [RECTOR-SERVICE] Creando rector completo...');
      console.log('📋 [RECTOR-SERVICE] Datos:', {
        empleado: data.empleado.nombre + ' ' + data.empleado.apellido,
        documento: data.empleado.documento,
        institucion: data.institucion.nombre,
        sedes: data.sedes.crear?.length || 0,
      });

      const response = await JwtApiService.post<ICreateRectorCompletoResponse>(
        `${this.BASE_PATH}/crear-completo`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error creando rector completo');
      }

      console.log('✅ [RECTOR-SERVICE] Rector creado exitosamente');
      console.log(`   Rector ID: ${response.data.rector.id}`);
      console.log(`   Institución: ${response.data.institucion.nombre}`);
      console.log(`   Sedes creadas: ${response.data.resumen.sedesCreadas}`);
      console.log(`   Asignaciones: ${response.data.resumen.asignacionesRealizadas}`);

      return response;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error creando rector:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al crear rector completo'
      );
    }
  }

  /**
   * ============================================================================
   * OBTENER LISTA DE RECTORES
   * ============================================================================
   */
  async getRectores(filters?: RectoresFilters): Promise<RectoresListResponse> {
    try {
      console.log('📋 [RECTOR-SERVICE] Obteniendo lista de rectores...', filters);

      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.institucion_id) params.append('institucion_id', filters.institucion_id);

      const queryString = params.toString();
      const url = queryString ? `${this.BASE_PATH}/obtener?${queryString}` : this.BASE_PATH;

      console.log('🔗 [RECTOR-SERVICE] URL:', url);
      const response = await JwtApiService.get<RectoresListResponse>(url);

      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo rectores');
      }

      console.log(`✅ [RECTOR-SERVICE] ${response.data.length} rectores obtenidos`);
      return response;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error obteniendo rectores:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al obtener rectores'
      );
    }
  }

  /**
   * ============================================================================
   * OBTENER RESUMEN DE RECTOR
   * ============================================================================
   */
  async getResumenRector(rectorId: string): Promise<IRectorResumen> {
    try {
      console.log('🔍 [RECTOR-SERVICE] Obteniendo resumen de rector:', rectorId);

      const response = await JwtApiService.get<{
        success: boolean;
        message: string;
        data: IRectorResumen;
      }>(`${this.BASE_PATH}/${rectorId}/resumen`);

      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo resumen');
      }

      console.log('✅ [RECTOR-SERVICE] Resumen obtenido exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error obteniendo resumen:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al obtener resumen de rector'
      );
    }
  }

  /**
   * ============================================================================
   * OBTENER INSTITUCIONES DISPONIBLES
   * ============================================================================
   */
  async getInstitucionesDisponibles(
    sinRector = false,
    conSedes = false
  ): Promise<InstitucionesDisponiblesResponse> {
    try {
      console.log('🏫 [RECTOR-SERVICE] Obteniendo instituciones disponibles...');

      const params = new URLSearchParams();
      if (sinRector) params.append('sin_rector', 'true');
      if (conSedes) params.append('con_sedes', 'true');

      const queryString = params.toString();
      const url = queryString
        ? `${this.BASE_PATH}/instituciones-disponibles?${queryString}`
        : `${this.BASE_PATH}/instituciones-disponibles`;

      const response = await JwtApiService.get<InstitucionesDisponiblesResponse>(url);

      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo instituciones');
      }

      console.log(`✅ [RECTOR-SERVICE] ${response.data.length} instituciones disponibles`);
      return response;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error obteniendo instituciones:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al obtener instituciones disponibles'
      );
    }
  }

  /**
   * ============================================================================
   * ASIGNAR RECTOR A INSTITUCIÓN
   * ============================================================================
   */
  async asignarRectorAInstitucion(
    rectorId: string,
    data: IAsignarRectorRequest
  ): Promise<any> {
    try {
      console.log('📌 [RECTOR-SERVICE] Asignando rector a institución...');

      const response = await JwtApiService.post<{
        success: boolean;
        message: string;
        data: any;
      }>(
        `${this.BASE_PATH}/${rectorId}/asignar-institucion`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error asignando rector');
      }

      console.log('✅ [RECTOR-SERVICE] Rector asignado exitosamente');
      return response;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error asignando rector:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al asignar rector a institución'
      );
    }
  }

  /**
   * ============================================================================
   * TRANSFERIR RECTOR A OTRA INSTITUCIÓN
   * ============================================================================
   */
  async transferirRector(
    rectorId: string,
    data: ITransferirRectorRequest
  ): Promise<any> {
    try {
      console.log('🔄 [RECTOR-SERVICE] Transfiriendo rector...');

      const response = await JwtApiService.put<{
        success: boolean;
        message: string;
        data: any;
      }>(
        `${this.BASE_PATH}/${rectorId}/transferir-institucion`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || 'Error transfiriendo rector');
      }

      console.log('✅ [RECTOR-SERVICE] Rector transferido exitosamente');
      return response;
    } catch (error: any) {
      console.error('❌ [RECTOR-SERVICE] Error transfiriendo rector:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Error al transferir rector'
      );
    }
  }

  /**
   * ============================================================================
   * UTILIDADES DE VALIDACIÓN
   * ============================================================================
   */

  /**
   * Validar documento colombiano
   */
  validarDocumento(documento: string): boolean {
    const documentoLimpio = documento.replace(/[\s\-\.]/g, '');
    return /^\d{6,15}$/.test(documentoLimpio);
  }

  /**
   * Validar email
   */
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar código DANE (12 dígitos)
   */
  validarCodigoDANE(codigo: string): boolean {
    const codigoLimpio = codigo.replace(/[\s\-]/g, '');
    return /^\d{12}$/.test(codigoLimpio);
  }

  /**
   * Validar celular colombiano
   */
  validarCelular(celular: string): boolean {
    const celularLimpio = celular.replace(/[\s\-\(\)]/g, '');
    // Formato: 10 dígitos comenzando con 3
    return /^3\d{9}$/.test(celularLimpio);
  }

  /**
   * Validar teléfono fijo colombiano
   */
  validarTelefono(telefono: string): boolean {
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '');
    // Formato: 7 o 10 dígitos
    return /^\d{7,10}$/.test(telefonoLimpio);
  }
}

export default new RectorService();
