import { useCallback, useEffect } from 'react';
import { useEmpleadosStore } from '@/lib/empleados-store';
import { useJwtAuthStore } from '@/lib/jwt-auth-store';
import {
  Empleado,
  CreateEmpleadoRequest,
  UpdateEmpleadoRequest,
  EmpleadoFilters,
  CreateComentarioEmpleado,
  EmpleadoDocumentUpload
} from '@/types/empleados.types';

interface UseEmpleadosOptions {
  autoLoad?: boolean;
  initialFilters?: EmpleadoFilters;
}

export const useEmpleados = (options: UseEmpleadosOptions = {}) => {
  const { autoLoad = true, initialFilters } = options;

  const {
    empleados,
    selectedEmpleado,
    isLoading,
    error,
    filters,
    pagination,
    getEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    addComentario,
    uploadDocument,
    setSelectedEmpleado,
    setFilters,
    clearError,
    setLoading
  } = useEmpleadosStore();

  const { getCurrentUser, getAccessToken, isAuthenticated } = useJwtAuthStore();

  const loadEmpleados = useCallback(async (customFilters?: EmpleadoFilters) => {
    if (!isAuthenticated) {
      return;
    }

    await getEmpleados(customFilters || initialFilters);
  }, [getEmpleados, initialFilters, isAuthenticated]);

  const handleCreateEmpleado = useCallback(async (data: CreateEmpleadoRequest): Promise<Empleado | null> => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No se pudo obtener el usuario actual');
    }

    return await createEmpleado(data);
  }, [createEmpleado, isAuthenticated, getCurrentUser]);

  const handleUpdateEmpleado = useCallback(async (id: string, data: UpdateEmpleadoRequest): Promise<Empleado | null> => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    return await updateEmpleado(id, data);
  }, [updateEmpleado, isAuthenticated]);

  const handleDeleteEmpleado = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    return await deleteEmpleado(id);
  }, [deleteEmpleado, isAuthenticated]);

  const handleGetEmpleadoById = useCallback(async (id: string): Promise<Empleado | null> => {
    if (!isAuthenticated) {
      return null;
    }

    return await getEmpleadoById(id);
  }, [getEmpleadoById, isAuthenticated]);

  const handleAddComentario = useCallback(async (empleadoId: string, observacion: string): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No se pudo obtener el usuario actual');
    }

    const comentarioData: CreateComentarioEmpleado = {
      empleado_id: empleadoId,
      usuario_id: currentUser.id,
      observacion
    };

    const result = await addComentario(comentarioData);
    return result !== null;
  }, [addComentario, isAuthenticated, getCurrentUser]);

  const handleUploadDocument = useCallback(async (
    empleadoId: string, 
    file: File, 
    documentType: string, 
    description?: string
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    if (!empleadoId || empleadoId === 'uuid-placeholder') {
      throw new Error('ID de empleado inválido - debe ser un UUID real');
    }

    const uploadData: EmpleadoDocumentUpload = {
      empleado_id: empleadoId, 
      file,
      document_type: documentType,
      description
    };

    return await uploadDocument(uploadData);
  }, [uploadDocument, isAuthenticated]);


  const selectEmpleado = useCallback((empleado: Empleado | null) => {
    setSelectedEmpleado(empleado);
    
    if (empleado) {
      console.log('📌 [USE-EMPLEADOS] Empleado seleccionado para operaciones:', {
        id: empleado.id,
        nombre: `${empleado.nombre} ${empleado.apellido}`,
        cargo: empleado.cargo
      });
    }
  }, [setSelectedEmpleado]);

  const updateFilters = useCallback((newFilters: Partial<EmpleadoFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const clearErrors = useCallback(() => {
    clearError();
  }, [clearError]);

  const refreshEmpleados = useCallback(() => {
    loadEmpleados();
  }, [loadEmpleados]);

  const getDocentes = useCallback((additionalFilters?: Partial<EmpleadoFilters>) => {
    return loadEmpleados({ 
      ...additionalFilters, 
      cargo: 'Docente' 
    });
  }, [loadEmpleados]);

  const getRectores = useCallback((additionalFilters?: Partial<EmpleadoFilters>) => {
    return loadEmpleados({ 
      ...additionalFilters, 
      cargo: 'Rector' 
    });
  }, [loadEmpleados]);

  const getEmpleadosActivos = useCallback((additionalFilters?: Partial<EmpleadoFilters>) => {
    return loadEmpleados({ 
      ...additionalFilters, 
      estado: 'activo' 
    });
  }, [loadEmpleados]);


  useEffect(() => {
    if (autoLoad && isAuthenticated) {
      loadEmpleados();
    }
  }, [autoLoad, loadEmpleados, isAuthenticated]);

  const stats = {
    total: empleados.length,
    docentes: empleados.filter(emp => emp.cargo === 'Docente').length,
    rectores: empleados.filter(emp => emp.cargo === 'Rector').length,
    activos: empleados.filter(emp => emp.estado === 'activo').length,
    inactivos: empleados.filter(emp => emp.estado === 'inactivo').length
  };

  const isUserAuthenticated = isAuthenticated;
  const currentUser = getCurrentUser();
  const accessToken = getAccessToken();

  return {
    // Estado
    empleados,
    selectedEmpleado,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    
    // Autenticación
    isUserAuthenticated,
    currentUser,
    accessToken,
    
    // Operaciones CRUD
    loadEmpleados,
    createEmpleado: handleCreateEmpleado,
    updateEmpleado: handleUpdateEmpleado,
    deleteEmpleado: handleDeleteEmpleado,
    getEmpleadoById: handleGetEmpleadoById,
    
    // Comentarios
    addComentario: handleAddComentario,
    
    // Documentos
    uploadDocument: handleUploadDocument,
    
    // Utilidades
    selectEmpleado,
    updateFilters,
    clearErrors,
    refreshEmpleados,
    
    // Filtros específicos
    getDocentes,
    getRectores,
    getEmpleadosActivos,
    
    // Acciones de estado
    setLoading
  };
};

export default useEmpleados;