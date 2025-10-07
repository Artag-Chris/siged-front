import { useState, useEffect, useCallback } from 'react';
import horasExtraService from '@/services/horas-extra.service';
import {
  HoraExtra,
  HorasExtraFilters,
  ICreateHoraExtra,
  IUpdateHoraExtra,
  DocumentoHoraExtra,
  JornadaInfo,
} from '@/types/horas-extra.types';


export const useHorasExtra = () => {
  const [horasExtra, setHorasExtra] = useState<HoraExtra[]>([]);
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

  const loadHorasExtra = useCallback(async (filters: HorasExtraFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await horasExtraService.getHorasExtra(filters);
      setHorasExtra(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar registros de horas extra');
      console.error('Error loading horas extra:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  const crearHoraExtraCompleta = useCallback(
    async (data: ICreateHoraExtra, archivos: File[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await horasExtraService.crearHoraExtraCompleta(data, archivos);
        return result;
      } catch (err: any) {
        setError(err.message || 'Error al crear registro de horas extra');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );


  const actualizarHoraExtra = useCallback(
    async (id: string, data: IUpdateHoraExtra) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await horasExtraService.updateHoraExtra(id, data);
        // Actualizar en la lista local
        setHorasExtra((prev) =>
          prev.map((h) => (h.id === id ? updated : h))
        );
        return updated;
      } catch (err: any) {
        setError(err.message || 'Error al actualizar registro');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );


  const eliminarHoraExtra = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await horasExtraService.deleteHoraExtra(id);
      // Remover de la lista local
      setHorasExtra((prev) => prev.filter((h) => h.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar registro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    horasExtra,
    loading,
    error,
    pagination,
    loadHorasExtra,
    crearHoraExtraCompleta,
    actualizarHoraExtra,
    eliminarHoraExtra,
  };
};

export const useHoraExtra = (id: string | null) => {
  const [horaExtra, setHoraExtra] = useState<HoraExtra | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setHoraExtra(null);
      return;
    }

    const loadHoraExtra = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await horasExtraService.getHoraExtraById(id);
        setHoraExtra(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar registro');
        console.error('Error loading hora extra:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHoraExtra();
  }, [id]);

  const reload = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await horasExtraService.getHoraExtraById(id);
      setHoraExtra(data);
    } catch (err: any) {
      setError(err.message || 'Error al recargar registro');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { horaExtra, loading, error, reload };
};


export const useJornadasHorasExtra = () => {
  const [jornadas, setJornadas] = useState<JornadaInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJornadas = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await horasExtraService.getJornadas();
        setJornadas(data);
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


export const useDocumentosHoraExtra = (horasExtraId: string | null) => {
  const [documentos, setDocumentos] = useState<DocumentoHoraExtra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocumentos = useCallback(async () => {
    if (!horasExtraId) {
      setDocumentos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await horasExtraService.getDocumentosByHoraExtra(horasExtraId);
      setDocumentos(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar documentos');
      console.error('Error loading documentos:', err);
    } finally {
      setLoading(false);
    }
  }, [horasExtraId]);

  useEffect(() => {
    loadDocumentos();
  }, [loadDocumentos]);

  return { documentos, loading, error, reload: loadDocumentos };
};


export const useDescargarDocumento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargar = useCallback(async (documentoId: string, nombreArchivo: string) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await horasExtraService.descargarDocumento(documentoId);
      

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err: any) {
      setError(err.message || 'Error al descargar documento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { descargar, loading, error };
};
