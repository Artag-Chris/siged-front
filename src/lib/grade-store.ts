import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface GradeQuota {
  id: string
  institucionId: string
  anioEscolar: number
  grado: string
  cuposTotales: number
  cuposAsignados: number
  jornada: "mañana" | "tarde" | "unica" | "noche"
  sede?: string
  observaciones?: string
}

export interface GradeQuotaFormData {
  institucionId: string
  anioEscolar: number
  grado: string
  cuposTotales: number
  jornada: "mañana" | "tarde" | "unica" | "noche"
  sede?: string
  observaciones?: string
}

export interface QuotaAssignment {
  id: string
  estudianteId: string
  institucionId: string
  sedeId?: string
  jornada: "mañana" | "tarde" | "unica" | "noche"
  grado: string
  grupo?: string
  modalidadAsignacion: "nueva_matricula" | "traslado" | "reintegro"
  fechaAsignacion: string
  observaciones?: string
}

export interface QuotaAssignmentFormData {
  estudianteId: string
  institucionId: string
  sedeId?: string
  jornada: "mañana" | "tarde" | "unica" | "noche"
  grado: string
  grupo?: string
  modalidadAsignacion: "nueva_matricula" | "traslado" | "reintegro"
  fechaAsignacion: string
  observaciones?: string
}

interface GradeState {
  gradeQuotas: GradeQuota[]
  quotaAssignments: QuotaAssignment[]
  isLoading: boolean

  getAllGradeQuotas: () => GradeQuota[]
  getAllQuotaAssignments: () => QuotaAssignment[]
  

  // Acciones para cupos por grado
  addGradeQuota: (quota: GradeQuotaFormData) => Promise<string>
  updateGradeQuota: (id: string, quota: Partial<GradeQuotaFormData>) => Promise<boolean>
  deleteGradeQuota: (id: string) => Promise<boolean>
  getGradeQuota: (id: string) => GradeQuota | undefined
  getGradeQuotasByInstitution: (institucionId: string, anioEscolar?: number) => GradeQuota[]

  // Acciones para asignaciones de cupos
  assignQuota: (assignment: QuotaAssignmentFormData) => Promise<boolean>
  updateQuotaAssignment: (id: string, assignment: Partial<QuotaAssignmentFormData>) => Promise<boolean>
  deleteQuotaAssignment: (id: string) => Promise<boolean>
  getQuotaAssignment: (id: string) => QuotaAssignment | undefined
  getQuotaAssignmentsByStudent: (estudianteId: string) => QuotaAssignment[]
  getQuotaAssignmentsByInstitution: (institucionId: string) => QuotaAssignment[]

  // Utilidades
  setLoading: (loading: boolean) => void
  incrementAssignedQuotas: (gradeQuotaId: string) => Promise<boolean>
  decrementAssignedQuotas: (gradeQuotaId: string) => Promise<boolean>
  getAvailableQuotas: (institucionId: string, grado: string, jornada: string, anioEscolar: number) => number
}

