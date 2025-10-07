// hooks/useSedes.ts
import { useState, useEffect, useCallback } from 'react';
import sedeService from '@/services/sede.service';
import { Sede } from '@/types/sede.types';

interface UseSedesOptions {
  autoLoad?: boolean;
  estado?: 'activa' | 'inactiva';
  zona?: 'urbana' | 'rural';
}

export const useSedes = (options: UseSedesOptions = {}) => {
  const { autoLoad = false, estado, zona } = options;

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100, // Cargar todas las sedes para el dropdown
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const loadSedes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await sedeService.getSedes({
        page: pagination.page,
        limit: pagination.limit,
        estado,
        zona,
      });

      setSedes(response.data);
      setPagination(response.pagination);
      console.log('✅ [USE-SEDES] Sedes cargadas:', response.data.length);
    } catch (err: any) {
      setError(err.message || 'Error al cargar sedes');
      console.error('❌ [USE-SEDES] Error loading sedes:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, estado, zona]);

  useEffect(() => {
    if (autoLoad) {
      loadSedes();
    }
  }, [autoLoad, loadSedes]);

  return {
    sedes,
    loading,
    error,
    pagination,
    loadSedes,
    reload: loadSedes,
  };
};

/**
 * Hook para obtener una sede específica
 */
export const useSede = (id: string | null) => {
  const [sede, setSede] = useState<Sede | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setSede(null);
      return;
    }

    const loadSede = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await sedeService.getSedeById(id);
        setSede(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar sede');
        console.error('❌ [USE-SEDE] Error loading sede:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSede();
  }, [id]);

  return { sede, loading, error };
};
