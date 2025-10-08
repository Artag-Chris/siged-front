// hooks/useCrearProfesorConSede.ts
// Hook para crear profesor con sede usando la nueva arquitectura

import { useState } from 'react';
import EmpleadosService from '@/services/empleados.service';
import { CreateProfesorConSedeRequest, CreateProfesorConSedeResponse } from '@/types/empleados.types';

interface UseCrearProfesorConSedeResult {
  loading: boolean;
  error: string | null;
  resultado: CreateProfesorConSedeResponse | null;
  crearProfesor: (data: CreateProfesorConSedeRequest) => Promise<CreateProfesorConSedeResponse | null>;
  reset: () => void;
}

export const useCrearProfesorConSede = (): UseCrearProfesorConSedeResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CreateProfesorConSedeResponse | null>(null);

  const crearProfesor = async (data: CreateProfesorConSedeRequest): Promise<CreateProfesorConSedeResponse | null> => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      console.log('🎯 [HOOK] Iniciando creación de profesor con sede...');
      const response = await EmpleadosService.createProfesorConSede(data);
      
      setResultado(response);
      console.log('✅ [HOOK] Profesor creado exitosamente');
      return response;

    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear profesor con sede';
      setError(errorMessage);
      console.error('❌ [HOOK] Error creando profesor:', errorMessage);
      return null;

    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResultado(null);
  };

  return {
    loading,
    error,
    resultado,
    crearProfesor,
    reset,
  };
};
