

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { SolicitudCupo, SolicitudCupoFormData, SolicitudCupoState } from "@/interfaces/solicitud-cupo/solicitud-cupo"
import { useRadicadoStore } from "./radicado-store"
import { DUMMY_SOLICITUDES } from "@/dummyData/dummySolicitudes"

export const useSolicitudCupoStore = create<SolicitudCupoState>()(
  persist(
    (set, get) => ({
      solicitudes: DUMMY_SOLICITUDES,
      isLoading: false,
      currentSolicitud: null,

      addSolicitud: async (solicitudData: SolicitudCupoFormData): Promise<string> => {
        set({ isLoading: true })

        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1500))

          const radicado = useRadicadoStore.getState().generateRadicado()

          const newSolicitud: SolicitudCupo = {
            id: Date.now().toString(),
            ...solicitudData,
            estadoCupo: "Pendiente",
            radicado,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
          }

          set((state) => ({
            solicitudes: [...state.solicitudes, newSolicitud],
            isLoading: false,
          }))

          return radicado
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          throw error
        }
      },

      updateSolicitud: async (id: string, solicitudData: Partial<SolicitudCupoFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            solicitudes: state.solicitudes.map((solicitud) =>
              solicitud.id === id
                ? {
                    ...solicitud,
                    ...solicitudData,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : solicitud,
            ),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      deleteSolicitud: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            solicitudes: state.solicitudes.filter((solicitud) => solicitud.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getSolicitud: (id: string) => {
        return get().solicitudes.find((solicitud) => solicitud.id === id)
      },

      getSolicitudByRadicado: (radicado: string) => {
        return get().solicitudes.find((solicitud) => solicitud.radicado === radicado)
      },

      getSolicitudesByInstitution: (institucionId: string) => {
        return get().solicitudes.filter((solicitud) => solicitud.colegioSeleccionado === institucionId)
      },

      getSolicitudesByEstado: (estado: "Pendiente" | "Aceptado" | "Rechazado") => {
        return get().solicitudes.filter((solicitud) => solicitud.estadoCupo === estado)
      },

      setCurrentSolicitud: (solicitud: SolicitudCupo | null) => {
        set({ currentSolicitud: solicitud })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      updateEstadoCupo: async (id: string, estado: "Pendiente" | "Aceptado" | "Rechazado"): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            solicitudes: state.solicitudes.map((solicitud) =>
              solicitud.id === id
                ? {
                    ...solicitud,
                    estadoCupo: estado,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : solicitud,
            ),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      searchSolicitudes: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().solicitudes.filter(
          (solicitud) =>
            solicitud.nombreNino.toLowerCase().includes(lowercaseQuery) ||
            solicitud.documentoNino.includes(query) ||
            solicitud.radicado.toLowerCase().includes(lowercaseQuery) ||
            solicitud.nombreAcudiente.toLowerCase().includes(lowercaseQuery),
        )
      },

      getAllSolicitudes: () => {
        return get().solicitudes
      },
    }),
    {
      name: "solicitud-cupo-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        solicitudes: state.solicitudes,
      }),
    },
  ),
)
