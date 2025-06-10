import { Student } from "../Student"

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

export interface GradeState {
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
export interface AssignQuotaParams {
  selectedStudent: Student | null
  selectedInstitution: string
  selectedGrado: string
  selectedJornada: string
  selectedGrupo: string
  selectedModalidad: string
  selectedDate: Date
  observaciones: string
  currentAvailableQuotas: number
  assignQuota: (data: any) => Promise<boolean>
  assignInstitution: (
    studentId: string,
    institutionId: string,
    date: string,
    status: string
  ) => Promise<boolean>
  setError: (error: string) => void
  setSuccess: (success: string) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  resetForm: () => void
}