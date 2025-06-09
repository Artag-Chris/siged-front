import { DUMMY_PROFESSORS } from "@/dummyData/dummyProfessors"
import { ProfessorState, ProfessorFormData, Professor } from "@/interfaces/Professor"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useProfessorStore = create<ProfessorState>()(
  persist(
    (set, get) => ({
      professors: DUMMY_PROFESSORS,
      isLoading: false,
      currentProfessor: null,

      addProfessor: async (professorData: ProfessorFormData): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newProfessor: Professor = {
            id: Date.now().toString(),
            ...professorData,
          }

          set((state) => ({
            professors: [...state.professors, newProfessor],
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.error("Error adding professor:", error)
          set({ isLoading: false })
          return false
        }
      },

      updateProfessor: async (id: string, professorData: Partial<ProfessorFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            professors: state.professors.map((prof) => (prof.id === id ? { ...prof, ...professorData } : prof)),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.error("Error updatimg professor:", error)
          set({ isLoading: false })
          return false
        }
      },

      deleteProfessor: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            professors: state.professors.filter((prof) => prof.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.error("Error deleting professor:", error)
          set({ isLoading: false })
          return false
        }
      },

      getProfessor: (id: string) => {
        return get().professors.find((prof) => prof.id === id)
      },

      setCurrentProfessor: (professor: Professor | null) => {
        set({ currentProfessor: professor })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      displayOptions: {
        mostrarNombres: true,
        mostrarCedulas: true,
        mostrarMaterias: true,
        mostrarCargoActual: true,
        mostrarMateriasAsignadas: true,
        mostrarInstitucion: true,
        mostrarEstados: true,
        mostrarNivelEducativo: true,
        mostrarFechaVinculacion: true,
        botonEditarPerfil: true,
      },

      updateDisplayOptions: (options) => {
        set((state) => ({
          displayOptions: { ...state.displayOptions, ...options },
        }))
      },
    }),
    {
      name: "professor-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        professors: state.professors,
        displayOptions: state.displayOptions,
      }),
    },
  ),
)
