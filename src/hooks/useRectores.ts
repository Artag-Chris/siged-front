// hooks/useRectores.ts
import { useState, useEffect, useCallback } from 'react';
import rectorService from '@/services/rector.service';
import {
  RectoresFilters,
  Rector,
  IRectorResumen,
  ICreateRectorCompletoRequest,
  ICreateRectorCompletoResponse,
  InstitucionDisponible,
  InformacionAcademica,
} from '@/types/rector.types';

/**
 * ============================================================================
 * HOOK: useRectores - Lista de rectores con filtros y paginación
 * ============================================================================
 */
export const useRectores = (initialFilters?: RectoresFilters) => {
  const [rectores, setRectores] = useState<
    Array<
      Rector & {
        institucion?: any;
        informacionAcademica?: InformacionAcademica;
        _count?: { asignaciones: number };
      }
    >
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchRectores = useCallback(async (filters?: RectoresFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await rectorService.getRectores(filters);

      setRectores(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }

      console.log('✅ [USE-RECTORES] Rectores cargados:', response.data.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar rectores');
      console.error('❌ [USE-RECTORES] Error loading rectores:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRectores(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    fetchRectores(initialFilters);
  }, [fetchRectores, initialFilters]);

  return {
    rectores,
    loading,
    error,
    pagination,
    fetchRectores,
    refresh,
  };
};

/**
 * ============================================================================
 * HOOK: useRector - Obtener un rector específico con resumen completo
 * ============================================================================
 */
export const useRector = (rectorId: string | null) => {
  const [rector, setRector] = useState<IRectorResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRector = useCallback(async () => {
    if (!rectorId) {
      setRector(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await rectorService.getResumenRector(rectorId);
      setRector(data);
      console.log('✅ [USE-RECTOR] Rector cargado:', data.rector.nombre);
    } catch (err: any) {
      setError(err.message || 'Error al cargar rector');
      console.error('❌ [USE-RECTOR] Error loading rector:', err);
    } finally {
      setLoading(false);
    }
  }, [rectorId]);

  useEffect(() => {
    fetchRector();
  }, [fetchRector]);

  const refresh = useCallback(() => {
    fetchRector();
  }, [fetchRector]);

  return {
    rector,
    loading,
    error,
    refresh,
  };
};

/**
 * ============================================================================
 * HOOK: useCrearRectorCompleto - Crear rector con institución y sedes
 * ============================================================================
 */
export const useCrearRectorCompleto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ICreateRectorCompletoResponse | null>(null);

  const crearRector = useCallback(
    async (data: ICreateRectorCompletoRequest): Promise<ICreateRectorCompletoResponse | null> => {
      setLoading(true);
      setError(null);
      setResultado(null);

      try {
        const response = await rectorService.crearRectorCompleto(data);
        setResultado(response);
        console.log('✅ [USE-CREAR-RECTOR] Rector creado exitosamente');
        return response;
      } catch (err: any) {
        const errorMessage = err.message || 'Error al crear rector';
        setError(errorMessage);
        console.error('❌ [USE-CREAR-RECTOR] Error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setResultado(null);
  }, []);

  return {
    crearRector,
    loading,
    error,
    resultado,
    reset,
  };
};

/**
 * ============================================================================
 * HOOK: useValidarFlujoRector - Validar documento y email antes de crear
 * ============================================================================
 */
export const useValidarFlujoRector = () => {
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState<{
    documentoDisponible: boolean;
    emailDisponible: boolean;
    puedeCrearFlujo: boolean;
    conflictos: any[];
  } | null>(null);

  const validar = useCallback(async (documento: string, email?: string) => {
    setValidando(true);

    try {
      const response = await rectorService.validarFlujo(documento, email);
      setResultado(response.data);
      return response.data;
    } catch (err: any) {
      console.error('❌ [USE-VALIDAR-FLUJO] Error:', err);
      return null;
    } finally {
      setValidando(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResultado(null);
  }, []);

  return {
    validar,
    validando,
    resultado,
    reset,
  };
};

/**
 * ============================================================================
 * HOOK: useInstitucionesDisponibles - Obtener instituciones sin rector
 * ============================================================================
 */
export const useInstitucionesDisponibles = (options?: {
  sinRector?: boolean;
  conSedes?: boolean;
  autoLoad?: boolean;
}) => {
  const { sinRector = false, conSedes = false, autoLoad = true } = options || {};

  const [instituciones, setInstituciones] = useState<InstitucionDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstituciones = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await rectorService.getInstitucionesDisponibles(
        sinRector,
        conSedes
      );
      setInstituciones(response.data);
      console.log('✅ [USE-INSTITUCIONES-DISPONIBLES] Cargadas:', response.data.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar instituciones');
      console.error('❌ [USE-INSTITUCIONES-DISPONIBLES] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [sinRector, conSedes]);

  useEffect(() => {
    if (autoLoad) {
      fetchInstituciones();
    }
  }, [autoLoad, fetchInstituciones]);

  const refresh = useCallback(() => {
    fetchInstituciones();
  }, [fetchInstituciones]);

  return {
    instituciones,
    loading,
    error,
    refresh,
  };
};

/**
 * ============================================================================
 * HOOK: useAsignarRector - Asignar rector existente a institución
 * ============================================================================
 */
export const useAsignarRector = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asignar = useCallback(
    async (
      rectorId: string,
      institucionId: string,
      asignarTodasLasSedes = true,
      sedesEspecificas: string[] = []
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rectorService.asignarRectorAInstitucion(rectorId, {
          institucionId,
          asignarTodasLasSedes,
          sedesEspecificas,
        });
        console.log('✅ [USE-ASIGNAR-RECTOR] Rector asignado');
        return response;
      } catch (err: any) {
        const errorMessage = err.message || 'Error al asignar rector';
        setError(errorMessage);
        console.error('❌ [USE-ASIGNAR-RECTOR] Error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    asignar,
    loading,
    error,
  };
};

/**
 * ============================================================================
 * HOOK: useTransferirRector - Transferir rector a otra institución
 * ============================================================================
 */
export const useTransferirRector = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transferir = useCallback(
    async (
      rectorId: string,
      nuevaInstitucionId: string,
      mantenerSedesOriginales = false
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await rectorService.transferirRector(rectorId, {
          nuevaInstitucionId,
          mantenerSedesOriginales,
        });
        console.log('✅ [USE-TRANSFERIR-RECTOR] Rector transferido');
        return response;
      } catch (err: any) {
        const errorMessage = err.message || 'Error al transferir rector';
        setError(errorMessage);
        console.error('❌ [USE-TRANSFERIR-RECTOR] Error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    transferir,
    loading,
    error,
  };
};