// Datos dummy para cupos por grado
const DUMMY_GRADE_QUOTAS: GradeQuota[] = [
  {
    id: "1",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "Transición",
    cuposTotales: 30,
    cuposAsignados: 25,
    jornada: "mañana",
    observaciones: "Grupo completo",
  },
  {
    id: "2",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "1",
    cuposTotales: 35,
    cuposAsignados: 30,
    jornada: "mañana",
    observaciones: "",
  },
  {
    id: "3",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "2",
    cuposTotales: 35,
    cuposAsignados: 28,
    jornada: "mañana",
    observaciones: "",
  },
  {
    id: "4",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "3",
    cuposTotales: 35,
    cuposAsignados: 32,
    jornada: "tarde",
    observaciones: "",
  },
  {
    id: "5",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "4",
    cuposTotales: 35,
    cuposAsignados: 30,
    jornada: "tarde",
    observaciones: "",
  },
  {
    id: "6",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "5",
    cuposTotales: 35,
    cuposAsignados: 33,
    jornada: "tarde",
    observaciones: "",
  },
  {
    id: "7",
    institucionId: "2", // I.E. Rural La Esperanza
    anioEscolar: 2024,
    grado: "Transición",
    cuposTotales: 20,
    cuposAsignados: 15,
    jornada: "unica",
    observaciones: "Grupo rural",
  },
  {
    id: "8",
    institucionId: "2", // I.E. Rural La Esperanza
    anioEscolar: 2024,
    grado: "1",
    cuposTotales: 25,
    cuposAsignados: 20,
    jornada: "unica",
    observaciones: "",
  },
  {
    id: "9",
    institucionId: "3", // I.E. Técnico Industrial
    anioEscolar: 2024,
    grado: "6",
    cuposTotales: 40,
    cuposAsignados: 38,
    jornada: "mañana",
    sede: "Sede Principal",
    observaciones: "Casi completo",
  },
  {
    id: "10",
    institucionId: "3", // I.E. Técnico Industrial
    anioEscolar: 2024,
    grado: "7",
    cuposTotales: 40,
    cuposAsignados: 35,
    jornada: "mañana",
    sede: "Sede Principal",
    observaciones: "",
  },
]

// Datos dummy para asignaciones de cupos
const DUMMY_QUOTA_ASSIGNMENTS: QuotaAssignment[] = [
  {
    id: "1",
    estudianteId: "1", // Ana María Gómez
    institucionId: "1", // I.E. San Judas Tadeo
    jornada: "tarde",
    grado: "5",
    grupo: "A",
    modalidadAsignacion: "nueva_matricula",
    fechaAsignacion: "2024-01-10",
    observaciones: "",
  },
  {
    id: "2",
    estudianteId: "2", // Juan Pablo Martínez
    institucionId: "2", // I.E. Rural La Esperanza
    jornada: "unica",
    grado: "3",
    modalidadAsignacion: "traslado",
    fechaAsignacion: "2024-01-15",
    observaciones: "Traslado por cambio de residencia",
  },
  {
    id: "3",
    estudianteId: "4", // Santiago Herrera
    institucionId: "3", // I.E. Técnico Industrial
    jornada: "mañana",
    grado: "6",
    grupo: "B",
    modalidadAsignacion: "traslado",
    fechaAsignacion: "2023-12-05",
    observaciones: "",
  },
  {
    id: "4",
    estudianteId: "5", // Sofía Ramírez
    institucionId: "1", // I.E. San Judas Tadeo
    jornada: "tarde",
    grado: "4",
    grupo: "A",
    modalidadAsignacion: "nueva_matricula",
    fechaAsignacion: "2024-01-12",
    observaciones: "",
  },
]

export const MODALIDADES_ASIGNACION = [
  { value: "nueva_matricula", label: "Nueva Matrícula" },
  { value: "traslado", label: "Traslado" },
  { value: "reintegro", label: "Reintegro" },
]

export const GRUPOS_DISPONIBLES = ["A", "B", "C", "D", "E"]

