import { DUMMY_INSTITUTIONS } from "@/dummyData"
import { Institution, InstitutionFormData, InstitutionState } from "@/interfaces"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set, get) => ({
      institutions: DUMMY_INSTITUTIONS,
      isLoading: false,
      currentInstitution: null,

      addInstitution: async (institutionData: InstitutionFormData): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newInstitution: Institution = {
            id: Date.now().toString(),
            ...institutionData,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
          }

          set((state) => ({
            institutions: [...state.institutions, newInstitution],
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      updateInstitution: async (id: string, institutionData: Partial<InstitutionFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            institutions: state.institutions.map((inst) =>
              inst.id === id
                ? {
                    ...inst,
                    ...institutionData,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : inst,
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

      deleteInstitution: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            institutions: state.institutions.filter((inst) => inst.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getInstitution: (id: string) => {
        return get().institutions.find((inst) => inst.id === id)
      },

      setCurrentInstitution: (institution: Institution | null) => {
        set({ currentInstitution: institution })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: "institution-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        institutions: state.institutions,
      }),
    },
  ),
)
