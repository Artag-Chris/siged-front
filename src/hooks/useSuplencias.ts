// hooks/useSuplencias.ts
// Custom hook para gestionar Suplencias

import { useState, useEffect, useCallback } from 'react';
import suplenciaService from '@/services/suplencia.service';
import {
  Suplencia,
  SuplenciaFilters,
  ICreateSuplencia,
  IUpdateSuplencia,
  JornadaInfo,
  DocumentoSuplencia,
  EstadisticasSuplencia,
} from '@/types/suplencia.types';

export const useSuplencias = () => {
  const [suplencias, setSuplencias] = useState<Suplencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  /**
   * Cargar lista de suplencias
   */
  const loadSuplencias = useCallback(async (filters: SuplenciaFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await suplenciaService.getSuplencias(filters);
      setSuplencias(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar suplencias');
      console.error('Error loading suplencias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear suplencia completa (con archivos)
   */
  const crearSuplenciaCompleta = useCallback(
    async (data: ICreateSuplencia, archivos: File[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await suplenciaService.crearSuplenciaCompleta(data, archivos);
        return result;
      } catch (err: any) {
        setError(err.message || 'Error al crear suplencia');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Actualizar suplencia
   */
  const actualizarSuplencia = useCallback(
    async (id: string, data: IUpdateSuplencia) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await suplenciaService.updateSuplencia(id, data);
        // Actualizar en la lista local
        setSuplencias((prev) =>
          prev.map((s) => (s.id === id ? updated : s))
        );
        return updated;
      } catch (err: any) {
        setError(err.message || 'Error al actualizar suplencia');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Eliminar suplencia
   */
  const eliminarSuplencia = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await suplenciaService.deleteSuplencia(id);
      // Remover de la lista local
      setSuplencias((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar suplencia');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suplencias,
    loading,
    error,
    pagination,
    loadSuplencias,
    crearSuplenciaCompleta,
    actualizarSuplencia,
    eliminarSuplencia,
  };
};

/**
 * Hook para obtener una suplencia específica
 */
export const useSuplencia = (id: string | null) => {
  const [suplencia, setSuplencia] = useState<Suplencia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setSuplencia(null);
      return;
    }

    const loadSuplencia = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await suplenciaService.getSuplenciaById(id);
        setSuplencia(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar suplencia');
        console.error('Error loading suplencia:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuplencia();
  }, [id]);

  const reload = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await suplenciaService.getSuplenciaById(id);
      setSuplencia(data);
    } catch (err: any) {
      setError(err.message || 'Error al recargar suplencia');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { suplencia, loading, error, reload };
};

/**
 * Hook para obtener jornadas disponibles
 */
export const useJornadas = () => {
  const [jornadas, setJornadas] = useState<JornadaInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJornadas = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await suplenciaService.getJornadas();
        setJornadas(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar jornadas');
        console.error('Error loading jornadas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJornadas();
  }, []);

  return { jornadas, loading, error };
};

/**
 * Hook para obtener documentos de una suplencia
 */
export const useDocumentosSuplencia = (suplenciaId: string | null) => {
  const [documentos, setDocumentos] = useState<DocumentoSuplencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocumentos = useCallback(async () => {
    if (!suplenciaId) {
      setDocumentos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await suplenciaService.getDocumentosBySuplencia(suplenciaId);
      setDocumentos(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar documentos');
      console.error('Error loading documentos:', err);
    } finally {
      setLoading(false);
    }
  }, [suplenciaId]);

  useEffect(() => {
    loadDocumentos();
  }, [loadDocumentos]);

  return { documentos, loading, error, reload: loadDocumentos };
};

/**
 * Hook para obtener estadísticas
 */
export const useEstadisticasSuplencias = (params: {
  empleado_id?: string;
  sede_id?: string;
  año?: number;
} = {}) => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasSuplencia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await suplenciaService.getEstadisticas(params);
      setEstadisticas(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error loading estadisticas:', err);
    } finally {
      setLoading(false);
    }
  }, [params.empleado_id, params.sede_id, params.año]);

  useEffect(() => {
    loadEstadisticas();
  }, [loadEstadisticas]);

  return { estadisticas, loading, error, reload: loadEstadisticas };
};
