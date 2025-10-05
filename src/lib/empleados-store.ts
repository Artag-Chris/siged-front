// lib/empleados-store.ts
// Store de Zustand para gestión de empleados/profesores

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import EmpleadosService from '@/services/empleados.service';
import { useJwtAuthStore } from './jwt-auth-store';
import {
  Empleado,
  CreateEmpleadoRequest,
  UpdateEmpleadoRequest,
  EmpleadoFilters,
  CreateComentarioEmpleado,
  ComentarioEmpleado,
  EmpleadoDocumentUpload,
  EmpleadosStore
} from '@/types/empleados.types';

export const useEmpleadosStore = create<EmpleadosStore>()(
  persist(
    (set, get) => ({
      // =============== ESTADO INICIAL ===============
      empleados: [],
      selectedEmpleado: null,
      isLoading: false,
      error: null,
      filters: {
        page: 1,
        limit: 10,
        orderBy: 'created_at',
        orderDirection: 'desc'
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      },

      // =============== OBTENER EMPLEADOS ===============
      getEmpleados: async (filters?: EmpleadoFilters): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          const finalFilters = { ...get().filters, ...filters };
          console.log('🔍 [EMPLEADOS-STORE] Obteniendo empleados con filtros:', finalFilters);

          const response = await EmpleadosService.getEmpleados(finalFilters);

          set({
            empleados: response.data,
            pagination: response.pagination,
            filters: finalFilters,
            isLoading: false,
            error: null
          });

          console.log('✅ [EMPLEADOS-STORE] Empleados cargados:', response.data.length);

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error cargando empleados:', error.message);
          set({
            empleados: [],
            isLoading: false,
            error: error.message
          });
        }
      },

      // =============== OBTENER EMPLEADO POR ID ===============
      getEmpleadoById: async (id: string): Promise<Empleado | null> => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔍 [EMPLEADOS-STORE] Obteniendo empleado por ID:', id);

          const empleado = await EmpleadosService.getEmpleadoById(id);

          set({
            selectedEmpleado: empleado,
            isLoading: false,
            error: null
          });

          console.log('✅ [EMPLEADOS-STORE] Empleado obtenido:', empleado.id);
          return empleado;

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error obteniendo empleado:', error.message);
          set({
            selectedEmpleado: null,
            isLoading: false,
            error: error.message
          });
          return null;
        }
      },

      // =============== CREAR EMPLEADO ===============
      createEmpleado: async (data: CreateEmpleadoRequest): Promise<Empleado | null> => {
        set({ isLoading: true, error: null });

        try {
          console.log('👤 [EMPLEADOS-STORE] Creando empleado:', data.nombre, data.apellido);

          const newEmpleado = await EmpleadosService.createEmpleado(data);

          // Agregar a la lista local
          set((state) => ({
            empleados: [newEmpleado, ...state.empleados],
            isLoading: false,
            error: null
          }));

          console.log('✅ [EMPLEADOS-STORE] Empleado creado exitosamente:', newEmpleado.id);
          return newEmpleado;

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error creando empleado:', error.message);
          set({
            isLoading: false,
            error: error.message
          });
          return null;
        }
      },

      // =============== ACTUALIZAR EMPLEADO ===============
      updateEmpleado: async (id: string, data: UpdateEmpleadoRequest): Promise<Empleado | null> => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔄 [EMPLEADOS-STORE] Actualizando empleado:', id);

          const updatedEmpleado = await EmpleadosService.updateEmpleado(id, data);

          // Actualizar en la lista local
          set((state) => ({
            empleados: state.empleados.map(emp => 
              emp.id === id ? updatedEmpleado : emp
            ),
            selectedEmpleado: state.selectedEmpleado?.id === id ? updatedEmpleado : state.selectedEmpleado,
            isLoading: false,
            error: null
          }));

          console.log('✅ [EMPLEADOS-STORE] Empleado actualizado exitosamente');
          return updatedEmpleado;

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error actualizando empleado:', error.message);
          set({
            isLoading: false,
            error: error.message
          });
          return null;
        }
      },

      // =============== ELIMINAR EMPLEADO ===============
      deleteEmpleado: async (id: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          console.log('🗑️ [EMPLEADOS-STORE] Eliminando empleado:', id);

          const success = await EmpleadosService.deleteEmpleado(id);

          if (success) {
            // Remover de la lista local
            set((state) => ({
              empleados: state.empleados.filter(emp => emp.id !== id),
              selectedEmpleado: state.selectedEmpleado?.id === id ? null : state.selectedEmpleado,
              isLoading: false,
              error: null
            }));

            console.log('✅ [EMPLEADOS-STORE] Empleado eliminado exitosamente');
          }

          return success;

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error eliminando empleado:', error.message);
          set({
            isLoading: false,
            error: error.message
          });
          return false;
        }
      },

      // =============== AGREGAR COMENTARIO ===============
      addComentario: async (data: CreateComentarioEmpleado): Promise<ComentarioEmpleado | null> => {
        set({ isLoading: true, error: null });

        try {
          console.log('💬 [EMPLEADOS-STORE] Agregando comentario a empleado:', data.empleado_id);

          const comentario = await EmpleadosService.addComentario(data);

          set({
            isLoading: false,
            error: null
          });

          console.log('✅ [EMPLEADOS-STORE] Comentario agregado exitosamente');
          return comentario;

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error agregando comentario:', error.message);
          set({
            isLoading: false,
            error: error.message
          });
          return null;
        }
      },

      // =============== SUBIR DOCUMENTO ===============
      uploadDocument: async (data: EmpleadoDocumentUpload): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          console.log('📎 [EMPLEADOS-STORE] Subiendo documento para empleado:', data.empleado_id);

          // USAR UUID REAL DEL EMPLEADO SELECCIONADO
          const currentUser = useJwtAuthStore.getState().getCurrentUser();
          if (!currentUser) {
            throw new Error('Usuario no autenticado');
          }

          // Usar el UUID real del empleado en lugar de datos dummy
          const uploadData: EmpleadoDocumentUpload = {
            ...data,
            empleado_id: data.empleado_id // Ya viene el UUID real
          };

          const success = await EmpleadosService.uploadDocument(uploadData);

          set({
            isLoading: false,
            error: null
          });

          if (success) {
            console.log('✅ [EMPLEADOS-STORE] Documento subido exitosamente para empleado:', data.empleado_id);
          }

          return success;

        } catch (error: any) {
          console.error('❌ [EMPLEADOS-STORE] Error subiendo documento:', error.message);
          set({
            isLoading: false,
            error: error.message
          });
          return false;
        }
      },

      // =============== ESTADO LOCAL ===============
      setSelectedEmpleado: (empleado: Empleado | null): void => {
        set({ selectedEmpleado: empleado });
        console.log('📌 [EMPLEADOS-STORE] Empleado seleccionado:', empleado?.id || 'ninguno');
      },

      setFilters: (filters: Partial<EmpleadoFilters>): void => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
        console.log('🔧 [EMPLEADOS-STORE] Filtros actualizados:', filters);
      },

      clearError: (): void => {
        set({ error: null });
      },

      setLoading: (loading: boolean): void => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'empleados-storage',
      partialize: (state) => ({
        empleados: state.empleados,
        selectedEmpleado: state.selectedEmpleado,
        filters: state.filters,
        pagination: state.pagination
      }),
    }
  )
);