export const useGradeStore = create<GradeState>()(
  persist(
    (set, get) => ({
      gradeQuotas: DUMMY_GRADE_QUOTAS,
      quotaAssignments: DUMMY_QUOTA_ASSIGNMENTS,
      isLoading: false,

      addGradeQuota: async (quotaData: GradeQuotaFormData): Promise<string> => {
        set({ isLoading: true })

        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newQuota: GradeQuota = {
            id: Date.now().toString(),
            ...quotaData,
            cuposAsignados: 0,
          }

          set((state) => ({
            gradeQuotas: [...state.gradeQuotas, newQuota],
            isLoading: false,
          }))

          return newQuota.id
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      updateGradeQuota: async (id: string, quotaData: Partial<GradeQuotaFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            gradeQuotas: state.gradeQuotas.map((quota) => (quota.id === id ? { ...quota, ...quotaData } : quota)),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      deleteGradeQuota: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            gradeQuotas: state.gradeQuotas.filter((quota) => quota.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getGradeQuota: (id: string) => {
        return get().gradeQuotas.find((quota) => quota.id === id)
      },

      getGradeQuotasByInstitution: (institucionId: string, anioEscolar?: number) => {
        return get().gradeQuotas.filter(
          (quota) => quota.institucionId === institucionId && (anioEscolar ? quota.anioEscolar === anioEscolar : true),
        )
      },

      assignQuota: async (assignmentData: QuotaAssignmentFormData): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newAssignment: QuotaAssignment = {
            id: Date.now().toString(),
            ...assignmentData,
          }

          // Buscar el cupo correspondiente para incrementar cuposAsignados
          const matchingQuota = get().gradeQuotas.find(
            (quota) =>
              quota.institucionId === assignmentData.institucionId &&
              quota.grado === assignmentData.grado &&
              quota.jornada === assignmentData.jornada,
          )

          if (matchingQuota) {
            // Incrementar cupos asignados
            await get().incrementAssignedQuotas(matchingQuota.id)
          }

          set((state) => ({
            quotaAssignments: [...state.quotaAssignments, newAssignment],
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      updateQuotaAssignment: async (id: string, assignmentData: Partial<QuotaAssignmentFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            quotaAssignments: state.quotaAssignments.map((assignment) =>
              assignment.id === id ? { ...assignment, ...assignmentData } : assignment,
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

      deleteQuotaAssignment: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Obtener la asignación antes de eliminarla
          const assignment = get().quotaAssignments.find((assignment) => assignment.id === id)

          if (assignment) {
            // Buscar el cupo correspondiente para decrementar cuposAsignados
            const matchingQuota = get().gradeQuotas.find(
              (quota) =>
                quota.institucionId === assignment.institucionId &&
                quota.grado === assignment.grado &&
                quota.jornada === assignment.jornada,
            )

            if (matchingQuota) {
              // Decrementar cupos asignados
              await get().decrementAssignedQuotas(matchingQuota.id)
            }
          }

          set((state) => ({
            quotaAssignments: state.quotaAssignments.filter((assignment) => assignment.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getQuotaAssignment: (id: string) => {
        return get().quotaAssignments.find((assignment) => assignment.id === id)
      },

      getQuotaAssignmentsByStudent: (estudianteId: string) => {
        return get().quotaAssignments.filter((assignment) => assignment.estudianteId === estudianteId)
      },

      getQuotaAssignmentsByInstitution: (institucionId: string) => {
        return get().quotaAssignments.filter((assignment) => assignment.institucionId === institucionId)
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      incrementAssignedQuotas: async (gradeQuotaId: string): Promise<boolean> => {
        try {
          set((state) => ({
            gradeQuotas: state.gradeQuotas.map((quota) =>
              quota.id === gradeQuotaId ? { ...quota, cuposAsignados: quota.cuposAsignados + 1 } : quota,
            ),
          }))
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      },

      decrementAssignedQuotas: async (gradeQuotaId: string): Promise<boolean> => {
        try {
          set((state) => ({
            gradeQuotas: state.gradeQuotas.map((quota) =>
              quota.id === gradeQuotaId && quota.cuposAsignados > 0
                ? { ...quota, cuposAsignados: quota.cuposAsignados - 1 }
                : quota,
            ),
          }))
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      },

      getAvailableQuotas: (institucionId: string, grado: string, jornada: string, anioEscolar: number): number => {
        const quota = get().gradeQuotas.find(
          (q) =>
            q.institucionId === institucionId &&
            q.grado === grado &&
            q.jornada === jornada &&
            q.anioEscolar === anioEscolar,
        )

        if (!quota) return 0
        return Math.max(0, quota.cuposTotales - quota.cuposAsignados)
      },
      getAllGradeQuotas: () => {
        return get().gradeQuotas
      },

      getAllQuotaAssignments: () => {
        return get().quotaAssignments
      },
    }),
    {
      name: "grade-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        gradeQuotas: state.gradeQuotas,
        quotaAssignments: state.quotaAssignments,
      }),
    },
  ),
)
