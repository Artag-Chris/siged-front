import { useState, useEffect, useCallback } from 'react';
import institucionService from '@/services/institucion.service';
import { InstitucionEducativa } from '@/types/institucion.types';

interface UseInstitucionesOptions {
  autoLoad?: boolean;
  search?: string;
}

export const useInstituciones = (options: UseInstitucionesOptions = {}) => {
  const { autoLoad = false, search } = options;

  const [instituciones, setInstituciones] = useState<InstitucionEducativa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100, // Cargar todas las instituciones para el dropdown
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const loadInstituciones = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await institucionService.getInstituciones({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });

      setInstituciones(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
    } catch (err: any) {
      setError(err.message || 'Error al cargar instituciones');
      console.error('❌ [USE-INSTITUCIONES] Error loading instituciones:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    if (autoLoad) {
      loadInstituciones();
    }
  }, [autoLoad, loadInstituciones]);

  return {
    instituciones,
    loading,
    error,
    pagination,
    loadInstituciones,
    reload: loadInstituciones,
  };
};

/**
 * Hook para obtener una institución específica
 */
export const useInstitucion = (id: string | null) => {
  const [institucion, setInstitucion] = useState<InstitucionEducativa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setInstitucion(null);
      return;
    }

    const loadInstitucion = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await institucionService.getInstitucionById(id);
        setInstitucion(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar institución');
        console.error('❌ [USE-INSTITUCION] Error loading institución:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInstitucion();
  }, [id]);

  return { institucion, loading, error };
};
