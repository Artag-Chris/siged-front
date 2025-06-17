import { DUMMY_RUTAS, DUMMY_NOVEDADES } from "@/dummyData/dummyRutas"
import { RutaState, RutaFormData, Ruta, Novedad } from "@/interfaces"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useRutaStore = create<RutaState>()(
  persist(
    (set, get) => ({
      rutas: DUMMY_RUTAS,
      novedades: DUMMY_NOVEDADES,
      isLoading: false,
      currentRuta: null,

      addRuta: async (rutaData: RutaFormData): Promise<string> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Obtener cupo máximo del vehículo
          const vehiculoStore = await import('./vehiculo-store')
          const vehiculo = vehiculoStore.useVehiculoStore.getState().getVehiculo(rutaData.vehiculoId)
          const cuposDisponibles = vehiculo ? vehiculo.cupoMaximo : 0

          const newRuta: Ruta = {
            id: Date.now().toString(),
            ...rutaData,
            estudiantesAsignados: [],
            cuposDisponibles,
            estado: "Activa",
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
          }

          set((state) => ({
            rutas: [...state.rutas, newRuta],
            isLoading: false,
          }))

          return newRuta.id
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          throw error
        }
      },

      updateRuta: async (id: string, rutaData: Partial<RutaFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            rutas: state.rutas.map((ruta) =>
              ruta.id === id
                ? {
                    ...ruta,
                    ...rutaData,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : ruta,
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

      deleteRuta: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            rutas: state.rutas.filter((ruta) => ruta.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getRuta: (id: string) => {
        return get().rutas.find((ruta) => ruta.id === id)
      },

      getRutasByConductor: (conductorId: string) => {
        return get().rutas.filter((ruta) => ruta.conductorId === conductorId)
      },

      getRutasByInstitucion: (institucionId: string) => {
        return get().rutas.filter((ruta) => ruta.institucionId === institucionId)
      },

      setCurrentRuta: (ruta: Ruta | null) => {
        set({ currentRuta: ruta })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      searchRutas: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().rutas.filter(
          (ruta) =>
            ruta.nombre.toLowerCase().includes(lowercaseQuery) ||
            ruta.codigo.toLowerCase().includes(lowercaseQuery) ||
            (ruta.descripcion && ruta.descripcion.toLowerCase().includes(lowercaseQuery)),
        )
      },

      getAllRutas: () => {
        return get().rutas
      },

      assignEstudiante: async (rutaId: string, estudianteId: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            rutas: state.rutas.map((ruta) =>
              ruta.id === rutaId
                ? {
                    ...ruta,
                    estudiantesAsignados: [...ruta.estudiantesAsignados, estudianteId],
                    cuposDisponibles: Math.max(0, ruta.cuposDisponibles - 1),
                    fechaActualizacion: new Date().toISOString(),
                  }
                : ruta,
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

      removeEstudiante: async (rutaId: string, estudianteId: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            rutas: state.rutas.map((ruta) =>
              ruta.id === rutaId
                ? {
                    ...ruta,
                    estudiantesAsignados: ruta.estudiantesAsignados.filter((id) => id !== estudianteId),
                    cuposDisponibles: ruta.cuposDisponibles + 1,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : ruta,
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

      addNovedad: async (
        novedadData: Omit<Novedad, "id" | "fechaCreacion" | "fechaActualizacion">,
      ): Promise<string> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          const newNovedad: Novedad = {
            ...novedadData,
            id: Date.now().toString(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
          }

          set((state) => ({
            novedades: [...state.novedades, newNovedad],
            isLoading: false,
          }))

          return newNovedad.id
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          throw error
        }
      },

      updateNovedad: async (id: string, novedadData: Partial<Novedad>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            novedades: state.novedades.map((novedad) =>
              novedad.id === id
                ? {
                    ...novedad,
                    ...novedadData,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : novedad,
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

      getNovedadesByRuta: (rutaId: string) => {
        return get().novedades.filter((novedad) => novedad.rutaId === rutaId)
      },
    }),
    {
      name: "ruta-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rutas: state.rutas,
        novedades: state.novedades,
      }),
    },
  ),
)
