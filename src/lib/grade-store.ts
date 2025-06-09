import { DUMMY_GRADE_QUOTAS, DUMMY_QUOTA_ASSIGNMENTS } from "@/dummyData"
import { GradeQuota, GradeQuotaFormData, GradeState, QuotaAssignment, QuotaAssignmentFormData } from "@/interfaces/intex"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

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
          console.log
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
