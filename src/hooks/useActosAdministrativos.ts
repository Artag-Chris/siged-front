// hooks/useActosAdministrativos.ts
import { useState, useEffect } from 'react';
import actosAdministrativosService from '@/services/actos-administrativos.service';
import {
  ActoAdministrativo,
  ActosAdministrativosFilters,
  ICreateActoAdministrativo,
  IUpdateActoAdministrativo,
  DocumentoActoAdministrativo,
  ActoAdministrativoFormData,
  CreacionFlowStatus,
} from '@/types/actos-administrativos.types';

/**
 * ============================================================================
 * HOOK 1: useActosAdministrativos (Lista con filtros)
 * ============================================================================
 */
export function useActosAdministrativos(initialFilters: ActosAdministrativosFilters = {}) {
  const [actosAdministrativos, setActosAdministrativos] = useState<ActoAdministrativo[]>([]);
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

  const fetchActosAdministrativos = async (filters: ActosAdministrativosFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await actosAdministrativosService.getActosAdministrativos({
        ...initialFilters,
        ...filters,
      });

      setActosAdministrativos(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      console.error('Error fetching actos administrativos:', err);
      setError(err.message || 'Error al cargar actos administrativos');
      setActosAdministrativos([]);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchActosAdministrativos(initialFilters);
  };

  useEffect(() => {
    fetchActosAdministrativos(initialFilters);
  }, []);

  return {
    actosAdministrativos,
    loading,
    error,
    pagination,
    fetchActosAdministrativos,
    refresh,
  };
}

/**
 * ============================================================================
 * HOOK 2: useActoAdministrativo (Single record por ID)
 * ============================================================================
 */
export function useActoAdministrativo(id: number | null) {
  const [actoAdministrativo, setActoAdministrativo] = useState<ActoAdministrativo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActoAdministrativo = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await actosAdministrativosService.getActoAdministrativoById(id);
      setActoAdministrativo(data);
    } catch (err: any) {
      console.error('Error fetching acto administrativo:', err);
      setError(err.message || 'Error al cargar acto administrativo');
      setActoAdministrativo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActoAdministrativo();
  }, [id]);

  return {
    actoAdministrativo,
    loading,
    error,
    refresh: fetchActoAdministrativo,
  };
}

/**
 * ============================================================================
 * HOOK 3: useCrearActoAdministrativo (Flujo completo de 3 promesas)
 * ============================================================================
 */
export function useCrearActoAdministrativo() {
  const [flowStatus, setFlowStatus] = useState<CreacionFlowStatus>({
    state: 'form',
  });

  const crearActoAdministrativo = async (formData: ActoAdministrativoFormData) => {
    try {
      // Validaciones previas
      if (!formData.institucion_educativa_id) {
        throw new Error('Debe seleccionar una institución educativa');
      }

      if (!formData.archivos || formData.archivos.length === 0) {
        throw new Error('Debe subir al menos un archivo');
      }

      // Iniciar flujo
      setFlowStatus({
        state: 'uploading',
        currentStep: 1,
        message: 'Creando acto administrativo...',
      });

      const dataActo: ICreateActoAdministrativo = {
        institucion_educativa_id: formData.institucion_educativa_id,
        descripcion: formData.descripcion || undefined,
      };

      const result = await actosAdministrativosService.crearActoAdministrativoCompleto(
        dataActo,
        formData.archivos
      );

      // Éxito
      setFlowStatus({
        state: 'success',
        message: `Acto administrativo "${result.actoAdministrativo.nombre}" creado exitosamente con ${result.documentos.length} documento(s)`,
      });

      return result;
    } catch (err: any) {
      console.error('Error creando acto administrativo:', err);
      setFlowStatus({
        state: 'error',
        error: err.message || 'Error al crear acto administrativo',
      });
      throw err;
    }
  };

  const resetFlow = () => {
    setFlowStatus({ state: 'form' });
  };

  return {
    crearActoAdministrativo,
    flowStatus,
    resetFlow,
  };
}

/**
 * ============================================================================
 * HOOK 4: useUpdateActoAdministrativo
 * ============================================================================
 */
export function useUpdateActoAdministrativo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateActoAdministrativo = async (
    id: number,
    data: IUpdateActoAdministrativo
  ): Promise<ActoAdministrativo> => {
    try {
      setLoading(true);
      setError(null);

      const updated = await actosAdministrativosService.updateActoAdministrativo(id, data);
      
      return updated;
    } catch (err: any) {
      console.error('Error updating acto administrativo:', err);
      const errorMessage = err.message || 'Error al actualizar acto administrativo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateActoAdministrativo,
    loading,
    error,
  };
}

/**
 * ============================================================================
 * HOOK 5: useDeleteActoAdministrativo
 * ============================================================================
 */
export function useDeleteActoAdministrativo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteActoAdministrativo = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await actosAdministrativosService.deleteActoAdministrativo(id);
      
      return result;
    } catch (err: any) {
      console.error('Error deleting acto administrativo:', err);
      const errorMessage = err.message || 'Error al eliminar acto administrativo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteActoAdministrativo,
    loading,
    error,
  };
}

/**
 * ============================================================================
 * HOOK 6: useDocumentosActoAdministrativo
 * ============================================================================
 */
export function useDocumentosActoAdministrativo(actoId: number | null) {
  const [documentos, setDocumentos] = useState<DocumentoActoAdministrativo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentos = async () => {
    if (!actoId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await actosAdministrativosService.getDocumentosByActoAdministrativo(actoId);
      setDocumentos(response.data);
    } catch (err: any) {
      console.error('Error fetching documentos:', err);
      setError(err.message || 'Error al cargar documentos');
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, [actoId]);

  return {
    documentos,
    loading,
    error,
    refresh: fetchDocumentos,
  };
}

/**
 * ============================================================================
 * HOOK 7: useDescargarDocumento
 * ============================================================================
 */
export function useDescargarDocumento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargarDocumento = async (documentoId: string, nombreArchivo: string) => {
    try {
      setLoading(true);
      setError(null);

      const blob = await actosAdministrativosService.descargarDocumento(documentoId);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error descargando documento:', err);
      const errorMessage = err.message || 'Error al descargar documento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    descargarDocumento,
    loading,
    error,
  };
}
