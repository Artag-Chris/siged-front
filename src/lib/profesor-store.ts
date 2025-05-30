import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Professor {
  id: string
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  cargo: string
  estado: "activa" | "inactiva"
  nivelEducativo: "preescolar" | "basica_primaria" | "basica_secundaria" | "media" | "superior"
  materias: string[]
  materiasAsignadas: string[]
  institucionGraduacion: string
  fechaVinculacion: string
  fechaNacimiento: string
  direccion: string
  experienciaAnios: number
  observaciones?: string
}

export interface ProfessorFormData {
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  cargo: string
  estado: "activa" | "inactiva"
  nivelEducativo: "preescolar" | "basica_primaria" | "basica_secundaria" | "media" | "superior"
  materias: string[]
  materiasAsignadas: string[]
  institucionGraduacion: string
  fechaVinculacion: string
  fechaNacimiento: string
  direccion: string
  experienciaAnios: number
  observaciones?: string
}

interface ProfessorState {
  professors: Professor[]
  isLoading: boolean
  currentProfessor: Professor | null

  // Actions
  addProfessor: (professor: ProfessorFormData) => Promise<boolean>
  updateProfessor: (id: string, professor: Partial<ProfessorFormData>) => Promise<boolean>
  deleteProfessor: (id: string) => Promise<boolean>
  getProfessor: (id: string) => Professor | undefined
  setCurrentProfessor: (professor: Professor | null) => void
  setLoading: (loading: boolean) => void

  // Filters and display options
  displayOptions: {
    mostrarNombres: boolean
    mostrarCedulas: boolean
    mostrarMaterias: boolean
    mostrarCargoActual: boolean
    mostrarMateriasAsignadas: boolean
    mostrarInstitucion: boolean
    mostrarEstados: boolean
    mostrarNivelEducativo: boolean
    mostrarFechaVinculacion: boolean
    botonEditarPerfil: boolean
  }
  updateDisplayOptions: (options: Partial<ProfessorState["displayOptions"]>) => void
}

// Datos dummy para profesores
const DUMMY_PROFESSORS: Professor[] = [
  {
    id: "1",
    nombres: "María Elena",
    apellidos: "González Pérez",
    cedula: "12345678",
    email: "maria.gonzalez@escuela.edu",
    telefono: "3001234567",
    cargo: "Docente Titular",
    estado: "activa",
    nivelEducativo: "basica_primaria",
    materias: ["Matemáticas", "Ciencias Naturales"],
    materiasAsignadas: ["Matemáticas 3°", "Ciencias 3°"],
    institucionGraduacion: "Universidad Pedagógica Nacional",
    fechaVinculacion: "2020-02-15",
    fechaNacimiento: "1985-06-20",
    direccion: "Calle 123 #45-67, Bogotá",
    experienciaAnios: 8,
    observaciones: "Excelente desempeño académico",
  },
  {
    id: "2",
    nombres: "Carlos Alberto",
    apellidos: "Rodríguez Silva",
    cedula: "87654321",
    email: "carlos.rodriguez@escuela.edu",
    telefono: "3009876543",
    cargo: "Coordinador Académico",
    estado: "activa",
    nivelEducativo: "basica_secundaria",
    materias: ["Física", "Química", "Matemáticas"],
    materiasAsignadas: ["Física 10°", "Química 11°"],
    institucionGraduacion: "Universidad Nacional de Colombia",
    fechaVinculacion: "2018-08-01",
    fechaNacimiento: "1980-03-15",
    direccion: "Carrera 50 #30-20, Medellín",
    experienciaAnios: 12,
    observaciones: "Líder en proyectos de innovación educativa",
  },
]

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
