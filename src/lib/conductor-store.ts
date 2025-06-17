import { DUMMY_CONDUCTORES } from "@/dummyData/dummyConductores"
import { ConductorState, ConductorFormData, Conductor } from "@/interfaces"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useConductorStore = create<ConductorState>()(
  persist(
    (set, get) => ({
      conductores: DUMMY_CONDUCTORES,
      isLoading: false,
      currentConductor: null,

      addConductor: async (conductorData: ConductorFormData): Promise<string> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newConductor: Conductor = {
            id: Date.now().toString(),
            ...conductorData,
            estado: "Activo",
            fechaIngreso: new Date().toISOString(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
          }

          set((state) => ({
            conductores: [...state.conductores, newConductor],
            isLoading: false,
          }))

          return newConductor.id
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          throw error
        }
      },

      updateConductor: async (id: string, conductorData: Partial<ConductorFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            conductores: state.conductores.map((conductor) =>
              conductor.id === id
                ? {
                    ...conductor,
                    ...conductorData,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : conductor,
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

      deleteConductor: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            conductores: state.conductores.filter((conductor) => conductor.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getConductor: (id: string) => {
        return get().conductores.find((conductor) => conductor.id === id)
      },

      getConductorByDocument: (tipoDocumento: string, numeroDocumento: string) => {
        return get().conductores.find(
          (conductor) => conductor.tipoDocumento === tipoDocumento && conductor.numeroDocumento === numeroDocumento,
        )
      },

      setCurrentConductor: (conductor: Conductor | null) => {
        set({ currentConductor: conductor })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      searchConductores: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().conductores.filter(
          (conductor) =>
            conductor.nombreCompleto.toLowerCase().includes(lowercaseQuery) ||
            conductor.numeroDocumento.includes(query) ||
            conductor.licenciaConducir.includes(query),
        )
      },

      getAllConductores: () => {
        return get().conductores
      },

      getConductoresActivos: () => {
        return get().conductores.filter((conductor) => conductor.estado === "Activo")
      },
    }),
    {
      name: "conductor-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conductores: state.conductores,
      }),
    },
  ),
)
